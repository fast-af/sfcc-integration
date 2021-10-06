import { V1FastOrder } from "./v1-fast-order";
import { V1UpdateOrderSegmentStatus } from "./v1-update-order-segment-status";

/**
 *
 * @export
 * @interface V1UpdateOrderResponseSegment
 */
export interface V1UpdateOrderResponseSegment {
  /**
   *
   * @type {V1FastOrder}
   * @memberof V1UpdateOrderResponseSegment
   */
  order?: V1FastOrder;
  /**
   *
   * @type {Array&lt;V1UpdateOrderSegmentStatus&gt;}
   * @memberof V1UpdateOrderResponseSegment
   */
  status?: V1UpdateOrderSegmentStatus[];
}
