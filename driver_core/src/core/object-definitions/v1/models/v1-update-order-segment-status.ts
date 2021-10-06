import { V1UpdateOrderSegmentType } from "./v1-update-order-segment-type";

/**
 *
 * @export
 * @interface V1UpdateOrderSegmentStatus
 */
export interface V1UpdateOrderSegmentStatus {
  /**
   *
   * @type {V1UpdateOrderSegmentType}
   * @memberof V1UpdateOrderSegmentStatus
   */
  updated?: V1UpdateOrderSegmentType;
  /**
   *
   * @type {boolean}
   * @memberof V1UpdateOrderSegmentStatus
   */
  status?: boolean;
  /**
   *
   * @type {string}
   * @memberof V1UpdateOrderSegmentStatus
   */
  reasonCode?: string;
  /**
   *
   * @type {string}
   * @memberof V1UpdateOrderSegmentStatus
   */
  message?: string;
};
