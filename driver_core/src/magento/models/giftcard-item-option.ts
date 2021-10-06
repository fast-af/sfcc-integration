import GiftcardItemOptionExtensionAttributes from "./giftcard-item-option-extension-attributes";

export default interface GiftcardItemOption {
  /**
   * @interface {string}
   * @memberof GiftcardItemOption
   */
  giftcard_amount?: string;

  /**
   * @interface {number}
   * @memberof GiftcardItemOption
   */
  custom_giftcard_amount?: number;

  /**
   * @interface {string}
   * @memberof GiftcardItemOption
   */
  giftcard_sender_name?: string;

  /**
   * @interface {string}
   * @memberof GiftcardItemOption
   */
  giftcard_recipient_name?: string;

  /**
   * @interface {string}
   * @memberof GiftcardItemOption
   */
  giftcard_sender_email?: string;

  /**
   * @interface {string}
   * @memberof GiftcardItemOption
   */
  giftcard_recipient_email?: string;

  /**
   * @interface {string}
   * @memberof GiftcardItemOption
   */
  giftcard_message?: string;

  /**
   * @interface {GiftcardItemOptionExtensionAttributes}
   * @memberof GiftcardItemOption
   */
  extension_attributes?: GiftcardItemOptionExtensionAttributes;
}
