import { OrderShippingAssignmentItem } from "./order-shipping-assignment-item";
import { ParentItemClass } from "./parent-item-class";
import { OrderShipping } from "./order-shipping";

export interface OrderShippingAssignment {
  shipping?: OrderShipping;
  items?: OrderShippingAssignmentItem[];
  stock_id?: number;
  extension_attributes?: ParentItemClass;
}
