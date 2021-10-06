import { ParentItemClass } from "./parent-item-class";

export interface OrderStatusHistory {
  comment?: string;
  created_at?: string;
  entity_id?: number;
  entity_name?: string;
  is_customer_notified?: number;
  is_visible_on_front?: number;
  parent_id?: number;
  status?: string;
  extension_attributes?: ParentItemClass;
}
