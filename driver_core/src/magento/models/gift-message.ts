import { GiftMessageExtensionAttributes } from "./gift-message-extension-attributes";

export interface GiftMessage {
  gift_message_id?: number;
  customer_id?: number;
  sender?: string;
  recipient?: string;
  message?: string;
  extension_attributes?: GiftMessageExtensionAttributes;
}
