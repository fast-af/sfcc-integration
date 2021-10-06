import { GiftMessage } from "./gift-message";
import { VertexCommodityCode } from "./vertex-commodity-code";

export interface OrderItemExtensionAttributes {
  gift_message?: GiftMessage;
  gw_id?: string;
  gw_base_price?: string;
  gw_price?: string;
  gw_base_tax_amount?: string;
  gw_tax_amount?: string;
  gw_base_price_invoiced?: string;
  gw_price_invoiced?: string;
  gw_base_tax_amount_invoiced?: string;
  gw_tax_amount_invoiced?: string;
  gw_base_price_refunded?: string;
  gw_price_refunded?: string;
  gw_base_tax_amount_refunded?: string;
  gw_tax_amount_refunded?: string;
  vertex_tax_codes?: string[];
  invoice_text_codes?: string[];
  tax_codes?: string[];
  vertex_commodity_code?: VertexCommodityCode;
}
