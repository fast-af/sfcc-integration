import ApiService from "./api-service";
import Customer from "../../models/customer";

export default class CustomerService extends ApiService {
  /**
   * Get user by ID
   *
   * @param customerId {string} Customer ID
   *
   * @returns {object} Customer object
   */
  async getCustomer(customerId: string): Promise<Customer> {
    const http = await this.getHttp();
    return await http
      .get(`/customers/${customerId}`)
      .then((response) => {
        this.logger("customer-service", "Customer Found", response.data);
        return response.data;
      })
      .catch((error) => {
        this.logger("customer-service", "Customer Not Found", error);
        throw `Magento API Error: ${error}`;
      });
  }

  /**
   * Get user by email
   *
   * @param customerEmail {string} Customer email
   *
   * @returns {object} Customer object
   */
  async getCustomerByEmail(customerEmail: string): Promise<Customer> {
    const http = await this.getHttp();
    const isEmailAvailable = await http.post("/customers/isEmailAvailable", {
      customerEmail: customerEmail,
    });
    const userExists = !isEmailAvailable.data;
    const emailAddress = userExists ? encodeURIComponent(customerEmail) : "";

    if (userExists) {
      const http = await this.getHttp();
      return await http
        .get(
          `/customers/search?searchCriteria[filterGroups][0][filters][0][field]=email&searchCriteria[filterGroups][0][filters][0][value]=${emailAddress}&searchCriteria[filterGroups][0][filters][0][condition_type]=eq`
        )
        .then((response) => {
          this.logger("customer-service", "Customer Found", response.data);
          return response.data.items[0];
        })
        .catch((error) => {
          this.logger("customer-service", "Customer Not Found", error);
          throw `Magento API Error: ${error}`;
        });
    } else {
      throw "User not found";
    }
  }
}
