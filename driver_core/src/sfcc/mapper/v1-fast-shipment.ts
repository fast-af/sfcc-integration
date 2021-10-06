import OCAPI from "sfcc-ocapi-documents";
import { V1ShippingOptionType } from "../../core/object-definitions/v1/models";

/**
 * Get the shipping option type.
 * 
 * @param value {string} - a value from shipment object.
 * @returns {V1ShippingOptionType} - An appropriate shipping option type.
 */
const getShipmentType = (value: string): string | unknown => {
  if (value) {
    const matchVal = value.toLowerCase().replace(/\\s/, "");
    const regEx = /store|pickup/g;
    return (matchVal.match(regEx)) ? V1ShippingOptionType.INSTOREPICKUP : V1ShippingOptionType.OTHER;
  } else return null;
};
/**
 * Get the actual value from a formatted currency value.
 * This fn always expects the first character to be any 
 * supported currency symbol.
 * For example, $4.99, $15.99, $192.99, etc.
 * 
 * @param value {string} - a formatted currency value with a symbol.
 * @returns {string} - an absolute currency value without the symbol.
 */
const getDoubleValue = (value: string): string => {
  if (value) return isNaN(parseInt(value.charAt(0))) ? value.substring(1, value.length) : value;
  else return "0";
};

/**
 * Object mapping schema to map the SFCC Shipment object
 * to the V1Response object.
 */
const ShipmentToV1ResponseMap = {
  // shipmentPlans
  // shipmentPlans[].id.
  "shipments[].c_fastPlanId": "order.order.shipmentPlans[].id.value",
  "shipments[].shipment_id": "order.order.shipmentPlans[].externalId",

  // shipmentPlans[].selectedOption
  "shipments[].shipping_method.id": {
    key: "order.order.shipmentPlans[].selectedOption.externalId",
    transform: (value: string): string | unknown => value ? value : null,
  },
  "shipments[].shipping_method.name": [
    {
      key: "order.order.shipmentPlans[].selectedOption.name",
      transform: (value: string): string | unknown => value ? value : null,
    },
    {
      key: "order.order.shipmentPlans[].selectedOption.shipmentType",
      transform: getShipmentType,
    },
  ],
  "shipments[].shipping_method.price": [
    {
      key: "order.order.shipmentPlans[].selectedOption.total",
      transform: (value: number): string | unknown => value ? value.toString() : null,
    },
    {
      key: "order.order.shipmentPlans[].selectedOption.cost",
      transform: (sourceValue: number, sourceObject: OCAPI.Shipment): string | unknown => !sourceValue
        ? null : (sourceObject.shipping_total - sourceObject.shipping_total_tax).toFixed(2),
    },
  ],
  "shipments[].shipping_total_tax": {
    key: "order.order.shipmentPlans[].selectedOption.tax",
    transform: (value: number): string | unknown => value ? value.toString() : null,
  },
  // TODO: shipmentPlans[].selectedOption.carrier - may have to be ignored?
  // shipmentPlans[].availableOptions[] - V1ShippingOption - may have to be ignored?
  "c_applicableShippingMethods[].ID": "order.order.availableOptions[].externalId",
  "c_applicableShippingMethods[].displayName": "order.order.availableOptions[].name",
  "c_applicableShippingMethods[].description": [
    {
      key: "order.order.availableOptions[].serviceLevel",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.availableOptions[].shipmentType",
      transform: getShipmentType,
    },
  ],
  "c_applicableShippingMethods[].shippingCost": [
    {
      key: "order.order.availableOptions[].cost",
      transform: getDoubleValue,
    },
    {
      key: "order.order.availableOptions[].total",
      transform: getDoubleValue,
    },
    {
      key: "order.order.availableOptions[].tax",
      transform: (): string => "0",
    },
  ],
  // TODO: shipmentPlans[].shipments[] - may have to be ignored?
};

export { ShipmentToV1ResponseMap };