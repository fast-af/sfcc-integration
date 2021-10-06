import { V1RequestToV1ResponseMap } from "./v1-fast-common";

/**
 * Object mapping schema to map the Fast V1CreateRequest object
 * to the Fast V1CreateResponse object.
 */
const V1CreateRequestToV1CreateResponseMap = {
  // Request level need to be copied to response level.
  // Call v1-fast-common to merge the object.
  ...V1RequestToV1ResponseMap,

  // Request order segment need to be copied to response order segment.
  "order.order.id": "order.order.id",
  "order.order.orderType": "order.order.orderType",
  "order.order.status": "order.order.status",
  "order.order.deviceInfo": "order.order.deviceInfo",
  // Line items - common
  "order.order.lines[].id": "order.order.lines[].id",
  "order.order.lines[].externalProductId": "order.order.lines[].externalProductId",
  "order.order.lines[].externalVariantId": "order.order.lines[].externalVariantId",
  "order.order.lines[].quantity": "order.order.lines[].quantity",
};

export { V1CreateRequestToV1CreateResponseMap };