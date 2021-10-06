import { V1RequestToV1ResponseMap } from "./v1-fast-common";

/**
 * Object mapping schema to map the Fast V1ReadRequest object
 * to the Fast V1ReadResponse object
 */
const V1UpdateRequestToV1UpdateResponseMap = {
  // Call v1-fast-common to merge the object.
  ...V1RequestToV1ResponseMap,
};
/**
 * Object mapping schema to map the Fast V1OrderAddress object
 * to the SFCC OrderAddress object for ShipTo.
 */
const V1OrderAddressToOrderAddressShipToFlatMap = {
  "order.shipments[].shipTo.firstName": "[].first_name",
  "order.shipments[].shipTo.lastName": "[].last_name",
  "order.shipments[].shipTo.middleName": "[].c_middleName",
  "order.shipments[].shipTo.company": "[].company_name",
  "order.shipments[].shipTo.email": "[].c_email",
  "order.shipments[].shipTo.phone": "[].phone",
  "order.shipments[].shipTo.address1": "[].address1",
  "order.shipments[].shipTo.address2": "[].address2",
  "order.shipments[].shipTo.cityLocality": "[].city",
  "order.shipments[].shipTo.stateProvinceCode": "[].state_code",
  "order.shipments[].shipTo.countryCode": "[].country_code",
  "order.shipments[].shipTo.postalCode": "[].postal_code",
  // shipmentPlans[].shipTo.stateProvince -> Not mapped in SFCC.
  // shipmentPlans[].shipTo.country -> Not mapped in SFCC.
};
/**
 * UNUSED:
 * Object mapping schema to map the Fast V1OrderAddress object
 * to the SFCC OrderAddress object for ShipTo.
 */
const V1OrderAddressToOrderAddressShipToMap = {
  "order.shipments[].shipTo.firstName": "shipments[].shipping_address.first_name",
  "order.shipments[].shipTo.lastName": "shipments[].shipping_address.last_name",
  "order.shipments[].shipTo.middleName": "shipments[].shipping_address.c_middleName",
  "order.shipments[].shipTo.company": "shipments[].shipping_address.company_name",
  "order.shipments[].shipTo.email": "shipments[].shipping_address.c_email",
  "order.shipments[].shipTo.phone": "shipments[].shipping_address.phone",
  "order.shipments[].shipTo.address1": "shipments[].shipping_address.address1",
  "order.shipments[].shipTo.address2": "shipments[].shipping_address.address2",
  "order.shipments[].shipTo.cityLocality": "shipments[].shipping_address.city",
  "order.shipments[].shipTo.stateProvinceCode": "shipments[].shipping_address.state_code",
  "order.shipments[].shipTo.countryCode": "shipments[].shipping_address.country_code",
  "order.shipments[].shipTo.postalCode": "shipments[].shipping_address.postal_code",
  // shipmentPlans[].shipTo.stateProvince -> Not mapped in SFCC.
  // shipmentPlans[].shipTo.country -> Not mapped in SFCC.
};
/**
 * UNUSED:
 * Object mapping schema to map the Fast V1ShipmentPlanUpdate object
 * to the SFCC Shipment object.
 */
const V1ShipmentPlanUpdateToShipmentMap = {
  "order.shipments[].planId.value": "shipments[].c_fastPlanId",
  // shipTo
  ...V1OrderAddressToOrderAddressShipToMap,
};
/**
 * Object mapping schema to map the Fast V1OrderAddress object
 * to the SFCC OrderAddress object for BillTo.
 */
const V1OrderAddressToOrderAddressBillToMap = {
  "order.billTo.firstName": "first_name",
  "order.billTo.lastName": "last_name",
  "order.billTo.middleName": "c_middleName",
  "order.billTo.company": "company_name",
  "order.billTo.email": "c_email",
  "order.billTo.phone": "phone",
  "order.billTo.address1": "address1",
  "order.billTo.address2": "address2",
  "order.billTo.cityLocality": "city",
  "order.billTo.stateProvinceCode": "state_code",
  "order.billTo.countryCode": "country_code",
  "order.billTo.postalCode": "postal_code",
};

export { V1UpdateRequestToV1UpdateResponseMap, V1ShipmentPlanUpdateToShipmentMap,
  V1OrderAddressToOrderAddressShipToMap, V1OrderAddressToOrderAddressShipToFlatMap,
  V1OrderAddressToOrderAddressBillToMap
};