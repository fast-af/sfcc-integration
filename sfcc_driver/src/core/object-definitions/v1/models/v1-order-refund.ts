import { V1OrderLineReference } from "./v1-order-line-reference";
import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1OrderRefund
 */
export interface V1OrderRefund {
  /**
   *
   * @type {V1UUID}
   * @memberof V1OrderRefund
   */
  id?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1OrderRefund
   */
  externalId?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderRefund
   */
  reason?: string;
  /**
   *
   * @type {boolean}
   * @memberof V1OrderRefund
   */
  useOriginalMethod?: boolean;
  /**
   *
   * @type {Array&lt;V1OrderLineReference&gt;}
   * @memberof V1OrderRefund
   */
  lines?: V1OrderLineReference[];
  /**
   *
   * @type {string}
   * @memberof V1OrderRefund
   */
  refundDate?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderRefund
   */
  amount?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderRefund
   */
  tax?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderRefund
   */
  shipping?: string;
}
