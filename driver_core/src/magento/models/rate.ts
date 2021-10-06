import { ParentItemClass } from "./parent-item-class";

export interface Rate {
  code?: string;
  title?: string;
  percent?: number;
  extension_attributes?: ParentItemClass;
}
