import http, { AxiosInstance } from "axios";
import MagentoAuthModel from "../../models/auth-model";

export default class ApiService {
  /**
   * Private variables
   */
  private token = "";
  private storeId = 1;
  private host = "";

  /**
   * Constructor.
   *
   * @param bearerToken {string} - Magento bearer token
   */
  constructor(token: string) {
    if (token !== "") {
      const fastMagentoAuth: MagentoAuthModel = JSON.parse(token);

      this.token = fastMagentoAuth.magento_access_token;
      this.storeId = fastMagentoAuth.store_id;
      this.host = fastMagentoAuth.merchant_api_url;
    }
  }

  /**
   * Get the common Axios instance.
   *
   * @returns {AxiosInstance} - the axios http instance.
   */
  protected async getHttp(): Promise<AxiosInstance> {
    const baseUrl = await this.getBaseUri();
    return http.create({
      baseURL: baseUrl,
      headers: this.getHeaderObject(),
    });
  }

  /**
   * Get storeId as needed.
   *
   * @returns {storeId} - storeId number value
   */
  protected getStoreId(): number {
    return this.storeId;
  }

  /**
   * Logger function
   *
   * @param action {string} Brief action description
   * @param data {unknown} Output data to be logged
   */
  protected logger(resource: string, action: string, data: unknown): void {
    console.log(`Magento: services: API: ${resource}: ${action}:`, data);
  }

  /**
   * Get the Magento server host.
   *
   * @returns {string} - Magento server host.
   */
  private getServer(): string {
    return this.host;
  }

  /**
   * Get the base uri.
   */
  private async getBaseUri(): Promise<string> {
    if (this.host === "") {
      await this.getInAppToken();
    }
    return `${this.getServer()}/rest/default/V1`;
  }

  /**
   * Get header object.
   * 
   * @returns {unknown} - a custom header object.
   */
  private getHeaderObject(): unknown {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  /**
   * Get env variables if token not provided
   */
  private async getInAppToken(): Promise<void> {
    const retrieveTokenInAppValue: string =
      process.env.ENABLE_IN_APP_TOKEN_RETRIEVAL || "false";
    const enableTokenInApp: boolean = new Boolean(
      retrieveTokenInAppValue === "true" ? true : false
    ).valueOf();

    if (enableTokenInApp) {
      const magentoAuthModel: MagentoAuthModel = {
        merchant_api_url: process.env.MAGENTO_SERVER || "",
        store_id: parseInt(process.env.MAGENTO_STORE_ID || "1"),
        magento_access_token: process.env.MAGENTO_BEARER_TOKEN || "",
      };

      this.token = magentoAuthModel.magento_access_token;
      this.storeId = magentoAuthModel.store_id;
      this.host = magentoAuthModel.merchant_api_url;
    }
  }
}
