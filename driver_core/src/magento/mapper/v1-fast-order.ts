/* eslint-disable indent */
import { V1OrderType } from "../../core/object-definitions/v1/models";
import { V1OrderStatus } from "../../core/object-definitions/v1/models/v1-order-status";

// Order-level map
const OrderMap = {
  entity_id: [
    {
      key: "order.order.externalId",
      transform: (value: number): string => value.toString(),
    },
    {
      key: "order.order.shortOrderId",
      transform: (value: number): string => value.toString(),
    },
  ],
  customer_id: [
    {
      key: "order.order.userId",
      transform: (value: number): unknown => {
        if (value) {
          return value.toString();
        }
        return;
      },
    },
  ],
  base_currency_code: "order.order.currencyCode",
  status: [
    {
      key: "order.order.orderType",
      transform: (): string => V1OrderType.ORDER,
    },
    {
      key: "order.order.status",
      transform: (value: string): string => {
        switch (value) {
          case "canceled":
            return V1OrderStatus.CANCELED;
          case "complete":
            return V1OrderStatus.COMPLETE;
          case "holded":
            return V1OrderStatus.HOLD;
          case "pending":
            return V1OrderStatus.PENDING;
          case "processing":
            return V1OrderStatus.BOOKED;
          default:
            return V1OrderStatus.UNSPECIFIED;
        }
      },
    },
  ],
  grand_total: {
    key: "order.order.totalAmount",
    transform: (value: number): string => value.toString(),
  },
  subtotal: {
    key: "order.order.subTotal",
    transform: (value: number): string => value.toString(),
  },
  discount_amount: {
    key: "order.order.totalDiscounts",
    transform: (value: number): string => value.toString(),
  },
  tax_amount: {
    key: "order.order.totalTax",
    transform: (value: number): string => value.toString(),
  },
  customer_note: "order.order.userNote",
};

// Billing-address map
const OrderBillingAddressMap = {
  "billing_address.firstname": "order.order.billTo.firstName",
  "billing_address.lastname": "order.order.billTo.lastName",
  "billing_address.middlename": "order.order.billTo.middleName",
  "billing_address.company": "order.order.billTo.company",
  "billing_address.email": "order.order.billTo.email",
  "billing_address.telephone": {
    key: "order.order.billTo.phone",
    transform: (value: string): string => value,
  },
  "billing_address.street[0]": "order.order.billTo.address1",
  "billing_address.street[1]": "order.order.billTo.address2",
  "billing_address.city": "order.order.billTo.cityLocality",
  "billing_address.region": "order.order.billTo.stateProvince",
  "billing_address.region_code": "order.order.billTo.stateProvinceCode",
  "billing_address.country_id": "order.order.billTo.country",
  "billing_address.postcode": "order.order.billTo.postalCode",
};

const OrderItemsMap = {
  "items[].product_id": {
    key: "order.order.lines[].externalProductId",
    transform: (value: number): string => value.toString(),
  },
  "items[].quote_item_id": {
    key: "order.order.lines[].externalVariantId",
    transform: (value: number): string => value.toString(),
  },
  "items[].qty_ordered": "order.order.lines[].quantity",
  "items[].qty_shipped": "order.order.lines[].quantityFulfilled",
  "items[].price": {
    key: "order.order.lines[].unitPrice",
    transform: (value: number): string => value.toString(),
  },
  "items[].discount_invoiced": {
    key: "order.order.lines[].totalAmount",
    transform: (value: number): string => value.toString(),
  },
  "items[].discount_amount": [
    {
      key: "order.order.lines[].lineDiscountAmount",
      transform: (value: number): string => value.toString(),
    },
    {
      key: "order.order.lines[].discounts[].applied",
      transform: (value: any): boolean => {
        if (typeof value === "boolean") {
          return value;
        } else {
          const discountAmount = value.discount_amount;
          return discountAmount && discountAmount > 0 ? true : false;
        }
      },
    },
    {
      key: "order.order.lines[].discountedUnitPrice",
      transform: (value: any): string => {
        let stringValue = 0;
        if (value) {
          stringValue = value;
        }
        return stringValue.toString();
      },
    },
  ],
  "items[].base_row_total": {
    key: "order.order.lines[].subtotalAmount",
    transform: (value: number): string => value.toString(),
  },
  "items[].base_tax_amount": {
    key: "order.order.lines[].taxAmount",
    transform: (value: number): string => value.toString(),
  },
  "items[].price_incl_tax": {
    key: "order.order.lines[].totalAmount",
    transform: (value: number): string => value.toString(),
  },
  "items[].name": "order.order.lines[].name",
  // "order.order.lines[].description",
  // "order.order.lines[].imageUrl",
  // "order.order.lines[].fulfillmentMode",
};

// Shipping address items
const OrderShippingAddressMap = {
  "extension_attributes.shipping_assignments[].shipping.address.firstname":
    "order.order.shipmentPlans[].shipTo.firstName",
  "extension_attributes.shipping_assignments[].shipping.address.lastname":
    "order.order.shipmentPlans[].shipTo.lastName",
  "extension_attributes.shipping_assignments[].shipping.address.middlename":
    "order.order.shipmentPlans[].shipTo.middleName",
  "extension_attributes.shipping_assignments[].shipping.address.company":
    "order.order.shipmentPlans[].shipTo.company",
  "extension_attributes.shipping_assignments[].shipping.address.email":
    "order.order.shipmentPlans[].shipTo.email",
  "extension_attributes.shipping_assignments[].shipping.address.telephone":
    "order.order.shipmentPlans[].shipTo.phone",
  "extension_attributes.shipping_assignments[].shipping.address.street[0]":
    "order.order.shipmentPlans[].shipTo.address1",
  "extension_attributes.shipping_assignments[].shipping.address.street[1]":
    "order.order.shipmentPlans[].shipTo.address2",
  "extension_attributes.shipping_assignments[].shipping.address.city":
    "order.order.shipmentPlans[].shipTo.cityLocality",
  "extension_attributes.shipping_assignments[].shipping.address.region":
    "order.order.shipmentPlans[].shipTo.stateProvince",
  "extension_attributes.shipping_assignments[].shipping.address.region_code":
    "order.order.shipmentPlans[].shipTo.stateProvinceCode",
  "extension_attributes.shipping_assignments[].shipping.address.country_id":
    "order.order.shipmentPlans[].shipTo.country",
  "extension_attributes.shipping_assignments[].shipping.address.postcode":
    "order.order.shipmentPlans[].shipTo.postalCode",
  // "order.order.shipmentPlans[].selectedOption.carrier",
  // "order.order.shipmentPlans[].selectedOption.serviceLevel",
  // "order.order.shipmentPlans[].availableOptions[].externalId", - may need to be excluded, do not need to list unused 'available' options?
  // "order.order.shipmentPlans[].availableOptions[].name", - may need to be excluded, do not need to list unused 'available' options?
  // "order.order.shipmentPlans[].availableOptions[].shipmentType", - may need to be excluded, do not need to list unused 'available' options?
  // "order.order.shipmentPlans[].availableOptions[].cost", - may need to be excluded, do not need to list unused 'available' options?
  // "order.order.shipmentPlans[].availableOptions[].tax", - may need to be excluded, do not need to list unused 'available' options?
  // "order.order.shipmentPlans[].availableOptions[].total", - may need to be excluded, do not need to list unused 'available' options?
  // "order.order.shipmentPlans[].availableOptions[].carrier", - may need to be excluded, do not need to list unused 'available' options?
  // "order.order.shipmentPlans[].availableOptions[].serviceLevel", - may need to be excluded, do not need to list unused 'available' options?
};

// Shipment plan
const OrderShipmentPlanMap = {
  "extension_attributes.shipping_assignments[].items[]": [
    {
      key: "order.order.shipmentPlans[].lines[]",
      transform: (input: any): unknown => {
        if (input && Array.isArray(input)) {
          return input.map((item) => {
            if (item.item_id) {
              return {
                quantity: item.qty_ordered,
                externalId: item.item_id.toString(),
              };
            }
          });
        } else {
          return input;
        }
      },
    },
    // UNUSED - PROBABLY NOT MEANINGFUL
    // {
    //   key: "order.order.shipmentPlans[].shipments[].lines[]",
    //   transform: (input: any): unknown => {
    //     if (input && Array.isArray(input)) {
    //       return input.map((item) => {
    //         if (item.item_id) {
    //           return {
    //             quantity: item.qty_ordered,
    //             externalId: item.quote_item_id.toString(),
    //           };
    //         }
    //       });
    //     } else {
    //       return input;
    //     }
    //   },
    // },
  ],
  shipping_description: "order.order.shipmentPlans[].selectedOption.name",
  shipping_amount: {
    key: "order.order.shipmentPlans[].selectedOption.cost",
    transform: (value: number): string => value.toString(),
  },
  shipping_tax_amount: {
    key: "order.order.shipmentPlans[].selectedOption.tax",
    transform: (value: number): string => value.toString(),
  },
  shipping_incl_tax: [
    {
      key: "order.order.shipmentPlans[].selectedOption.total",
      transform: (value: number): string => value.toString(),
    },
    {
      key: "order.order.totalShipping",
      transform: (value: number): string => value.toString(),
    },
  ],
  // "order.order.shipmentPlans[].selectedOption.externalId",
  // "order.order.shipmentPlans[].selectedOption.shipmentType",
};

/**
 * Object mapping schema to map the Magento Order object
 * to the Fast V1ReadResponse object
 */
const OrderToV1ResponseMap = {
  ...OrderMap,
  ...OrderBillingAddressMap,
  ...OrderItemsMap,
  ...OrderShippingAddressMap,
  ...OrderShipmentPlanMap,

  // "order.order.coupons[].code",
  // "order.order.coupons[].description",
  // "order.order.coupons[].origin",
  // "order.order.coupons[].type",
  // "order.order.coupons[].applied",
  // "order.order.coupons[].totalAmount",
  // "order.order.customValues[].key",
  // "order.order.customValues[].value",
  // "order.order.storeNote",
  // "order.order.fastNote",
};

/**
 * READ-specific fields
 */
const OrderToV1ReadResponseMap = {
  customer_email: "user.user.email",
  customer_firstname: "user.user.firstName",
  customer_lastname: "user.user.lastName",
  "billing_address.telephone": "user.user.phone",
  customer_id: {
    key: "user.user.externalUserId",
    transform: (value: number): unknown => {
      if (value) {
        return value.toString();
      }
      return;
    },
  },
};

/**
 * UPDATE-specific fields
 */
const OrderToV1UpdateResponseMap = {};

export {
  OrderToV1ResponseMap,
  OrderToV1ReadResponseMap,
  OrderToV1UpdateResponseMap,
};
