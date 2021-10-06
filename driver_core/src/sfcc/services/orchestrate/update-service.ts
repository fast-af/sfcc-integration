/* eslint-disable indent */
import { V1CartToOrderConvert } from "../../../core/object-definitions/v1/models/v1-cart-to-order-convert";
import { V1EntityType } from "../../../core/object-definitions/v1/models/v1-entity-type";
import { V1OrderItemUpdate } from "../../../core/object-definitions/v1/models/v1-order-item-update";
import { V1OrderLine } from "../../../core/object-definitions/v1/models/v1-order-line";
import { V1OrderStatus } from "../../../core/object-definitions/v1/models/v1-order-status";
import { V1UpdateRequest } from "../../../core/object-definitions/v1/models/v1-update-request";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import { V1OrderAddressToOrderAddressShipToFlatMap, V1OrderAddressToOrderAddressBillToMap, V1UpdateRequestToV1UpdateResponseMap } from "../../mapper/v1-fast-update";
import { BasketToV1UpdateResponseMap } from "../../mapper/v1-fast-basket";
import { OrderToV1ReadResponseMap } from "../../mapper/v1-fast-order";
import { formattedLog, pinoProd } from "../../../util/common-util";
import BasketService from "../api/basket-service";
import BaseService from "./base-service";
import OCAPI from "sfcc-ocapi-documents";
import CommonService from "./common-service";
import OrderService from "../api/order-service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectMapper = require("object-mapper");

/**
 * A service class to orchestrate the update flow
 * sequence from Fast -> Seller integration.
 */
export default class UpdateService extends CommonService implements BaseService {
  /**
   * Private variables.
   */
  private basketService: BasketService | null;
  private orderService: OrderService | null;
  private basket: OCAPI.Basket | null;
  private orderUpdateStatuses = [V1OrderStatus.BOOKED, V1OrderStatus.CANCELED, V1OrderStatus.PENDINGFULFILLMENT];
  private token;

  /**
   * Constructor.
   * 
   * @param token {string} - SFCC OCAPI bearer token.
   */
  constructor(token: string) {
    super();
    this.token = token;
    this.basketService = null;
    this.orderService = null;
    this.basket = null;
  };

  /**
   * Method implementation from base.
   */
  async orchestrate(request: V1UpdateRequest): Promise<EcommObject> {
    // Invalid order segment.
    if (!request.order) {
      throw new Error("4002");
    };
    // Get the basketId.
    const basketId = request.order.externalId as string;
    // Invalid or missing basket id.
    if (!basketId) {
      throw new Error("5001")
    };
    switch (request.type) {
      // Only valid entity type for an update.
      case V1EntityType.ORDER: {
        let commerceObjectWithImage = null;
        // Order updates from Fast.
        const fastStatus = request.order.status as V1OrderStatus;
        if (this.orderUpdateStatuses.includes(fastStatus)) {
          commerceObjectWithImage = await this.bookOrFinalizeOrder(request);
        } else {
          commerceObjectWithImage = await this.handleCommerceCart(request, basketId);
        };

        return await this.getBasketWithImageUrls(commerceObjectWithImage, this.token)
      };
      // Other entity types are ignored.
      case V1EntityType.CATALOGCATEGORY:
      case V1EntityType.CATALOGPRODUCT:
      case V1EntityType.ORDERSYNC:
      case V1EntityType.SHIPPINGOPTION:
      case V1EntityType.SHIPPINGZONES:
      case V1EntityType.USER:
      case V1EntityType.WEBHOOK:{
        throw new Error("1003");
      };
      case V1EntityType.UNSPECIFIED:
      default:{
        throw new Error("4003");
      };
    };
  };

  /**
   * Method implementation from base.
   */
  responseMap(typesafeFastRequest: V1UpdateRequest, rawCommerceResponse: EcommObject, response: unknown): void {
    objectMapper.merge(typesafeFastRequest, response, { ...V1UpdateRequestToV1UpdateResponseMap });

    // Order status from Fast.
    const fastStatus = typesafeFastRequest.order?.status as V1OrderStatus;
    // Map an order object if the convertCartToOrder is true.
    if (typesafeFastRequest && typesafeFastRequest.order && (typesafeFastRequest.order.convertCartToOrder
      || this.orderUpdateStatuses.includes(fastStatus))) {
      objectMapper.merge(rawCommerceResponse, response, { ...OrderToV1ReadResponseMap });
    } else {
      objectMapper.merge(rawCommerceResponse, response, { ...BasketToV1UpdateResponseMap });
    };
  };

  /**
   * Get a common basket service class ready for consumption.
   * 
   * @returns {BasketService} - An instantiated basket service class.
   */
  private getBasketService(): BasketService {
    if (this.basketService === null) {
      const basketService = new BasketService(this.token);
      this.basketService = basketService;
    };

    return this.basketService;
  };

  /**
   * Get a common order service class ready for consumption.
   * 
   * @returns {OrderService} - An instantiated order service class.
   */
  private getOrderService(): OrderService {
    if (this.orderService === null) {
      const orderService = new OrderService(this.token);
      this.orderService = orderService;
    };

    return this.orderService;
  };

  /**
   * Get the SFCC basket one time only that can be consumed
   * for the entire request session.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @returns {OCAPI.Basket} - SFCC Basket document.
   */
  private async getBasket(basketId: string): Promise<OCAPI.Basket> {
    // Fetch and keep the original basket as the
    // basket values may be required.
    if (this.basket === null) {
      this.basket = await this.getBasketService().getBasket(basketId);
    };

    return this.basket;
  };

  /**
   * Get the SFCC product id.
   * 
   * @param productItem {V1OrderLine} - the Fast product line item.
   * @returns {string} - the actual commerce product id.
   */
  private getProductId(productItem: V1OrderLine): string {
    const fastProductId = productItem.externalVariantId ? productItem.externalVariantId : productItem.externalProductId;
    return fastProductId as string;
  };

  /**
   * Get the resource state from the basket object.
   * 
   * @param basket {OCAPI.Basket} - SFCC Basket document.
   * @returns {string} - the current resource state.
   */
  private getResourceState(basket: any): string {
    // The NPM SFCC OCAPI plugin adds the _resource_state in the
    // Response<T> as per the documentation.  Hence an extract
    // function is required.
    return basket._resource_state;
  };

  /**
   * Handle order update to change the status to booked and
   * pending for fulfillment.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @returns {Promise<OCAPI.Order>} - An Order object.
   */
  private async bookOrFinalizeOrder(request: V1UpdateRequest): Promise<OCAPI.Order> {
    const orderId = request.order?.externalId as string;

    // Need to set the order status to have a logically relevant
    // status once the order is created.
    const order = await this.getOrderService().getOrder(orderId);
    const orderCopy = { ...order } as any;
    orderCopy.c_fastStatus = request?.order?.status;

    // Modify order after changing the status.
    await this.getOrderService().modifyOrder(orderId, orderCopy);
    // Return the modified order.
    return await this.getOrderService().getOrder(orderId);
  };

  /**
   * Handle updates to an SFCC Basket.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   * @returns {Promise<OCAPI.Basket | OCAPI.Order>} - A Basket or an Order object.
   */
  private async handleCommerceCart(request: V1UpdateRequest, basketId: string): Promise<OCAPI.Basket | OCAPI.Order> {
    let updatedCommerceObject = null;

    // Handle Coupon.
    await this.handleCoupon(request, basketId);

    // Handle Shipping Address.
    await this.handleShippingAddress(request, basketId);

    // Handle Customer Association.
    await this.handleCustomerAssociation(request, basketId);

    // Handle Billing Address.
    await this.handleBillingAddress(request, basketId);

    // Handle line items.
    await this.handleBasketLineItems(request, basketId);

    // Handle Shipping method.
    await this.handleShippingMethod(request, basketId);

    /**
     * Convert cart to order.
     */
    if (request.order?.convertCartToOrder) {
      updatedCommerceObject = await this.handleCartConversion(request, basketId);
    } else {
      // Get the updated basket.
      updatedCommerceObject = await this.getBasketService().getBasket(basketId);
    };

    return updatedCommerceObject;
  };

  /**
   * Apply or remove coupon.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   */
  private async handleCoupon(request: V1UpdateRequest, basketId: string): Promise<void> {
    if (request.order?.coupon && request.order?.coupon.code) {
      const commerceBasket = await this.getBasket(basketId);
      // Get the remove property.
      const remove = request.order.coupon.remove as boolean;
      // Get the coupon code.
      const couponCode = request.order.coupon.code;

      if (remove) {
        if (commerceBasket.coupon_items && commerceBasket.coupon_items.length > 0) {
          const appliedCoupons = commerceBasket.coupon_items.filter(couponItem => couponItem.code === couponCode);
          if (appliedCoupons.length > 0) {
            await this.getBasketService().removeCoupon(basketId, appliedCoupons[0].coupon_item_id);
          };
        };
      } else {
        await this.getBasketService().addCoupon(basketId, couponCode);
      };
    };
  };

  /**
   * Add or update shipping address.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   */
  private async handleShippingAddress(request: V1UpdateRequest, basketId: string): Promise<void> {
    if (request.order?.shipments) {
      const commerceBasket = await this.getBasket(basketId);
      // Map the order address from the request.
      // The resultant shipping address will be an array.
      const shippingAddress: OCAPI.OrderAddress[] = objectMapper(request, V1OrderAddressToOrderAddressShipToFlatMap);
      // TODO: Future phase: There may be possibly multiple
      // shipments supported with more than one shipping address.
      const addressPromises = commerceBasket.shipments.map(shipment => 
        this.getBasketService().updateShippingAddress(basketId, shipment.shipment_id, shippingAddress[0])
      );
      await Promise.all(addressPromises);
    };
  };

  /**
   * Associate customer to a basket.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   */
  private async handleCustomerAssociation(request: V1UpdateRequest, basketId: string): Promise<void> {
    if (request.order?.userInfo) {
      const commerceBasket = await this.getBasket(basketId);
      const basketCopy = { ...commerceBasket } as any;

      await this.getBasketService().associateCustomerToBasket(basketId, {
        _resource_state: this.getResourceState(basketCopy),
        c_fastEmailId: request.order.userInfo.email as string,
      });
    };
  };

  /**
   * Add or update billing address.
   * 
   * Payment is done by default and hence will be ignored.
   * Moreover, no payment related info in the request or
   * response object.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   */
  private async handleBillingAddress(request: V1UpdateRequest, basketId: string): Promise<void> {
    if (request.order?.billTo) {
      // Map the order address from the request.
      const billingAddress: OCAPI.OrderAddress = objectMapper(request, V1OrderAddressToOrderAddressBillToMap);
      await this.getBasketService().addBillingAddress(basketId, billingAddress);
    };
  };

  /**
   * Add, update, or delete line item(s).
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   */
  private async handleBasketLineItems(request: V1UpdateRequest, basketId: string): Promise<void> {
    if (request.order?.items) {
      const commerceBasket = await this.getBasket(basketId);
      const existingProductIds = commerceBasket.product_items ? commerceBasket.product_items.flatMap(item => item.product_id) : [];

      // Call the Basket service's update line item.
      await this.handleUpdateLineItems(commerceBasket, request.order.items, existingProductIds, basketId);

      // Call the Basket service's add line item.
      await this.handleAddLineItems(request.order.items, existingProductIds, basketId);

      // Call the Basket service's delete/remove line item.
      await this.handleDeleteLineItems(commerceBasket, request.order.items, existingProductIds, basketId);
    };
  };

  /**
   * Update line items.
   * 
   * @param commerceBasket {OCAPI.Basket} - SFCC Basket document.
   * @param items {V1OrderItemUpdate[]} - Fast order line items to update.
   * @param existingProductIds {string[]} - Existing product ids in the basket.
   * @param basketId {string} - SFCC Basket id.
   */
  private async handleUpdateLineItems(commerceBasket: OCAPI.Basket, items: V1OrderItemUpdate[]
    , existingProductIds: string[], basketId: string): Promise<void> {
    // Update items - make sure the quantity is > 0.
    const itemsToUpdate = items.filter(item => existingProductIds.includes(this.getProductId(item))
      && item.quantity && item.quantity > 0);

    // Call the Basket service's update line item.
    if (itemsToUpdate.length > 0) {
      for (let i = 0; i < itemsToUpdate.length; i++) {
        if (commerceBasket.product_items) {
          // Get product line items that matches with the fast line item in the request.
          const productItemsToUpdate = commerceBasket.product_items
            .filter(productItem => productItem.product_id === this.getProductId(itemsToUpdate[i]));
          // Update the item.
          const updateItemsPromises = productItemsToUpdate.map(productItem => 
            this.getBasketService().updateLineItem(basketId, productItem.item_id, {
              _resource_state: this.getResourceState(commerceBasket),
              product_id: productItem.product_id,
              quantity: itemsToUpdate[i].quantity as number,
            })
          );
          await Promise.all(updateItemsPromises);
        };
      };
    };
  };

  /**
   * Add line items.
   * 
   * @param items {V1OrderItemUpdate[]} - Fast order line items to update.
   * @param existingProductIds {string[]} - Existing product ids in the basket.
   * @param basketId {string} - SFCC Basket id.
   */
  private async handleAddLineItems(items: V1OrderItemUpdate[], existingProductIds: string[], basketId: string): Promise<void> {
    // Add items - make sure the quantity is > 0.
    const itemsToAdd = items.filter(item => !existingProductIds.includes(this.getProductId(item))
      && item.quantity && item.quantity > 0);

    // Call the Basket service's add line item.
    if (itemsToAdd.length > 0) {
      const lineItems = itemsToAdd.flatMap(item => ({
        product_id: this.getProductId(item),
        quantity: item.quantity as number,
        c_fastProdLineId: item.itemId?.value,
      }));
      await this.getBasketService().addLineItem(basketId, lineItems);
    };
  };

  /**
   * Delete line items.
   * 
   * @param commerceBasket {OCAPI.Basket} - SFCC Basket document.
   * @param items {V1OrderItemUpdate[]} - Fast order line items to update.
   * @param existingProductIds {string[]} - Existing product ids in the basket.
   * @param basketId {string} - SFCC Basket id.
   */
  private async handleDeleteLineItems(commerceBasket: OCAPI.Basket, items: V1OrderItemUpdate[]
    , existingProductIds: string[], basketId: string): Promise<void> {
    // Remove/delete items - make sure the quantity is <= 0 or undefined.
    const itemsToDelete = items.filter(item => existingProductIds.includes(this.getProductId(item))
      && (!item.quantity || item.quantity === 0));

        // Call the Basket service's delete/remove line item.
    if (itemsToDelete.length > 0) {
      for (let i = 0; i < itemsToDelete.length; i++) {
        if (commerceBasket.product_items) {
          // Get product line items that matches with the fast line item in the request.
          const productItemsToDelete = commerceBasket.product_items
            .filter(productItem => productItem.product_id === this.getProductId(itemsToDelete[i]));
          // Update the item.
          const deleteItemsPromises = productItemsToDelete.map(productItem => 
            this.getBasketService().deleteLineItem(basketId, productItem.item_id)
          );
          await Promise.all(deleteItemsPromises);
        };
      };
    };
  };

  /**
   * Add or update shipping method.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   */
  private async handleShippingMethod(request: V1UpdateRequest, basketId: string): Promise<void> {
    if (request.order?.shippingOption) {
      const commerceBasket = await this.getBasket(basketId);
      const shipment = commerceBasket.shipments[0];
      await this.getBasketService().updateShipment(basketId, shipment.shipment_id, {
        ...shipment,
        c_fastPlanId: request.order.shippingOption.planId?.value as string
      });
      // TODO: Future phase: There may be possibly multiple
      // shipments supported with more than one shipping address.
      const shippmentMethodPromises = commerceBasket.shipments.map(shipment => 
        this.getBasketService().updateShippingMethod(basketId, shipment.shipment_id, {
          id: request.order?.shippingOption?.externalOptionId as string
        })
      );
      await Promise.all(shippmentMethodPromises);
    };
  };

  /**
   * Convert cart to order.
   * 
   * @param request {V1UpdateRequest} - Fast update request object.
   * @param basketId {string} - SFCC Basket Id.
   * @returns {Promise<OCAPI.Order} - SFCC Order document.
   */
  private async handleCartConversion(request: V1UpdateRequest, basketId: string): Promise<OCAPI.Order> {
    const convertMode = request.order?.convertMode as V1CartToOrderConvert;
    const validConvertModes = [V1CartToOrderConvert.UPDATEANDCONVERT, V1CartToOrderConvert.ONLY];
    if (validConvertModes.includes(convertMode)) {
      const commerceBasket = await this.getBasket(basketId);
      const basketCopy = { ...commerceBasket } as any;

      if (basketCopy._flash && basketCopy._flash.length > 0) {
        const validationErrors = basketCopy._flash.flatMap((flash: any) => flash.type);
        pinoProd.error(formattedLog("Validation Errors in basket.", validationErrors));
        throw new Error("4031");
      } else {
        // The c_applicableShippingMethods is custom and not required.
        delete basketCopy.c_applicableShippingMethods;
        // Convert cart to order.
        const order = await this.getOrderService().createOrder(commerceBasket);
        // Return the created order.
        return await this.getOrderService().getOrder(order.order_no);
      };
    } else {
      throw new Error("4025");
    };
  };
};