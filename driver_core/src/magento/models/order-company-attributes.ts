import { ParentItemClass } from "./parent-item-class";

export interface CompanyOrderAttributes {
  order_id?: number;
  company_id?: number;
  company_name?: string;
  extension_attributes?: ParentItemClass;
}
