import ApiService from "./api-service";
import OCAPI from "sfcc-ocapi-documents";
import { AxiosError } from "axios";
import { pinoProd } from "../../../util/common-util";

/**
 * A service class for OCAPI order operations.
 */
export default class OrderService extends ApiService {
  /**
   * Gets an order.
   * 
   * @param orderId {string} - SFCC Order Id.
   * @returns {Promise<OCAPI.Order>} - SFCC Order document.
   */
  async getOrder(orderId: string): Promise<OCAPI.Order> {
    try {
      const http = await this.getHttp();
      const { data } = await http.get(`${process.env.SFCC_OCAPI_ORDER || '/orders'}/${orderId}`);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error when getting order "${orderId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Creates a commerce order.
   * 
   * @param basket {OCAPI.Basket} - SFCC Basket document.
   * @returns {Promise<OCAPI.Order>} - SFCC Order document.
   */
  async createOrder(basket: OCAPI.Basket): Promise<OCAPI.Order> {
    try {
      const http = await this.getHttp();
      const { data } = await http.post(`${process.env.SFCC_OCAPI_ORDER || '/orders'}`, basket);
      return data
    } catch(error: unknown) {
      pinoProd.error(`Error during create order for basket id "${basket.basket_id}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Modify a commerce order.
   * 
   * @param orderId {string} - SFCC Order id.
   * @param order {OCAPI.Order} - SFCC Order document.
   * @returns {Promise<OCAPI.Order>} - a modified SFCC Order document.
   */
  async modifyOrder(orderId: string, order: OCAPI.Order): Promise<OCAPI.Order> {
    try {
      const http = await this.getHttp();
      const { data } = await http.patch(`${process.env.SFCC_OCAPI_ORDER || '/orders'}/${orderId}`, order);
      return data
    } catch(error: unknown) {
      pinoProd.error(`Error when modifying the order status for order id "${orderId}" with status "${order.status}"`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };
};
