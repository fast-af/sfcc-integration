import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface Currency {
  /**
   * @interface {string}
   * @memberof Currency
   */
  global_currency_code?: string;

  /**
   * @interface {string}
   * @memberof Currency
   */
  base_currency_code?: string;

  /**
   * @interface {string}
   * @memberof Currency
   */
  store_currency_code?: string;

  /**
   * @interface {string}
   * @memberof Currency
   */
  quote_currency_code?: string;

  /**
   * @interface {number}
   * @memberof Currency
   */
  store_to_base_rate?: number;

  /**
   * @interface {number}
   * @memberof Currency
   */
  store_to_quote_rate?: number;

  /**
   * @interface {number}
   * @memberof Currency
   */
  base_to_global_rate?: number;

  /**
   * @interface {number}
   * @memberof Currency
   */
  base_to_quote_rate?: number;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof Currency
   */
  extension_attributes?: ExtensionAttributesElement;
}
