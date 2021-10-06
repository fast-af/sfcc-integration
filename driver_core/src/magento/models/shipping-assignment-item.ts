import ShippingAssignmentItemExtensionAttributes from "./shipping-assignment-item-extension-attributes";
import ShippingAssignmentItemProductOption from "./shipping-assignment-item-product-option";

export default interface ShippingAssignmentItem {
  /**
   * @interface {number}
   * @memberof ShippingAssignmentItem
   */
  item_id?: number;

  /**
   * @interface {string}
   * @memberof ShippingAssignmentItem
   */
  sku?: string;

  /**
   * @interface {number}
   * @memberof ShippingAssignmentItem
   */
  qty?: number;

  /**
   * @interface {string}
   * @memberof ShippingAssignmentItem
   */
  name?: string;

  /**
   * @interface {number}
   * @memberof ShippingAssignmentItem
   */
  price?: number;

  /**
   * @interface {string}
   * @memberof ShippingAssignmentItem
   */
  product_type?: string;

  /**
   * @interface {string}
   * @memberof ShippingAssignmentItem
   */
  quote_id?: string;

  /**
   * @interface {ShippingAssignmentItemProductOption}
   * @memberof ShippingAssignmentItem
   */
  product_option?: ShippingAssignmentItemProductOption;

  /**
   * @interface {ShippingAssignmentItemExtensionAttributes}
   * @memberof ShippingAssignmentItem
   */
  extension_attributes?: ShippingAssignmentItemExtensionAttributes;
}
