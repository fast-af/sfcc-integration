import {
  RequestObject,
  EcommObject,
} from "../../../core/object-definitions/v1/models/common-types";

/**
 * A base service class that defines the common methods.
 */
export default interface BaseService {
  /**
   * A method to orchestrate the flow of various commerce
   * API calls.
   *
   * @param request {RequestObject} - A request object.
   * @param bearerToken {string} - OAuth access token.
   */
  orchestrate(request: RequestObject, token: string): EcommObject;
}
