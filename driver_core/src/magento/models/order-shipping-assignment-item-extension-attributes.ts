import { ParentItemClass } from "./parent-item-class";

export interface OrderShippingAssignmentItemExtensionAttributes {
  gift_message?: ParentItemClass;
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
  vertex_tax_codes?: null[];
  invoice_text_codes?: null[];
  tax_codes?: null[];
  vertex_commodity_code?: ParentItemClass;
}
