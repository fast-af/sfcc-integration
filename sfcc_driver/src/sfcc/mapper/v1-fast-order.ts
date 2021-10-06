import { OrderAddressBillingToV1ResponseMap, OrderAddressShippingToV1ResponseMap } from "./v1-fast-order-address";
import { ProductLineToV1ResponseMap } from "./v1-fast-product-line";
import { ShipmentToV1ResponseMap } from "./v1-fast-shipment";
import { V1OrderType } from "../../core/object-definitions/v1/models/v1-order-type";
import { CouponItemToV1ResponseMap } from "./v1-fast-coupon-item";

/**
 * Object mapping schema to map the SFCC Order object
 * to the Fast V1ReadResponse object.
 */
const OrderToV1ReadResponseMap = {
  // Order-level
  "_type": [
    {
      // Order<>orderType
      key: "order.order.orderType",
      transform: (): string => V1OrderType.ORDER,
    },
  ],
  "c_fastId": "order.order.id.value",
  "c_fastStatus": "order.order.status",

  // billTo & shipmentPlans[].shipTo
  // Call v1-fast-order-address to merge the object.
  ...OrderAddressBillingToV1ResponseMap,
  ...OrderAddressShippingToV1ResponseMap,

  "currency": "order.order.currencyCode",
  "order_no": "order.order.externalId",

  // user
  "customer_info.customer_id": "order.order.userId",

  // lines
  // Call v1-fast-product-line to merge the object.
  ...ProductLineToV1ResponseMap,

  // shipmentPlans
  // Call v1-fast-shipment to merge the object.
  ...ShipmentToV1ResponseMap,

  // coupons
  // Call v1-fast-coupon-item to merge the object.
  ...CouponItemToV1ResponseMap,

  // From SFCC documentation:
  // The total price of all product items after all product discounts.
  // Depending on taxation policy the returned price is net or gross.
  "product_sub_total": {
    key: "order.order.subTotal",
    transform: (value: number): string => value ? value.toString() : "0",
  },

  // From SFCC documentation:
  // The total price of the order, including products, shipping and tax.
  "order_total": {
    key: "order.order.totalAmount",
    transform: (value: number): string => value ? value.toString() : "0",
  },

  // From SFCC documentation:
  // The total shipping price of the order after all shipping discounts.
  // Excludes tax if taxation policy is net. Includes tax if taxation 
  // policy is gross.
  "shipping_total": {
    key: "order.order.totalShipping",
    // transform: (sourceValue: number, sourceObject: OCAPI.Basket): string => !sourceValue 
    //   ? "0" : (sourceObject.shipping_total + sourceObject.shipping_total_tax).toString(),
    transform: (value: number): string => value ? value.toString() : "0",
  },

  // From SFCC documentation:
  // The total tax amount of the order.
  "tax_total": {
    key: "order.order.totalTax",
    transform: (value: number): string => value ? value.toString() : "0",
  },

  // order.order.totalDiscounts
  "c_orderLevelDiscountTotal": [
    {
      key: "order.order.totalDiscounts",
      transform: (value: number): string => value ? value.toString() : "0",
    },
    {
      key: "order.order.coupons[].totalAmount",
      transform: (value: number): string | null => value ? value.toString() : null,
    },
  ],
};

export { OrderToV1ReadResponseMap };
