import { OrderAddress } from "./order-address";
import { OrderTotal } from "./order-total";
import { ParentItemClass } from "./parent-item-class";

export interface OrderShipping {
  address?: OrderAddress;
  method?: string;
  total?: OrderTotal;
  extension_attributes?: ParentItemClass;
}
