/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable indent */
import {
  V1UpdateRequestShipmentAddressToMagentoAddress,
  V1UpdateRequestBillingAddressToMagentoAddress,
  V1UpdateRequestItemsToMagentoItems,
} from "../../mapper/v1-fast-update";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import { V1EntityType } from "../../../core/object-definitions/v1/models/v1-entity-type";
import { V1UpdateRequest } from "../../../core/object-definitions/v1/models/v1-update-request";
import BaseService from "./base-service";
import CartService from "../api/cart-service";
import ProductService from "../api/product-service";
import ShippingService from "../api/shipping-service";
import OrderService from "../api/order-service";
import ShippingAssignment from "../../models/shipping-assignment";
import Address from "../../models/address";
import { V1UpdateRequestToCartMap } from "../../mapper/v1-fast-cart";
import { V1OrderStatus } from "../../../core/object-definitions/v1/models/v1-order-status";
const objectMapper = require("object-mapper");

export default class UpdateService implements BaseService {
  async orchestrate(
    request: V1UpdateRequest,
    token: string
  ): Promise<EcommObject> {
    let orderId = "";
    let shippingOptions;
    let addressesWithRegions;
    const mergedAddresses = {};
    const cartService = new CartService(token);
    const productService = new ProductService(token);
    const shippingService = new ShippingService(token);
    const cartId = request.order?.externalId as string;
    const requestObject = request as any;

    switch (request.type) {
      case V1EntityType.ORDER: {
        /**
         * Coupon
         */
        if (cartId && request.order?.coupon?.code) {
          const remove = request.order.coupon.remove as boolean;
          const code = request.order.coupon.code;
          await cartService.updateCoupon(remove, code, cartId);
        }

        /**
         * Shipping address
         */
        if (request.order?.shipments && cartId) {
          /**
           * Confirm addresses match and/or that there is only
           * one address.
           *
           * Note: this check limits the number of shipment_plans
           * to 1. Magento's REST API cannot add more than one
           * shipment_assignment to guest users and multiple shipping
           * address suport must be enabled for registered users.
           * Assuming single-address support is considered MVP and
           * a limitation of Magento for guest users–the default
           * state of users/carts.
           */
          const addressCheck = this.checkShippingAddresses(
            request.order.shipments
          );

          if (addressCheck) {
            // Map objects to Magento
            const mappedAddresses = objectMapper.merge(
              request,
              mergedAddresses,
              V1UpdateRequestShipmentAddressToMagentoAddress
            );

            // Get region ID (required) & append to address
            addressesWithRegions =
              await shippingService.mapShippingAddressesToRegions(
                mappedAddresses.addresses
              );

            // Get estimated shipping information
            shippingOptions = await shippingService.getEstimatedShipping(
              addressesWithRegions,
              cartId
            );

            // Use first option to get shipping_carrier_code and shipping_method_code
            const addressesWithShippingDefaults = this.setShippingDefaults(
              addressesWithRegions,
              shippingOptions
            );

            // Add shipping_carrier_code and shipping_method_code to shipping address data object below
            // Note: this call is the function that is restricted by limitations noted above.
            await cartService.updateShippingAddresses(
              addressesWithShippingDefaults,
              cartId
            );
          } else {
            /**
             * Magento only allows for a single shipping address.
             * While there may be multiple shipments to that
             * address, only one shipping address can be specified
             * on a cart or order. As a result, Fast must pass
             * matching addresses or throw the following error.
             */
            throw "Invalid shipping - shipping addresses information";
          }
        }

        /**
         * Billing address
         */
        if (request.order?.billTo && cartId) {
          const address = objectMapper(
            request,
            V1UpdateRequestBillingAddressToMagentoAddress
          );
          const addressWithRegion =
            await shippingService.mapBillingAddressToRegion(address);

          await cartService.updateBillingAddress(addressWithRegion, cartId);
        }

        /**
         * Line Item Updates
         */
        if (
          request.order?.items &&
          cartId &&
          request.order.items[0].externalItemId
        ) {
          // Existing item update
          const items = objectMapper(
            request,
            V1UpdateRequestItemsToMagentoItems
          );
          const itemsWithQuoteId = items.products.map(
            (product: any): unknown => {
              product.quote_id = cartId;
              return product;
            }
          );

          await cartService.updateItems(itemsWithQuoteId, cartId);
        } else if (
          request.order?.items &&
          cartId &&
          request.order.items[0].externalProductId
        ) {
          // New item add
          const productService = new ProductService(token);
          const hostUrl = JSON.parse(token).merchant_api_url;
          const lines = request.order.items;
          const productLookups = await productService.productLookup(
            hostUrl,
            lines
          );
          const mapperData = request as any;
          mapperData.order.lines = productLookups;
          const items = objectMapper(mapperData, V1UpdateRequestToCartMap);
          const itemsWithQuoteId = items.products.map(
            (product: any): unknown => {
              product.quote_id = cartId;
              return product;
            }
          );
          await cartService.addToCart(itemsWithQuoteId, cartId);
        }

        /**
         * Shipping Option Selected
         */
        if (requestObject.order.shippingOption && cartId) {
          const selectedOption = requestObject.order.shippingOption;
          const magentoLookup = selectedOption.externalOptionId;

          // Get the cart
          const cart = (await cartService.getCart(cartId)) as any;

          // Get the shipping address
          const address =
            cart.extension_attributes.shipping_assignments[0].shipping.address;

          // Fetch shipping options for address
          const options = await shippingService.getEstimatedShipping(
            [{ shipping_address: address }],
            cartId
          );

          // Filter down to selected option based on input
          const retrievedOptions = options as any;
          const filteredOption = retrievedOptions[0].filter(
            (option: any) =>
              `${option.carrier_code}_${option.method_code}` === magentoLookup
          )[0];

          // Update shipping
          await cartService.updateShippingMethod(
            filteredOption,
            address,
            cartId
          );
        }

        /**
         * Cart converted to order
         */
        if (
          request.order?.convertCartToOrder &&
          request.order?.externalId &&
          (request.order?.status === V1OrderStatus.BOOKED ||
            request.order?.status === V1OrderStatus.PENDINGFULFILLMENT ||
            request.order?.status === V1OrderStatus.CANCELED)
        ) {
          orderId = request.order.externalId;
        } else if (request.order?.convertCartToOrder && cartId) {
          orderId = await cartService.createOrder(cartId);
          request.order.externalId = orderId;
        }
        break;
      }

      case V1EntityType.SHIPPINGOPTION: {
        if (requestObject.order?.shipping_option && cartId) {
          const selectedOption = requestObject.order.shippingOption;
          const magentoLookup = selectedOption.externalOptionId;

          // Get the cart
          const cart = (await cartService.getCart(cartId)) as any;
          // Get the shipping address
          const address =
            cart.extension_attributes.shipping_assignments[0].shipping.address;
          // Fetch shipping options for address
          const options = await shippingService.getEstimatedShipping(
            [{ shipping_address: address }],
            cartId
          );
          // Filter down to selected option based on input
          const retrievedOptions = options as any;
          const filteredOption = retrievedOptions[0].filter(
            (option: any) => option.method_code === magentoLookup
          )[0];

          // Update shipping
          await cartService.updateShippingMethod(
            filteredOption,
            address,
            cartId
          );
        }

        break;
      }

      case V1EntityType.USER:
        if (request.order?.userInfo?.externalCustomerId) {
          // const customerId = request.order?.userInfo?.externalCustomerId;
          await cartService.addCustomerToCart();
        }

        // Associate customer to cart in Magento
        break;

      // Various errors
      case V1EntityType.SHIPPINGZONES:
      case V1EntityType.CATALOGCATEGORY:
      case V1EntityType.CATALOGPRODUCT:
      case V1EntityType.ORDERSYNC:
      case V1EntityType.WEBHOOK:
        /**
         * This will be not supported in the scope of this integration.
         * Return a 501 not implemented error or similar.
         */
        break;
      case V1EntityType.UNSPECIFIED:
      default:
        /**
         * Return Error that illegal argument was passed
         */
        break;
    }

    /**
     * If cart was converted to order
     */
    if (request.order?.convertCartToOrder) {
      const orderService = new OrderService(token);
      const order = (await orderService.getOrder(orderId)) as any;
      return order;
    } else {
      /**
       * Otherwise if not converted to order,
       * but updates made:
       */

      const cart = (await cartService.getCart(cartId)) as any;

      // Ensure images are mapped
      const hostUrl = JSON.parse(token).merchant_api_url;
      const lines = cart.items as any[];
      const productLookups = await productService.productLookup(hostUrl, lines);
      cart.items = productLookups;

      // If update was Shipping Address changed:
      if (shippingOptions && addressesWithRegions) {
        const completeAddresses = mergedAddresses as any;
        const options = shippingOptions as any;

        // Loop over all of the addresses found and:
        completeAddresses.addresses.map((address: any, index: number) => {
          const shippingOption = options[index];

          // Add updated shipping option information to the shipping assignment as a custom attribute
          cart.extension_attributes.shipping_assignments[
            index
          ].magentoShippingOptions = shippingOption;
        });

        return cart;
      } else {
        const shipping_assignments = cart.extension_attributes
          ?.shipping_assignments as ShippingAssignment[];

        if (shipping_assignments && shipping_assignments.length > 0) {
          const address = shipping_assignments[0]?.shipping?.address as Address;
          const streetAddress = address.street as Array<unknown>;

          if (streetAddress) {
            // Get estimated shipping information
            const shippingService = new ShippingService(token);
            const shippingOptions = await shippingService.getEstimatedShipping(
              [{ shipping_address: address }],
              cartId
            );

            if (!cart.extension_attributes) {
              cart.extension_attributes = {};
            }
            if (!cart.extension_attributes.shipping_assignments) {
              cart.extension_attributes.shipping_assignments = [];
            }

            // This line assumes a single shipping_assignment only
            cart.extension_attributes.shipping_assignments[0].magentoShippingOptions =
              shippingOptions.flat();
          }
        }

        return cart;
      }
    }
  }

  /**
   * Helper function that sets shipping defaults
   * so that an address can be saved against the
   * cart object in Magento.
   *
   * @param addresses
   * @param shippingEstimates
   * @returns
   */
  setShippingDefaults(
    addresses: any[],
    shippingEstimates: unknown[]
  ): unknown[] {
    const returnArray: unknown[] = [];
    addresses.map((address, index) => {
      const indexedEstimate = shippingEstimates[index] as Array<any>;
      const firstAvailableEstimate = indexedEstimate[0];

      address.shipping_carrier_code = firstAvailableEstimate.carrier_code;
      address.shipping_method_code = firstAvailableEstimate.method_code;

      returnArray.push(address);
    });

    return returnArray;
  }

  /**
   * Helper function to validate if all shipping
   * addresses received match. Per Magento
   * constraints: only one shipping address is
   * permitted per order, therefore all inbound
   * shipping addresses must be identical. In a
   * future state, the 1-address assumption may
   * be removed.
   *
   * @param {array} shipments contains shipment_plan object details
   * @returns {boolean}
   */
  checkShippingAddresses(shipments: any[]): boolean {
    let addressesMatch = true;
    let singleAddress = true;
    const baseAddress = shipments[0].shipTo;

    for (let index = 0; index < shipments.length; index++) {
      const flattenedBase = this.flattenObject(baseAddress);
      const inboundAddress = this.flattenObject(shipments[index].shipTo);
      const match = this.isEquivalent(flattenedBase, inboundAddress);
      if (match) {
        addressesMatch = true;
      } else {
        addressesMatch = false;
        break;
      }
    }

    if (shipments.length > 1) {
      singleAddress = false;
    }

    return addressesMatch && singleAddress;
  }

  /**
   * Helper function to compare shipping addresses.
   * Assumes a "base address" of the first address
   * passed to update-service.
   *
   * @param {object} baseAddress base address
   * @param {object} inboundAddress address to be compared
   * @returns {boolean} flag indicating if addresses match
   */
  isEquivalent(baseAddress: any, inboundAddress: any): boolean {
    const baseProps = Object.getOwnPropertyNames(baseAddress);
    const inboundProps = Object.getOwnPropertyNames(inboundAddress);

    if (baseProps.length !== inboundProps.length) {
      return false;
    }
    for (let index = 0; index < baseProps.length; index++) {
      const propName = baseProps[index];
      if (baseAddress[propName] !== inboundAddress[propName]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Helper function to flatten shipping objects
   * for comparison
   *
   * @param {object} object unflattened address
   * @returns {object} flattened address
   */
  flattenObject(object: any): any {
    return Object.assign(
      {},
      ...(function _flatten(o): any {
        return [].concat(
          ...Object.keys(o).map((k) =>
            typeof o[k] === "object" ? _flatten(o[k]) : { [k]: o[k] }
          )
        );
      })(object)
    );
  }
}
