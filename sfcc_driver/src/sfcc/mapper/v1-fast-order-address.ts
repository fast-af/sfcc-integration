/**
 * Object mapping schema to map the SFCC Order address billing object
 * to the Fast V1Response object.
 */
const OrderAddressBillingToV1ResponseMap = {
  // billTo.id -> Not required as no mapping exists in Fast.
  "billing_address.first_name": "order.order.billTo.firstName",
  "billing_address.last_name": "order.order.billTo.lastName",
  "billing_address.c_middleName": "order.order.billTo.middleName",
  "billing_address.company_name": "order.order.billTo.company",
  "billing_address.c_email": "order.order.billTo.email",
  "billing_address.phone": "order.order.billTo.phone",
  "billing_address.address1": "order.order.billTo.address1",
  "billing_address.address2": "order.order.billTo.address2",
  "billing_address.city": "order.order.billTo.cityLocality",
  // billTo.stateProvince -> Not mapped in SFCC.
  "billing_address.state_code": "order.order.billTo.stateProvinceCode",
  // billTo.country -> Not mapped in SFCC.
  "billing_address.country_code": "order.order.billTo.countryCode",
  "billing_address.postal_code": "order.order.billTo.postalCode",
};
/**
 * Object mapping schema to map the SFCC Order address shipping object
 * to the Fast V1Response object.
 */
const OrderAddressShippingToV1ResponseMap = {
  // shipmentPlans[].shipTo
  "shipments[].shipping_address.first_name": "order.order.shipmentPlans[].shipTo.firstName",
  "shipments[].shipping_address.last_name": "order.order.shipmentPlans[].shipTo.lastName",
  "shipments[].shipping_address.c_middleName": "order.order.shipmentPlans[].shipTo.middleName",
  "shipments[].shipping_address.company_name": "order.order.shipmentPlans[].shipTo.company",
  "shipments[].shipping_address.c_email": "order.order.shipmentPlans[].shipTo.email",
  "shipments[].shipping_address.phone": "order.order.shipmentPlans[].shipTo.phone",
  "shipments[].shipping_address.address1": "order.order.shipmentPlans[].shipTo.address1",
  "shipments[].shipping_address.address2": "order.order.shipmentPlans[].shipTo.address2",
  "shipments[].shipping_address.city": "order.order.shipmentPlans[].shipTo.cityLocality",
  // shipmentPlans[].shipTo.stateProvince -> Not mapped in SFCC.
  "shipments[].shipping_address.state_code": "order.order.shipmentPlans[].shipTo.stateProvinceCode",
  // shipmentPlans[].shipTo.country -> Not mapped in SFCC.
  "shipments[].shipping_address.country_code": "order.order.shipmentPlans[].shipTo.countryCode",
  "shipments[].shipping_address.postal_code": "order.order.shipmentPlans[].shipTo.postalCode",
};

export { OrderAddressBillingToV1ResponseMap, OrderAddressShippingToV1ResponseMap };
