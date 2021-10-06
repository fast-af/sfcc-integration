import AmazonOrderReferenceID from "./amazon-order-reference-id";
import NegotiableQuote from "./negotiable-quote";
import ShippingAssignment from "./shipping-assignment";

export default interface CartResponseExtensionAttributes {
  /**
   * @interface {ShippingAssignment[]}
   * @memberof CartResponseExtensionAttributes
   */
  shipping_assignments?: ShippingAssignment[];

  /**
   * @interface {NegotiableQuote}
   * @memberof CartResponseExtensionAttributes
   */
  negotiable_quote?: NegotiableQuote;

  /**
   * @interface {AmazonOrderReferenceID}
   * @memberof CartResponseExtensionAttributes
   */
  amazon_order_reference_id?: AmazonOrderReferenceID;
}
