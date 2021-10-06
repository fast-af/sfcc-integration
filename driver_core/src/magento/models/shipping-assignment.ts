import { ExtensionAttributesElement } from "./extension-attributes-element";
import Shipping from "./shipping";
import ShippingAssignmentItem from "./shipping-assignment-item";
import MagentoShippingOptionsItem from "./magento-shipping-options-item";

export default interface ShippingAssignment {
  /**
   * @interface {Shipping}
   * @memberof ShippingAssignment
   */
  shipping?: Shipping;

  /**
   * @interface {ShippingAssignmentItem[]}
   * @memberof ShippingAssignment
   */
  items?: ShippingAssignmentItem[];

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof ShippingAssignment
   */
  extension_attributes?: ExtensionAttributesElement;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof ShippingAssignment
   */
  magentoShippingOptions?: MagentoShippingOptionsItem[];
}
