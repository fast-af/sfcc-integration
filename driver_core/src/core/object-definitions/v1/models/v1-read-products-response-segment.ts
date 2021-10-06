import { V1Product } from "./v1-product";
import { V1RateLimit } from "./v1-rate-limit";

/**
 *
 * @export
 * @interface V1ReadProductsResponseSegment
 */
export interface V1ReadProductsResponseSegment {
  /**
   *
   * @type {string}
   * @memberof V1ReadProductsResponseSegment
   */
  appId?: string;
  /**
   *
   * @type {Array&lt;V1Product&gt;}
   * @memberof V1ReadProductsResponseSegment
   */
  products?: V1Product[];
  /**
   *
   * @type {V1RateLimit}
   * @memberof V1ReadProductsResponseSegment
   */
  rateLimit?: V1RateLimit;
  /**
   *
   * @type {string}
   * @memberof V1ReadProductsResponseSegment
   */
  lastId?: string;
  /**
   *
   * @type {boolean}
   * @memberof V1ReadProductsResponseSegment
   */
  moreResults?: boolean;
};
