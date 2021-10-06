import Address from "./address";
import Currency from "./currency";
import Customer from "./customer";
import CartItem from "./cart-item";
import CartResponseExtensionAttributes from "./cart-extension-attributes";

//
// Contains base definitions for:
//  - CartRequest
//  - CartResponse
//
// Creating a new cart accepts no data so only the response is defined here.
//

/**
 * @interface CartRequest
 */
interface CartRequest {
  /**
   * @interface {string}
   * @memberof CartRequest
   */
  cartId?: string;
}

/**
 * @interface CartResponse
 */
interface CartResponse {
  /**
   * @interface {string}
   * @memberof CartResponse
   */
  id?: string;

  /**
   * @interface {string}
   * @memberof CartResponse
   */
  created_at?: string;

  /**
   * @interface {string}
   * @memberof CartResponse
   */
  updated_at?: string;

  /**
   * @interface {string}
   * @memberof CartResponse
   */
  converted_at?: string;

  /**
   * @interface {boolean}
   * @memberof CartResponse
   */
  is_active?: boolean;

  /**
   * @interface {boolean}
   * @memberof CartResponse
   */
  is_virtual?: boolean;

  /**
   * @interface {CartItem}
   * @memberof CartResponse
   */
  items?: CartItem[];

  /**
   * @interface {number}
   * @memberof CartResponse
   */
  items_count?: number;

  /**
   * @interface {number}
   * @memberof CartResponse
   */
  items_qty?: number;

  /**
   * @interface {Customer}
   * @memberof CartResponse
   */
  customer?: Customer;

  /**
   * @interface {Address}
   * @memberof CartResponse
   */
  billing_address?: Address;

  /**
   * @interface {string}
   * @memberof CartResponse
   */
  reserved_order_id?: string;

  /**
   * @interface {number}
   * @memberof CartResponse
   */
  orig_order_id?: number;

  /**
   * @interface {Currency}
   * @memberof CartResponse
   */
  currency?: Currency;

  /**
   * @interface {boolean}
   * @memberof CartResponse
   */
  customer_is_guest?: boolean;

  /**
   * @interface {string}
   * @memberof CartResponse
   */
  customer_note?: string;

  /**
   * @interface {boolean}
   * @memberof CartResponse
   */
  customer_note_notify?: boolean;

  /**
   * @interface {number}
   * @memberof CartResponse
   */
  customer_tax_class_id?: number;

  /**
   * @interface {number}
   * @memberof CartResponse
   */
  store_id?: number;

  /**
   * @interface {CartResponseExtensionAttributes}
   * @memberof CartResponse
   */
  extension_attributes?: CartResponseExtensionAttributes;

  /**
   * @interface {any}
   * @memberof CartResponse
   */
  totals?: Record<string, unknown>;
}

export { CartRequest, CartResponse };
