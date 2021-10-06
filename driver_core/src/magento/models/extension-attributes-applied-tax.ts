import { ExtensionAttributesAppliedTaxExtensionAttributes } from "./extension-attributes-applied-tax-extension-attributes";

export interface ExtensionAttributesAppliedTax {
  code?: string;
  title?: string;
  percent?: number;
  amount?: number;
  base_amount?: number;
  extension_attributes?: ExtensionAttributesAppliedTaxExtensionAttributes;
}
