import { V1DiscountType } from "../../core/object-definitions/v1/models/v1-discount-type";
import { V1DiscountOrigin } from "../../core/object-definitions/v1/models/v1-discount-origin";

/**
 * Object mapping schema to map the SFCC Basket/order price adjustment object
 * to the Fast V1Response object.
 */
const CouponItemToV1ResponseMap = {
  "coupon_items[].code": [
    {
      key: "order.order.coupons[].code",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.coupons[].origin",
      // TODO: This is based on the automatic promotion or coupon application.
      transform: (value: string): string | unknown => value ? V1DiscountOrigin.USER : null,
    },
    {
      key: "order.order.coupons[].type",
      transform: (value: string): string | unknown => value ? V1DiscountType.REGULAR : null,
    },
    {
      key: "order.order.coupons[].applied",
      transform: (value: string): boolean | unknown => value ? true : null,
    },
  ],
  "coupon_items[].coupon_item_id": "order.order.coupons[].description",

  // TODO: No provision in SFCC for "coupon_items[].price".
  // However, for "order.order.coupons[].totalAmount" it is
  // handled in v1-fast-basket.ts and v1-fast-order.ts.
};

export { CouponItemToV1ResponseMap };