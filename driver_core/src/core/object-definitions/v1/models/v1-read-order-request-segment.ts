import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1ReadOrderRequestSegment
 */
export interface V1ReadOrderRequestSegment {
  /**
   *
   * @type {boolean}
   * @memberof V1ReadOrderRequestSegment
   */
  isCart?: boolean;
  /**
   *
   * @type {V1UUID}
   * @memberof V1ReadOrderRequestSegment
   */
  orderId?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1ReadOrderRequestSegment
   */
  externalId?: string;
  /**
   *
   * @type {string}
   * @memberof V1ReadOrderRequestSegment
   */
  include?: string;
};
