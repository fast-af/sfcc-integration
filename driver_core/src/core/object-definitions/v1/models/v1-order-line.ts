import { V1OrderCustomValue } from "./v1-order-custom-value";
import { V1OrderDiscount } from "./v1-order-discount";
import { V1ItemFulfillmentMode } from "./v1-item-fulfillment-mode";
import { V1UUID } from "./v1-uuid";
/**
 *
 * @export
 * @interface V1OrderLine
 */
export interface V1OrderLine {
  /**
   *
   * @type {V1UUID}
   * @memberof V1OrderLine
   */
  id?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  externalId?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  externalProductId?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  externalVariantId?: string;
  /**
   *
   * @type {Array&lt;V1OrderCustomValue&gt;}
   * @memberof V1OrderLine
   */
  externalOptions?: V1OrderCustomValue[];
  /**
   *
   * @type {Array&lt;V1OrderCustomValue&gt;}
   * @memberof V1OrderLine
   */
  customizations?: V1OrderCustomValue[];
  /**
   *
   * @type {number}
   * @memberof V1OrderLine
   */
  quantity?: number;
  /**
   *
   * @type {number}
   * @memberof V1OrderLine
   */
  quantityFulfilled?: number;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  unitPrice?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  discountedUnitPrice?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  lineDiscountAmount?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  subtotalAmount?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  taxAmount?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  totalAmount?: string;
  /**
   *
   * @type {Array&lt;V1OrderDiscount&gt;}
   * @memberof V1OrderLine
   */
  discounts?: V1OrderDiscount[];
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  description?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderLine
   */
  imageUrl?: string;
  /**
   *
   * @type {V1ItemFulfillmentMode}
   * @memberof V1OrderLine
   */
  fulfillmentMode?: V1ItemFulfillmentMode;
}
