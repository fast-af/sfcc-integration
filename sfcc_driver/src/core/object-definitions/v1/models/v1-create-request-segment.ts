import { V1FastOrder } from "./v1-fast-order";

/**
 *
 * @export
 * @interface V1CreateRequestSegment
 */
export interface V1CreateRequestSegment {
  /**
   *
   * @type {boolean}
   * @memberof V1CreateRequestSegment
   */
  isCart?: boolean;
  /**
   *
   * @type {V1FastOrder}
   * @memberof V1CreateRequestSegment
   */
  order?: V1FastOrder;
};
