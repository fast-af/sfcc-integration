import Discount from "./discount";
import NegotiableQuoteItem from "./negotiable-quote-item";

export default interface CartItemExtensionAttributes {
  /**
   * @interface {Discount[]}
   * @memberof CartItemExtensionAttributes
   */
  discounts?: Discount[];

  /**
   * @interface {NegotiableQuoteItem}
   * @memberof CartItemExtensionAttributes
   */
  negotiable_quote_item?: NegotiableQuoteItem;

  /**
   * @interface {string}
   * @memberof CartItemExtensionAttributes
   */
  fast_order_item_uuid?: string;
}
