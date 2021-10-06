/* eslint-disable indent */
import { ConvertObject } from "../core/object-definitions/v1/common/ConvertObject";
import { createRequestBaseType, createResponseBaseType, deleteRequestBaseType,
  deleteResponseBaseType, readRequestBaseType, readResponseBaseType,
  updateRequestBaseType, updateResponseBaseType,
} from "./../core/object-definitions/v1/types/v1-order-types";
import { RequestObject, ResponseObject, } from "../core/object-definitions/v1/models/common-types";
import { V1CreateRequest } from "../core/object-definitions/v1/models/v1-create-request";
import { V1ReadRequest } from "../core/object-definitions/v1/models/v1-read-request";
import { V1UpdateRequest } from "../core/object-definitions/v1/models/v1-update-request";
import { V1DeleteRequest } from "../core/object-definitions/v1/models/v1-delete-request";
import { V1CreateResponse } from "../core/object-definitions/v1/models/v1-create-response";
import { V1ReadResponse } from "../core/object-definitions/v1/models/v1-read-response";
import { V1UpdateResponse } from "../core/object-definitions/v1/models/v1-update-response";
import { V1DeleteResponse } from "../core/object-definitions/v1/models/v1-delete-response";

// Common action type definition.
enum ActionType {
  CREATE = "Create",
  READ = "Read",
  UPDATE = "Update",
  DELETE = "Delete"
};

// Pino Log type.
type LogObject = {
  message: string,
  response: unknown,
};

/**
 * Convert to a type safe request.
 *
 * @param payload {string | Record} - Serialized Fast request object.
 * @param action {ActionType} - Operation requested by Fast.
 * @returns {RequestObject} - One of the V1 request object.
 */
const typesafeRequest = (
  payload: string | Record<string, unknown>,
  action: ActionType
): RequestObject => {
  const object =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  switch (action) {
    case ActionType.CREATE: {
      const convertObject = new ConvertObject(createRequestBaseType);
      return convertObject.jsonToObject<V1CreateRequest>(object, "V1CreateRequest");
    };
    case ActionType.READ: {
      const convertObject = new ConvertObject(readRequestBaseType);
      return convertObject.jsonToObject<V1ReadRequest>(object, "V1ReadRequest");
    };
    case ActionType.UPDATE: {
      const convertObject = new ConvertObject(updateRequestBaseType);
      return convertObject.jsonToObject<V1UpdateRequest>(object, "V1UpdateRequest");
    };
    case ActionType.DELETE: {
      const convertObject = new ConvertObject(deleteRequestBaseType);
      return convertObject.jsonToObject<V1DeleteRequest>(object, "V1DeleteRequest");
    };
    default:
      throw "type-util: Type safe request - Bad Request";
  };
};

/**
 * Check type safe and convert to Fast response object.
 *
 * @param payload {ResponseObject} - One of the V1 response object.
 * @param action  {ActionType} - Operation requested by Fast.
 * @returns {any} - Fast response object.
 */
const typesafeResponse = (payload: ResponseObject, action: ActionType): unknown => {
  switch (action) {
    case ActionType.CREATE: {
      const convertObject = new ConvertObject(createResponseBaseType);
      return convertObject.objectToJson<V1CreateResponse>(payload, "V1CreateResponse");
    };
    case ActionType.READ: {
      const convertObject = new ConvertObject(readResponseBaseType);
      return convertObject.objectToJson<V1ReadResponse>(payload, "V1ReadResponse");
    };
    case ActionType.UPDATE: {
      const convertObject = new ConvertObject(updateResponseBaseType);
      return convertObject.objectToJson<V1UpdateResponse>(payload, "V1UpdateResponse");
    };
    case ActionType.DELETE: {
      const convertObject = new ConvertObject(deleteResponseBaseType);
      return convertObject.objectToJson<V1DeleteResponse>(payload, "V1DeleteResponse");
    };
    default:
      throw "type-util: Type safe response - Bad Request";
  };
};

export { typesafeRequest, typesafeResponse, ActionType, LogObject };
