import Discount from "./discount";

export default interface AddressExtensionAttributes {
  /**
   * @interface {Discount[]}
   * @memberof AddressExtensionAttributes
   */
  discounts?: Discount[];

  /**
   * @interface {number}
   * @memberof AddressExtensionAttributes
   */
  gift_registry_id?: number;

  /**
   * @interface {string}
   * @memberof AddressExtensionAttributes
   */
  pickup_location_code?: string;
}
