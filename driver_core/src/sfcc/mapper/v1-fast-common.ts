/**
 * Object mapping schema to map the common Fast request properties
 * to the common Fast response properties.
 */
const V1RequestToV1ResponseMap = {
  // Request level need to be copied to response level.
  "type": "type",
  "requestId": "requestId",
};

export { V1RequestToV1ResponseMap };