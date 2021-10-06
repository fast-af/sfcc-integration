import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface Region {
  /**
   * @interface {string}
   * @memberof Region
   */
  region_code?: string;

  /**
   * @interface {string}
   * @memberof Region
   */
  region?: string;

  /**
   * @interface {number}
   * @memberof Region
   */
  region_id?: number;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof Region
   */
  extension_attributes?: ExtensionAttributesElement;
}
