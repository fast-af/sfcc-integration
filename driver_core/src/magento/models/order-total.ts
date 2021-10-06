import { ParentItemClass } from "./parent-item-class";

export interface OrderTotal {
  base_shipping_amount?: number;
  base_shipping_canceled?: number;
  base_shipping_discount_amount?: number;
  base_shipping_discount_tax_compensation_amnt?: number;
  base_shipping_incl_tax?: number;
  base_shipping_invoiced?: number;
  base_shipping_refunded?: number;
  base_shipping_tax_amount?: number;
  base_shipping_tax_refunded?: number;
  shipping_amount?: number;
  shipping_canceled?: number;
  shipping_discount_amount?: number;
  shipping_discount_tax_compensation_amount?: number;
  shipping_incl_tax?: number;
  shipping_invoiced?: number;
  shipping_refunded?: number;
  shipping_tax_amount?: number;
  shipping_tax_refunded?: number;
  extension_attributes?: ParentItemClass;
}
