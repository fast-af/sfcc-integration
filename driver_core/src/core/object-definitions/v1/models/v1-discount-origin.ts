/**
 * - DISCOUNT_ORIGIN_UNSPECIFIED: Discounts can be originated from many sources
 * @export
 * @enum {string}
 */
export enum V1DiscountOrigin {
  UNSPECIFIED = "DISCOUNT_ORIGIN_UNSPECIFIED",
  USER = "DISCOUNT_ORIGIN_USER",
  FAST = "DISCOUNT_ORIGIN_FAST",
  VENDOR = "DISCOUNT_ORIGIN_VENDOR",
}
