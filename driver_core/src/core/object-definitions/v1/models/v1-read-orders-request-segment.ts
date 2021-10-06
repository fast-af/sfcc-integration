import { V1OrderStatus } from "./v1-order-status";

/**
 *
 * @export
 * @interface V1ReadOrdersRequestSegment
 */
export interface V1ReadOrdersRequestSegment {
  /**
   *
   * @type {string}
   * @memberof V1ReadOrdersRequestSegment
   */
  after?: string;
  /**
   *
   * @type {V1OrderStatus}
   * @memberof V1ReadOrdersRequestSegment
   */
  status?: V1OrderStatus;
  /**
   *
   * @type {number}
   * @memberof V1ReadOrdersRequestSegment
   */
  page?: number;
  /**
   *
   * @type {number}
   * @memberof V1ReadOrdersRequestSegment
   */
  limit?: number;
};
