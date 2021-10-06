import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1DeleteOrderRequestSegment
 */
export interface V1DeleteOrderRequestSegment {
  /**
   *
   * @type {boolean}
   * @memberof V1DeleteOrderRequestSegment
   */
  isCart?: boolean;
  /**
   *
   * @type {V1UUID}
   * @memberof V1DeleteOrderRequestSegment
   */
  orderId?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1DeleteOrderRequestSegment
   */
  externalId?: string;
}
