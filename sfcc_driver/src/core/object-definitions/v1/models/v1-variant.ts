import { TypeMoney } from "./type-money";
import { V1Dimension } from "./v1-dimension";
import { V1OptionValue } from "./v1-option-value";
import { V1OptionValueMap } from "./v1-option-value-map";

/**
 *
 * @export
 * @interface V1Variant
 */
export interface V1Variant {
  /**
   *
   * @type {string}
   * @memberof V1Variant
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof V1Variant
   */
  sku?: string;
  /**
   *
   * @type {TypeMoney}
   * @memberof V1Variant
   */
  displayPrice?: TypeMoney;
  /**
   *
   * @type {TypeMoney}
   * @memberof V1Variant
   */
  fixedCostShippingPrice?: TypeMoney;
  /**
   *
   * @type {boolean}
   * @memberof V1Variant
   */
  isFreeShipping?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof V1Variant
   */
  purchasingDisabled?: boolean;
  /**
   *
   * @type {V1Dimension}
   * @memberof V1Variant
   */
  dimension?: V1Dimension;
  /**
   *
   * @type {Array&lt;V1OptionValue&gt;}
   * @memberof V1Variant
   */
  optionValues?: V1OptionValue[];
  /**
   *
   * @type {number}
   * @memberof V1Variant
   */
  inventoryLevel?: number;
  /**
   *
   * @type {string}
   * @memberof V1Variant
   */
  imageUrl?: string;
  /**
   *
   * @type {{ [key, string]: V1OptionValue;}}
   * @memberof V1Variant
   */
  optionValueMap?: V1OptionValueMap;
};
