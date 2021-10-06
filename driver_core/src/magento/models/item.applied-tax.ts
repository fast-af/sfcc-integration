import { ItemAppliedTaxAppliedTax } from "./item-applied-tax-applied-tax";
import { ParentItemClass } from "./parent-item-class";

export interface ItemAppliedTax {
  type?: string;
  item_id?: number;
  associated_item_id?: number;
  applied_taxes?: ItemAppliedTaxAppliedTax[];
  extension_attributes?: ParentItemClass;
}
