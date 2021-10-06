import { V1ModifierType } from "./v1-modifier-type";
import { V1ModifierOptionValue } from "./v1-modifier-option-value";

/**
 *
 * @export
 * @interface V1ProductModifier
 */
export interface V1ProductModifier {
  /**
   *
   * @type {string}
   * @memberof V1ProductModifier
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductModifier
   */
  productId?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductModifier
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductModifier
   */
  displayName?: string;
  /**
   *
   * @type {number}
   * @memberof V1ProductModifier
   */
  sortOrder?: number;
  /**
   *
   * @type {boolean}
   * @memberof V1ProductModifier
   */
  required?: boolean;
  /**
   *
   * @type {V1ModifierType}
   * @memberof V1ProductModifier
   */
  type?: V1ModifierType;
  /**
   *
   * @type {Array&lt;V1ModifierOptionValue&gt;}
   * @memberof V1ProductModifier
   */
  optionValues?: V1ModifierOptionValue[];
};
