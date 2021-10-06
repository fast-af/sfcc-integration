import { V1ValueData } from "./v1-value-data";

/**
 *
 * @export
 * @interface V1OptionValue
 */
export interface V1OptionValue {
  /**
   *
   * @type {string}
   * @memberof V1OptionValue
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof V1OptionValue
   */
  optionId?: string;
  /**
   *
   * @type {string}
   * @memberof V1OptionValue
   */
  label?: string;
  /**
   *
   * @type {string}
   * @memberof V1OptionValue
   */
  optionDisplayName?: string;
  /**
   *
   * @type {V1ValueData}
   * @memberof V1OptionValue
   */
  valueData?: V1ValueData;
};
