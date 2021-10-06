import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface ConfigurableItemOption {
  /**
   * @interface {string}
   * @memberof ConfigurableItemOption
   */
  option_id?: string;

  /**
   * @interface {number}
   * @memberof ConfigurableItemOption
   */
  option_value?: number;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof ConfigurableItemOption
   */
  extension_attributes?: ExtensionAttributesElement;
}
