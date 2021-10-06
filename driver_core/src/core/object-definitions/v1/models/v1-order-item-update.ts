import { V1UUID } from "./v1-uuid";
import { V1OrderCustomValue } from "./v1-order-custom-value";

/**
 *
 * @export
 * @interface V1OrderItemUpdate
 */
export interface V1OrderItemUpdate {
  /**
   *
   * @type {V1UUID}
   * @memberof V1OrderItemUpdate
   */
  itemId?: V1UUID;
  /**
   *
   * @type {number}
   * @memberof V1OrderItemUpdate
   */
  quantity?: number;
  /**
   *
   * @type {string}
   * @memberof V1OrderItemUpdate
   */
  externalProductId?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderItemUpdate
   */
  externalVariantId?: string;
  /**
   *
   * @type {Array&lt;V1OrderCustomValue&gt;}
   * @memberof V1OrderItemUpdate
   */
  externalOptions?: V1OrderCustomValue[];
  /**
   *
   * @type {string}
   * @memberof V1OrderItemUpdate
   */
  externalItemId?: string;
  /**
   *
   * @type {Array&lt;V1OrderCustomValue&gt;}
   * @memberof V1OrderItemUpdate
   */
  customizations?: V1OrderCustomValue[];
}
