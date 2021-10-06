import { V1DiscountOrigin } from "./v1-discount-origin";
import { V1DiscountType } from "./v1-discount-type";

/**
 *
 * @export
 * @interface V1OrderDiscount
 */
export interface V1OrderDiscount {
  /**
   *
   * @type {string}
   * @memberof V1OrderDiscount
   */
  code?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderDiscount
   */
  description?: string;
  /**
   *
   * @type {V1DiscountOrigin}
   * @memberof V1OrderDiscount
   */
  origin?: V1DiscountOrigin;
  /**
   *
   * @type {V1DiscountType}
   * @memberof V1OrderDiscount
   */
  type?: V1DiscountType;
  /**
   *
   * @type {boolean}
   * @memberof V1OrderDiscount
   */
  applied?: boolean;
  /**
   *
   * @type {string}
   * @memberof V1OrderDiscount
   */
  totalAmount?: string;
}
