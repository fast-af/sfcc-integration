import { V1Adjusters } from "./v1-adjusters";
import { V1ValueData } from "./v1-value-data";

/**
 *
 * @export
 * @interface V1ModifierOptionValue
 */
export interface V1ModifierOptionValue {
  /**
   *
   * @type {string}
   * @memberof V1ModifierOptionValue
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof V1ModifierOptionValue
   */
  optionId?: string;
  /**
   *
   * @type {string}
   * @memberof V1ModifierOptionValue
   */
  label?: string;
  /**
   *
   * @type {boolean}
   * @memberof V1ModifierOptionValue
   */
  isDefault?: boolean;
  /**
   *
   * @type {number}
   * @memberof V1ModifierOptionValue
   */
  sortOrder?: number;
  /**
   *
   * @type {V1Adjusters}
   * @memberof V1ModifierOptionValue
   */
  adjusters?: V1Adjusters;
  /**
   *
   * @type {V1ValueData}
   * @memberof V1ModifierOptionValue
   */
  valueData?: V1ValueData;
};
