import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface BundleOption {
  /**
   * @interface {number}
   * @memberof BundleOption
   */
  option_id?: number;

  /**
   * @interface {number}
   * @memberof BundleOption
   */
  option_qty?: number;

  /**
   * @interface {any[]}
   * @memberof BundleOption
   */
  option_selections?: any[];

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof BundleOption
   */
  extension_attributes?: ExtensionAttributesElement;
}
