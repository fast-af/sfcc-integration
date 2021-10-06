import { V1Product } from "./v1-product";
import { V1RateLimit } from "./v1-rate-limit";

/**
 *
 * @export
 * @interface V1ReadProductResponseSegment
 */
export interface V1ReadProductResponseSegment {
  /**
   *
   * @type {string}
   * @memberof V1ReadProductResponseSegment
   */
  appId?: string;
  /**
   *
   * @type {V1Product}
   * @memberof V1ReadProductResponseSegment
   */
  product?: V1Product;
  /**
   *
   * @type {V1RateLimit}
   * @memberof V1ReadProductResponseSegment
   */
  rateLimit?: V1RateLimit;
};
