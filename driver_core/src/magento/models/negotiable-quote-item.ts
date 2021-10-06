import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface NegotiableQuoteItem {
  /**
   * @interface {number}
   * @memberof NegotiableQuoteItem
   */
  item_id?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuoteItem
   */
  original_price?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuoteItem
   */
  original_tax_amount?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuoteItem
   */
  original_discount_amount?: number;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof NegotiableQuoteItem
   */
  extension_attributes?: ExtensionAttributesElement;
}
