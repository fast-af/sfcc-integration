import ApiService from "./api-service";
import OCAPI from "sfcc-ocapi-documents";
import { AxiosError } from "axios";
import { pinoProd } from "../../../util/common-util";

/**
 * A service class for OCAPI customer operations.
 */
export default class CustomerService extends ApiService {
  /**
   * Get customer by id.
   * 
   * @param customerId {string} - the customer id.
   * @returns {Promise<OCAPI.Customer>} - SFCC Customer document.
   */
  async getCustomerById(customerId: string): Promise<OCAPI.Customer> {
    try {
      const http = await this.getHttp();
      const { data } = await http.get(`${process.env.SFCC_OCAPI_CUSTOMER_GET || '/customers'}/${customerId}`);
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error during get customer for id "${customerId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };
};