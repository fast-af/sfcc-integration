import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface NegotiableQuote {
  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  quote_id?: number;

  /**
   * @interface {boolean}
   * @memberof NegotiableQuote
   */
  is_regular_quote?: boolean;

  /**
   * @interface {string}
   * @memberof NegotiableQuote
   */
  status?: string;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  negotiated_price_type?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  negotiated_price_value?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  shipping_price?: number;

  /**
   * @interface {string}
   * @memberof NegotiableQuote
   */
  quote_name?: string;

  /**
   * @interface {string}
   * @memberof NegotiableQuote
   */
  expiration_period?: string;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  email_notification_status?: number;

  /**
   * @interface {boolean}
   * @memberof NegotiableQuote
   */
  has_unconfirmed_changes?: boolean;

  /**
   * @interface {boolean}
   * @memberof NegotiableQuote
   */
  is_shipping_tax_changed?: boolean;

  /**
   * @interface {boolean}
   * @memberof NegotiableQuote
   */
  is_customer_price_changed?: boolean;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  notifications?: number;

  /**
   * @interface {string}
   * @memberof NegotiableQuote
   */
  applied_rule_ids?: string;

  /**
   * @interface {boolean}
   * @memberof NegotiableQuote
   */
  is_address_draft?: boolean;

  /**
   * @interface {string}
   * @memberof NegotiableQuote
   */
  deleted_sku?: string;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  creator_id?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  creator_type?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  original_total_price?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  base_original_total_price?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  negotiated_total_price?: number;

  /**
   * @interface {number}
   * @memberof NegotiableQuote
   */
  base_negotiated_total_price?: number;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof NegotiableQuote
   */
  extension_attributes?: ExtensionAttributesElement;
}
