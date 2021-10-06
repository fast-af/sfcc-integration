import { RequestObject, EcommObject } from "../../../core/object-definitions/v1/models/common-types";

/**
 * A base service class that defines the common methods.
 */
export default interface BaseService {
  /**
   * A method to orchestrate the flow of various commerce
   * API calls.
   * 
   * @param request {RequestObject} - A request object.
   * @param token {string} - OAuth access token.
   */
  orchestrate(request: RequestObject, token: string): EcommObject;

  /**
   * A method to handle the transformation to Fast response.
   * 
   * @param typesafeFastRequest {RequestObject} - type-safe transformed Fast request.
   * @param rawCommerceResponse {EcommObject} - Ecommerce object.
   * @param response {unknown} - a custom response object.
   */
  responseMap(typesafeFastRequest: RequestObject, rawCommerceResponse: EcommObject, response: unknown): void;
}