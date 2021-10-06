import { V1OrderStatus } from "../../core/object-definitions/v1/models/v1-order-status";
import { V1OrderType } from "../../core/object-definitions/v1/models/v1-order-type";

/**
 * Object mapping schema to map the Fast V1UpdateRequest object
 * to the Fast V1UpdateResponse object
 */
const V1UpdateRequestToV1UpdateResponseMap = {
  requestId: "requestId",
  type: "type",
  "order.orderId": "order.order.id",
  "order.externalId": "order.order.externalId",

  // Key statuses based on if cart, or converted to order
  "order.convertCartToOrder": [
    {
      key: "order.order.orderType",
      transform: (value: boolean): string => {
        return value ? V1OrderType.ORDER : V1OrderType.CART;
      },
    },
    {
      key: "order.order.status",
      transform: (value: boolean): string => {
        return value ? V1OrderStatus.PENDING : V1OrderStatus.CART;
      },
    },
  ],

  // Various request IDs based on available request data
  "order.billTo.id": "order.order.billTo.id",
  // "order.items[].itemId": "order.order.lines[].id",
  // "order.items[].externalProductId": "order.order.lines[].externalProductId",
  // "order.items[].externalVariantId": "order.order.lines[].externalVariantId",
  "order.shipments.planId": "order.order.shipmentPlans[].id",
  "order.shippingOption.externalOptionId":
    "order.order.shipmentPlans[].selectedOption.externalId",
  "order.shipments[].shipTo.id": "order.order.shipmentPlans[].shipTo.id",
};

const V1UpdateRequestShipmentAddressContext = {
  "order.shipments[].shipTo.id": "addresses[].shipping_address.id",
};

const V1UpdateRequestShipmentAddressToMagentoAddress = {
  "order.shipments[].shipTo.firstName":
    "addresses[].shipping_address.firstname",
  "order.shipments[].shipTo.lastName": "addresses[].shipping_address.lastname",
  "order.shipments[].shipTo.middleName":
    "addresses[].shipping_address.middlename",
  "order.shipments[].shipTo.company": "addresses[].shipping_address.company",
  "order.shipments[].shipTo.email": "addresses[].shipping_address.email",
  "order.shipments[].shipTo.phone": {
    key: "addresses[].shipping_address.telephone",
    transform: (value: any): string => (value ? value.toString() : "555-555-5555"), // Default per Fast if phone is not captured
  },
  "order.shipments[].shipTo.address1": "addresses[].shipping_address.street[]",
  "order.shipments[].shipTo.address2": "addresses[].shipping_address.street[]+",
  "order.shipments[].shipTo.cityLocality": "addresses[].shipping_address.city",
  "order.shipments[].shipTo.stateProvince":
    "addresses[].shipping_address.region",
  "order.shipments[].shipTo.stateProvinceCode":
    "addresses[].shipping_address.region_code",
  "order.shipments[].shipTo.countryCode":
    "addresses[].shipping_address.country_id",
  "order.shipments[].shipTo.postalCode":
    "addresses[].shipping_address.postcode",
};

const V1UpdateRequestBillingAddressToMagentoAddress = {
  "order.billTo.id": "address.firstname",
  "order.billTo.firstName": "address.firstname",
  "order.billTo.lastName": "address.lastname",
  "order.billTo.middleName": "address.middlename",
  "order.billTo.company": "address.company",
  "order.billTo.email": "address.email",
  "order.billTo.phone": {
    key: "address.telephone",
    transform: (value: any): string => (value ? value.toString() : "555-555-5555"), // Default per Fast if phone is not captured
  },
  "order.billTo.address1": "address.street[]",
  "order.billTo.address2": "address.street[]+",
  "order.billTo.cityLocality": "address.city",
  "order.billTo.stateProvince": "address.region",
  "order.billTo.stateProvinceCode": "address.region_code",
  "order.billTo.country": "address.country_id",
  "order.billTo.postalCode": "address.postcode",
};

const V1UpdateRequestItemsToMagentoItems = {
  "order.items[]": {
    key: "products[]",
    transform: (input: any): unknown => {
      if (input) {
        return {
          qty: input.quantity,
          item_id: input.externalItemId,
          extension_attributes: {
            fast_order_item_uuid: input.itemId.value,
          },
        };
      }
    },
  },
  // "order.items[].quantity": "products[].cartItem.qty",
  // "order.items[].externalVariantId": "products[].cartItem.item_id",
  // "order.externalId": "products[].cartItem.quote_id"
};

const ShippingOptionsUpdateToV1ResponseMap = {
  "extension_attributes.shipping_assignments[].magentoShippingOptions.magentoShippingOption[].method_code":
    "order.order.shipmentPlans[].availableOptions[].externalId",
  "extension_attributes.shipping_assignments[].magentoShippingOptions.magentoShippingOption[].method_title":
    "order.order.shipmentPlans[].availableOptions[].name",
  "extension_attributes.shipping_assignments[].magentoShippingOptions.magentoShippingOption[].base_amount":
    {
      key: "order.order.shipmentPlans[].availableOptions[].cost",
      transform: (input: any[]): unknown => {
        if (input && Array.isArray(input)) {
          return input.map((item) => item.toString());
        } else if (input) {
          return input;
        }
      },
    },
  "extension_attributes.shipping_assignments[].magentoShippingOptions.magentoShippingOption[].price_incl_tax":
    {
      key: "order.order.shipmentPlans[].availableOptions[].total",
      transform: (input: any[]): unknown => {
        if (input && Array.isArray(input)) {
          return input.map((item) => item.toString());
        } else if (input) {
          return input;
        }
      },
    },
  "extension_attributes.shipping_assignments[].magentoShippingOptions.magentoShippingOption[].carrier_title":
    "order.order.shipmentPlans[].availableOptions[].carrier",
};

const MagentoUpdatesToV1UpdateResponseMap = {
  // TODO: needs to be validated against actual responses for:
  // - Shipping option select
  // - Cart converted to order (submitted)
  // - Coupon uptade
  // - Shipping address update
  // - Billing address update
  // - Line item(s) update
  // - Cart/Order status update
  // "order.status[].updated": "UPDATE_ORDER_SEGMENT_TYPE_UNSPECIFIED",
  // "order.status[].status": false,
  // "order.status[].reason_code": "string",
  // "order.status[].message": "string",
};

export {
  V1UpdateRequestToV1UpdateResponseMap,
  V1UpdateRequestShipmentAddressToMagentoAddress,
  V1UpdateRequestBillingAddressToMagentoAddress,
  V1UpdateRequestItemsToMagentoItems,
  MagentoUpdatesToV1UpdateResponseMap,
  V1UpdateRequestShipmentAddressContext,
  ShippingOptionsUpdateToV1ResponseMap,
};
