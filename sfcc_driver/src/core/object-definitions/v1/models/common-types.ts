import { V1CreateRequest } from "./v1-create-request";
import { V1CreateResponse } from "./v1-create-response";
import { V1ReadRequest } from "./v1-read-request";
import { V1ReadResponse } from "./v1-read-response";
import { V1UpdateRequest } from "./v1-update-request";
import { V1UpdateResponse } from "./v1-update-response";
import { V1DeleteRequest } from "./v1-delete-request";
import { V1DeleteResponse } from "./v1-delete-response";

/**
 * The request object type declaration that
 * can be any one of the incoming Fast
 * request types.  It strictly should not
 * contain unknown.
 */
type RequestObject =
  | V1CreateRequest
  | V1ReadRequest
  | V1UpdateRequest
  | V1DeleteRequest;

/**
 * The response object type declaration that
 * can be any one of the expected Fast types
 * based on the action.
 */
type ResponseObject =
  | V1CreateResponse
  | V1ReadResponse
  | V1UpdateResponse
  | V1DeleteResponse;

/**
 * A return object with a defined structure
 * common for the implementation.
 */
type ReturnObject = {
  data: ResponseObject | unknown;
  code: number;
};

/**
 * A common ecommerce object.
 */
type EcommObject = Record<string, unknown> | unknown | string;

/**
 * A common error object
 */
type ErrorResponse = { status: number; message: string };

export {
  RequestObject,
  ResponseObject,
  ReturnObject,
  EcommObject,
  ErrorResponse,
};
