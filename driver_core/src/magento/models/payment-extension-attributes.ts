import { VaultPaymentToken } from "./vault-payment-token";

export interface PaymentExtensionAttributes {
  notification_message?: string;
  vault_payment_token?: VaultPaymentToken;
}
