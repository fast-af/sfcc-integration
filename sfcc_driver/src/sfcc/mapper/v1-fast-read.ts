import { V1RequestToV1ResponseMap } from "./v1-fast-common";

/**
 * Object mapping schema to map the Fast V1ReadRequest object
 * to the Fast V1ReadResponse object.
 */
const V1ReadRequestToV1ReadResponseMap = {
  // Call v1-fast-common to merge the object.
  ...V1RequestToV1ResponseMap,

  "order.orderId.value": "order.order.id.value",
  "order.externalId": "order.order.externalId",
};

/**
 * TODO: See if this is needed after testing with Fast and
 * remove if not required.  This also depends on the 
 * clean-deep plugin used to remove empty properties.
 * 
 * Object mapping schema to map the Fast Shipping Zones object
 * to the Fast V1ReadResponse object.
 */
const ShippingZonesToV1ReadResponseMap = {
  // Dummy mapping to return empty value.
  "order.orderId.value": {
    key: "shippingZones.shippingZones[].countryIso2",
    transform: (): unknown => undefined,
  },
};

export { V1ReadRequestToV1ReadResponseMap, ShippingZonesToV1ReadResponseMap };