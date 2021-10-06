import { V1RequestToV1ResponseMap } from "./v1-fast-common";

/**
 * Object mapping schema to map the common Fast request properties
 * to the common Fast response properties.
 */
const V1DeleteRequestToV1DeleteResponseMap = {
  // Request level need to be copied to response level.
  // Call v1-fast-common to merge the object.
  ...V1RequestToV1ResponseMap,
};

export { V1DeleteRequestToV1DeleteResponseMap };