import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface CustomOption {
  /**
   * @interface {number}
   * @memberof CustomOption
   */
  option_id?: number;

  /**
   * @interface {string}
   * @memberof CustomOption
   */
  option_value?: string;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof CustomOption
   */
  extension_attributes?: ExtensionAttributesElement;
}
