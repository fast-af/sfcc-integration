import http, { AxiosError, AxiosInstance } from 'axios';
import FastSFCCAuthModel from '../../models/v1-fast-sfcc-auth-model';
import SFCCAuthModel from '../../models/ocapi-auth-model';
import AuthService from "../auth/auth-service";
import getErrorCode from "../../util/error-message-util";
import { pinoProd, formattedLog } from "../../../util/common-util";
import { OCAPIFaultType } from '../../models/ocapi-fault-type-enum';

/**
 * A service class to be used as the base class by all
 * the service classes that interacts with SFCC OCAPI.
 */
export default class ApiService {
  /**
   * Private variables
   */
  private accessToken = "";
  private host = "";
  private siteId = "";
  private apiType = "";
  private clientId = "";
  private REPLACE_STRING = "**";
  // From Fast Team: Image sized ~500 x 500 px (so likely a medium).
  // The largest size we render is 535px, and we resize down via css.
  private VIEW_TYPE = "medium";

  /**
   * Constructor.
   * 
   * @param token {string} - access token.
   */
  constructor(token: string) {
    if (token !== "") {
      // TODO: Possibly use the ConvertObject to conform to a type.
      const fastSFCCAuthModel: FastSFCCAuthModel = JSON.parse(token as string);
      this.accessToken = fastSFCCAuthModel.salesforce_access_token;
      this.host = fastSFCCAuthModel.host_server;
      this.apiType = fastSFCCAuthModel.api_type;
      this.siteId = fastSFCCAuthModel.site_id;
      this.clientId = fastSFCCAuthModel.client_id;
    };
  };

  /**
   * Common error handling for Axios related errors.
   * 
   * @param error {AxiosError} - Error from Axios.
   * @returns {string} - Error code.
   */
  protected handleError(error: AxiosError): string {
    if (error.response && error.response.data && error.response.data.fault) {
      pinoProd.error(formattedLog("API error!", error.response.data));
      return getErrorCode(error.response.data.fault.type);
    };
    if (error.code === OCAPIFaultType.CONNECTION_REFUSED) {
      pinoProd.error(formattedLog("Connection Refused by OCAPI!", error));
      return getErrorCode(OCAPIFaultType.CONNECTION_REFUSED);
    };
    pinoProd.error(formattedLog("Unknown error!", error));
    return "1002";
  };

  /**
   * Get the common URI replace string.
   * 
   * @returns {string} - the replace string.
   */
  protected getReplaceString(): string {
    return this.REPLACE_STRING;
  };

  /**
   * Get the image view type.
   * 
   * @returns {string} - image view type.
   */
  protected getImageViewType(): string {
    return this.VIEW_TYPE;
  };

  /**
   * Get the common Axios instance.
   * 
   * @returns {AxiosInstance} - the axios http instance.
   */
  protected async getHttp(): Promise<AxiosInstance> {
    const baseUrl = await this.getBaseUri();
    return http.create({
      baseURL: baseUrl,
      headers: { 
        "Authorization": `Bearer ${this.accessToken}`,
        "x-dw-client-id": this.clientId
      },
    });
  };

  /**
   * Get the OCAPI host.
   * 
   * @returns {string} - OCAPI host.
   */
  private getHost(): string {
    return this.host;
  };

  /**
   * Get the OCAPI site id.
   * 
   * @returns {string} - OCAPI site id.
   */
  private getSiteId(): string {
    return this.siteId;
  };

  /**
   * Get the OCAPI type.
   * 
   * @returns {string} - OCAPI type.
   */
  private getApiType(): string {
    return this.apiType;
  };

  /**
   * Get the OCAPI client id.
   * 
   * @returns {string} - OCAPI client id.
   */
  private getClientId(): string {
    return this.clientId;
  };

  /**
   * Get the base uri.
   */
  private async getBaseUri(): Promise<string> {
    if (this.accessToken === "") {
      await this.getInAppToken();
    };
    return `https://${this.getHost()}/s/${this.getSiteId()}/dw/shop/${this.getApiType()}`;
  };

  /**
   * Get the SFCC OCAPI access token based on the flag to get
   * it in-app rather than from the request header.  This
   * can exclusively happen if no fast credential header found
   * or if the ENABLE_IN_APP_TOKEN_RETRIEVAL is true.
   */
  private async getInAppToken(): Promise<void> {
    // Get the environment property/flag to determine
    // if in-app token retrieval is enabled or not.
    const retrieveTokenInAppValue: string = process.env.ENABLE_IN_APP_TOKEN_RETRIEVAL || "false";
    const enableTokenInApp: boolean = new Boolean(retrieveTokenInAppValue === "true" ? true : false).valueOf();
    // Use in-app token retrieval if ENABLE_IN_APP_TOKEN_RETRIEVAL is true.
    if (enableTokenInApp && this.accessToken === "") {
      const envHost = process.env.SFCC_OCAPI_HOST || '';
      const envClientId = process.env.SFCC_OCAPI_CLIENT_ID || '';
      const sfccAuthModel: SFCCAuthModel = {
        host: envHost,
        clientId: envClientId,
        clientPassword: process.env.SFCC_OCAPI_CLIENT_PASSWORD || '',
        bmUsername: process.env.SFCC_OCAPI_BM_USERNAME || '',
        bmPassword: process.env.SFCC_OCAPI_BM_PASSWORD || ''
      };
      // Use the auth service to get the access token.
      const authService = new AuthService(sfccAuthModel);
      const sfccAccessToken = await authService.getAccessToken();
      this.accessToken = sfccAccessToken.access_token;
      this.host = envHost;
      this.apiType = process.env.SFCC_OCAPI_API_TYPE || '';
      this.siteId = process.env.SFCC_OCAPI_SITE_ID || '';
      this.clientId = envClientId;
    };
  };
};