import { V1DiscountOrigin } from "../../core/object-definitions/v1/models/v1-discount-origin";
import { V1DiscountType } from "../../core/object-definitions/v1/models/v1-discount-type";

/**
 * Object mapping schema to map the SFCC Product Line price adjustment object
 * to the Fast V1Response object.
 */
const ProductLinePriceAdjustmentToV1ResponseMap = {
  "product_items[].price_adjustments[].promotion_id": [
    {
      key: "order.order.lines[].discounts[].code",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.lines[].discounts[].origin",
      // TODO: This is based on the automatic promotion or coupon application.
      transform: (value: string): string | unknown => value ? V1DiscountOrigin.VENDOR : null,
    },
    {
      key: "order.order.lines[].discounts[].type",
      transform: (value: string): string | unknown => value ? V1DiscountType.REGULAR : null,
    },
  ],
  "product_items[].price_adjustments[].item_text": "order.order.lines[].discounts[].description",
  // TODO: Needs revisit to work on the logic.
  // There is no equivalent field to indicate if the coupon is
  // applied.  Hence, relying on price_adjustments[].applied_discount.type
  // to populate order.order.lines[].discounts[].applied.
  "product_items[].price_adjustments[].applied_discount.type": {
    key: "order.order.lines[].discounts[].applied",
    transform: (value: string): boolean | unknown => value ? true : null,
  },
  "product_items[].price_adjustments[].price": {
    key: "order.order.lines[].discounts[].totalAmount",
    // This is a strange behaviour from object mapper and it loops
    // to do the mapping, maybe, multiple times?!  Hence need to
    // use the Math function.
    transform: (value: number): string | unknown => value
      ? Math.abs(value).toString()
      : null,
  },
};

/**
 * Object mapping schema to map the SFCC Basket/order price adjustment object
 * to the Fast V1Response object.
 */
const OrderPriceAdjustmentToV1ResponseMap = {
  "order_price_adjustments[].promotion_id": [
    {
      key: "order.order.coupons[].code",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.coupons[].origin",
      // TODO: This is based on the automatic promotion or coupon application.
      transform: (value: string): string | unknown => value ? V1DiscountOrigin.VENDOR : null,
    },
    {
      key: "order.order.coupons[].type",
      transform: (value: string): string | unknown => value ? V1DiscountType.REGULAR : null,
    },
  ],
  "order_price_adjustments[].item_text": "order.order.coupons[].description",
  // TODO: Needs revisit to work on the logic.
  // There is no equivalent field to indicate if the coupon is
  // applied.  Hence, relying on price_adjustments[].applied_discount.type
  // to populate order.order.coupons[].discounts[].applied.
  "order_price_adjustments[].applied_discount.type": {
    key: "order.order.coupons[].applied",
    transform: (value: string): boolean | unknown => value ? true : null,
  },
  "order_price_adjustments[].price": {
    key: "order.order.coupons[].totalAmount",
    // This is a strange behaviour from object mapper and it loops
    // to do the mapping, maybe, multiple times?!  Hence need to
    // use the Math function.
    transform: (value: number): string | unknown => value
      ? Math.abs(value).toString()
      : null,
  },
};

export { ProductLinePriceAdjustmentToV1ResponseMap, OrderPriceAdjustmentToV1ResponseMap };
