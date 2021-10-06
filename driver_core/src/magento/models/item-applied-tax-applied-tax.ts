import { ItemAppliedTaxAppliedTaxExtensionAttributes } from "./item-applied-tax-applied-tax-extension-attributes";

export interface ItemAppliedTaxAppliedTax {
  code?: string;
  title?: string;
  percent?: number;
  amount?: number;
  base_amount?: number;
  extension_attributes?: ItemAppliedTaxAppliedTaxExtensionAttributes;
}
