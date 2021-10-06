/* eslint-disable indent */
import ApiService from "./api-service";
import OCAPI from "sfcc-ocapi-documents";
import { AxiosError } from "axios";
import { BasketLineItem, BasketResourceCustomer } from "../../models/custom-types";
import { OCAPIFaultType } from "../../models/ocapi-fault-type-enum";
import { pinoProd, formattedLog } from "../../../util/common-util";

/**
 * A service class for OCAPI basket operations.
 */
export default class BasketService extends ApiService {
  /**
   * Creates a basket.
   * 
   * @param basket {OCAPI.Basket} - SFCC Basket document.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async createBasket(basket: OCAPI.Basket): Promise<OCAPI.Basket> {
    try {
      const http = await this.getHttp();
      const { data } = await http.post(process.env.SFCC_OCAPI_BASKET || `/baskets`, basket);
      return data;
    } catch(error: unknown) {
      const { c_fastId } = basket as any;
      pinoProd.error(`Error during create basket for Fast id "${c_fastId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Get a basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async getBasket(basketId: string): Promise<OCAPI.Basket> {
    try {
      const http = await this.getHttp();
      const { data } = await http.get(`${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}`);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error during get basket for id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Delete a basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @returns {Promise<void>} - No content.
   */
  async deleteBasket(basketId: string): Promise<void> {
    try {
      const http = await this.getHttp();
      await http.delete(`${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}`);
    } catch(error: any) {
      pinoProd.error(`Error during delete basket for id "${basketId}".`);
      // This is a hack.  Based on the discussion on 14 Sep 2021
      // with Fast team, it seems there will be a delete call after
      // a successful convert cart to order for a non-existent
      // basket in the commerce platform, and the middleware require
      // this to handle it gracefully.
      const code = this.handleError(error as AxiosError);
      if (error.response && error.response.data && error.response.data.fault 
        && error.response.data.fault.type !== OCAPIFaultType.BASKET_NOT_FOUND) {
        // Throw an error for all except basket not found.
        throw new Error(code);
      };
    };
  };

  /**
   * Updates a basket - Associate the customer to basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param basketResourceCustomer {BasketResourceCustomer} - a custom type for user association.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async associateCustomerToBasket(basketId: string, basketResourceCustomer: BasketResourceCustomer): Promise<OCAPI.Basket> {
    try {
      const http = await this.getHttp();
      const { data } = await http.patch(`${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}`, basketResourceCustomer);
      return data;
    } catch(error: unknown) {
      pinoProd.error(formattedLog(`Error during customer association to the basket id "${basketId}".`, basketResourceCustomer));
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * UNUSED:
   * Set customer information.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param customerInfo {OCAPI.CustomerInfo} - SFCC Customer info document.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async setCustomerToBasket(basketId: string, customerInfo: OCAPI.CustomerInfo): Promise<OCAPI.Basket> {
    try {
      const uri = process.env.SFCC_OCAPI_BASKET_CUSTOMER || `/baskets/${basketId}/customer`;
      const http = await this.getHttp();
      const { data } = await http.put(uri.replace(this.getReplaceString(), basketId), customerInfo);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error during setting customer to the basket id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Sets the shipping address of a shipment.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param shipmentId {string} - the shipment id.
   * @param orderAddress {OCAPI.OrderAddress} SFCC Order address document.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async updateShippingAddress(basketId: string, shipmentId: string, orderAddress: OCAPI.OrderAddress): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_SHIPMENT 
        || `/shipments/${shipmentId}`}${process.env.SFCC_OCAPI_BASKET_SHIPPING_ADDRESS || `/shipping_address`}`;
      const http = await this.getHttp();
      const { data } = await http.put(uri.replace(this.getReplaceString(), shipmentId), orderAddress);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error during shipping address update to the basket id "${basketId}" and the shipment id ${shipmentId}.`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Adds a coupon to an existing basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param couponCode {string} - Coupon code.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async addCoupon(basketId:string, couponCode: string): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_COUPON || "/coupons"}`;
      const http = await this.getHttp();
      const { data } = await http.post(uri, { code: couponCode });
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error when adding coupon code ${couponCode} to the basket id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Removes a coupon from the basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param couponItem {string} - SFCC Coupon Item id.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async removeCoupon(basketId:string, couponItemId: string): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_COUPON || "/coupons"}/${couponItemId}`;
      const http = await this.getHttp();
      const { data } = await http.delete(uri);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error when removing coupon item id ${couponItemId} from basket id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Add a billing address to the basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param orderAddress {OCAPI.OrderAddress} SFCC Order address document.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async addBillingAddress(basketId: string, orderAddress: OCAPI.OrderAddress): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_BILLING_ADDRESS || "/billing_address"}`;
      const http = await this.getHttp();
      const { data } = await http.put(uri, orderAddress);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error during billing address update to the basket id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Add product(s) (line item(s)) to the basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param lineItems {BasketLineItem} - A custom line items object array.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async addLineItem(basketId: string, lineItems: BasketLineItem[]): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_LINE_ITEM || "/items"}`;
      const http = await this.getHttp();
      const { data } = await http.post(uri, lineItems);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error when adding "${lineItems.length.toString()}" line item(s) to the basket id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Update a product (line item) in the basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param lineItemId {string} - Basket line item id to update.
   * @param lineItem {BasketLineItem} - A custom line items object array.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async updateLineItem(basketId: string, lineItemId: string, lineItem: BasketLineItem): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_LINE_ITEM || "/items"}/${lineItemId}`;
      const http = await this.getHttp();
      const { data } = await http.patch(uri, lineItem);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error when updating line item with product id "${lineItem.product_id}" for quantity "${
        lineItem.quantity.toString()}" to the basket id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Delete a product (line item) from the basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param lineItemId {string} - Basket line item id to update.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async deleteLineItem(basketId: string, lineItemId: string): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_LINE_ITEM || "/items"}/${lineItemId}`;
      const http = await this.getHttp();
      const { data } = await http.delete(uri);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error when removing coupon item id ${lineItemId} from basket id "${basketId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Sets the shipping method to a specific shipment of a basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param shipmentId {string} - the shipment id.
   * @param shippingMethod {OCAPI.ShippingMethod | unknown} SFCC Shipping method document.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async updateShippingMethod(basketId: string, shipmentId: string, shippingMethod: OCAPI.ShippingMethod | unknown): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_SHIPMENT 
        || `/shipments/${shipmentId}`}${process.env.SFCC_OCAPI_BASKET_SHIPPING_METHOD || `/shipping_method`}`;
      const http = await this.getHttp();
      const { data } = await http.put(uri.replace(this.getReplaceString(), shipmentId), shippingMethod);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error during shipping method update to the basket id "${basketId}" and the shipment id ${shipmentId}.`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Updates a shipment for a basket.
   * 
   * @param basketId {string} - SFCC Basket id.
   * @param shipmentId {string} - the shipment id.
   * @param shipment {OCAPI.Shipment | unknown} SFCC Shipping method document.
   * @returns {Promise<OCAPI.Basket>} - SFCC Basket document.
   */
  async updateShipment(basketId: string, shipmentId: string, shipment: OCAPI.Shipment | unknown): Promise<OCAPI.Basket> {
    try {
      const uri = `${process.env.SFCC_OCAPI_BASKET || "/baskets"}/${basketId}${process.env.SFCC_OCAPI_BASKET_SHIPMENT || `/shipments/${shipmentId}`}`;
      const http = await this.getHttp();
      const { data } = await http.patch(uri.replace(this.getReplaceString(), shipmentId), shipment);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error during shipment update to the basket id "${basketId}" and the shipment id ${shipmentId}.`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };
};