import { ExtensionAttributesElement } from "./extension-attributes-element";
import Address from "./address";

export default interface Shipping {
  /**
   * @interface {Address}
   * @memberof Shipping
   */
  address?: Address;

  /**
   * @interface {string}
   * @memberof Shipping
   */
  method?: string | null;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof Shipping
   */
  extension_attributes?: ExtensionAttributesElement;
}
