/**
 * Object mapping schema to map the Fast V1CreateRequest object
 * to the Fast V1CreateResponse object.
 */
const V1CreateRequestToV1CreateResponseMap = {
  // Request level need to be copied to response level.
  type: "type",
  requestId: "requestId",

  // Request order segment need to be copied to response order segment.
  "order.order.id": "order.order.id",
  "order.order.deviceInfo": "order.order.deviceInfo",

  // Line items - common
  "order.order.lines[].id": "order.order.lines[].id",
  "order.order.lines[].externalProductId":
    "order.order.lines[].externalProductId",
  "order.order.lines[].externalVariantId":
    "order.order.lines[].externalVariantId",
  "order.order.lines[].quantity": "order.order.lines[].quantity",
};

const ImageLookupToCommerceResponse = {
  "order.order.lines[]": {
    key: "items[].image_url",
    transform: (value: any): string | null => {
      if (!value) {
        return null;
      }
      if (typeof value === "object") {
        return value.imageUrl;
      } else {
        return value;
      }
    },
  },
};

export { V1CreateRequestToV1CreateResponseMap, ImageLookupToCommerceResponse };
