/**
 * Object mapping schema to map the Fast V1ReadRequest object
 * to the Fast V1ReadResponse object
 */
const V1ReadRequestToV1ReadResponseMap = {
  requestId: "requestId",
  type: "type",
  "order.orderId.value": "order.order.id",
  "order.externalId": "order.order.externalId",
};

export { V1ReadRequestToV1ReadResponseMap };
