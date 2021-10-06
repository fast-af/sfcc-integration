import { OrderAddressBillingToV1ResponseMap, OrderAddressShippingToV1ResponseMap } from "./v1-fast-order-address";
import { ProductLineToV1ResponseMap } from "./v1-fast-product-line";
import { ShipmentToV1ResponseMap } from "./v1-fast-shipment";
import { V1OrderStatus } from "../../core/object-definitions/v1/models/v1-order-status";
import { V1OrderType } from "../../core/object-definitions/v1/models/v1-order-type";
import { CustomerInfoToV1ResponseMap } from "./v1-fast-customer-info";
import { CouponItemToV1ResponseMap } from "./v1-fast-coupon-item";
import { V1OrderLine } from "../../core/object-definitions/v1/models/v1-order-line";


/**
 * Get the SFCC line item from Fast request Line item.
 * 
 * @param item {V1OrderLine} - Fast request line item.
 * @returns {unknown} - a curtailed line item for SFCC API.
 */
const getCurtailedLineItem = (item: V1OrderLine): unknown => {
  return {
    c_fastProdLineId: item.id?.value,
    product_id: item.externalVariantId ? item.externalVariantId : item.externalProductId,
    quantity: item.quantity,
  };
};

/**
 * Object mapping schema to map the Fast V1CreateRequest object
 * to the SFCC Basket object.
 */
const V1CreateRequestToBasketMap = {
  "order.order.id.value": "c_fastId",
  "order.order.status": "c_fastStatus",

  "order.order.lines[]": {
    key: "product_items[]",
    transform: (sourceValue: V1OrderLine[]): unknown => {
      if (Array.isArray(sourceValue)) {
        return sourceValue.map(getCurtailedLineItem);
      } else if (!Array.isArray(sourceValue)) {
        return getCurtailedLineItem(sourceValue as V1OrderLine);
      };
    },
  },
};

/**
 * Object mapping schema to map the SFCC Basket object
 * to the V1FastOrder object.
 */
const BasketToV1FastOrderMap = {
  // Basket level.
  "basket_id": "order.order.externalId",
  "currency": "order.order.currencyCode",
  "c_fastId": "order.order.id.value",

  // lines & shipmentPlans[].lines[]:
  // Call v1-fast-product-line to merge the object.
  ...ProductLineToV1ResponseMap,

  "_type": [
    {
      // Basket<>orderType
      key: "order.order.orderType",
      transform: (): string => V1OrderType.CART,
    },
    {
      // Basket<>orderStatus
      key: "order.order.status",
      transform: (): string => V1OrderStatus.CART,
    },
  ],

  // billTo & shipmentPlans[].shipTo
  // Call v1-fast-order-address to merge the object.
  ...OrderAddressBillingToV1ResponseMap,
  ...OrderAddressShippingToV1ResponseMap,

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
    transform: (value: number): string | unknown => value ? value.toString() : "0",
  },

  // From SFCC documentation:
  // The total price of the order, including products, shipping and tax.
  "order_total": {
    key: "order.order.totalAmount",
    transform: (sourceValue: number, sourceObject: any): string => {
      if (sourceValue) return sourceValue.toString();
      else {
        // As required by the Fast team and based on the discussion
        // on 22 Sep 2021, this is a hack to subtract the discount,
        // if the coupon is applied before the order_total is
        // calculated by SFCC.
        const discount = sourceObject.c_orderLevelDiscountTotal
          ? sourceObject.c_orderLevelDiscountTotal : 0;
        return (sourceObject.product_sub_total + (-1 * discount)).toString();
      };
    },
  },

  // From SFCC documentation:
  // The total shipping price of the order after all shipping discounts.
  // Excludes tax if taxation policy is net. Includes tax if taxation 
  // policy is gross.
  "shipping_total": {
    key: "order.order.totalShipping",
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

/**
 * Object mapping schema to map the SFCC Basket object
 * to the Fast V1CreateResponse object.
 */
const BasketToV1CreateResponseMap = {
  ...BasketToV1FastOrderMap,
  ...CustomerInfoToV1ResponseMap,
};

/**
 * Object mapping schema to map the SFCC Basket object
 * to the Fast V1ReadResponse object.
 */
const BasketToV1ReadResponseMap = {
  ...BasketToV1FastOrderMap,
};

/**
 * Object mapping schema to map the SFCC Basket object
 * to the Fast V1UpdateResponse object.
 */
const BasketToV1UpdateResponseMap = {
  ...BasketToV1FastOrderMap,
};

export { V1CreateRequestToBasketMap, BasketToV1FastOrderMap,
  BasketToV1ReadResponseMap, BasketToV1UpdateResponseMap,
  BasketToV1CreateResponseMap
};