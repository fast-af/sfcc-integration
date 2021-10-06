export interface VaultPaymentToken {
  entity_id?: number;
  customer_id?: number;
  public_hash?: string;
  payment_method_code?: string;
  type?: string;
  created_at?: string;
  expires_at?: string;
  gateway_token?: string;
  token_details?: string;
  is_active?: boolean;
  is_visible?: boolean;
}
