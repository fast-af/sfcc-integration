import ProductOption from "./product-option";
import CartItemExtensionAttributes from "./cart-item-extension-attributes";

export default interface CartItem {
  /**
   * @interface {number}
   * @memberof CartItem
   */
  item_id?: number;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  sku?: string;

  /**
   * @interface {number}
   * @memberof CartItem
   */
  qty: number;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  name?: string;

  /**
   * @interface {number}
   * @memberof CartItem
   */
  price?: number;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  product_type?: string;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  quote_id: string;

  /**
   * @interface {ProductOption}
   * @memberof CartItem
   */
  product_option?: ProductOption;

  /**
   * @interface {CartItemExtensionAttributes}
   * @memberof CartItem
   */
  extension_attributes?: CartItemExtensionAttributes;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  description?: string;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  image_url?: string;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  product_id?: string;

  /**
   * @interface {string}
   * @memberof CartItem
   */
  variant_id?: string;
}
