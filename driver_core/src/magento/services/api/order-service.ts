import axios from "axios";
import ApiService from "./api-service";
import { Order } from "../../models/order";

export default class OrderService extends ApiService {
  /**
   * Get order by ID
   *
   * @param id {string} Order ID string
   *
   * @returns {object} Order object
   */
  async getOrder(id: string): Promise<Order> {
    const http = await this.getHttp();
    return await http
      .get(`/orders/${id}`)
      .then((response) => {
        this.logger("order-service", "Order Fetched", response.data);
        return response.data;
      })
      .catch((error) => {
        this.logger("order-service", "Order Not Found", error);
        throw `Magento API Error: ${error}`;
      });
  }
}
