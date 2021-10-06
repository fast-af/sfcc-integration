import CustomAttribute from "./custom-attribute";
import AddressExtensionAttributes from "./address-extension-attributes";
import Region from "./region";

export default interface Address {
  /**
   * @interface {number}
   * @memberof Address
   */
  id?: number | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  region?: Region | null;

  /**
   * @interface {number}
   * @memberof Address
   */
  region_id?: number | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  region_code?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  country_id?: string | null;

  /**
   * @interface {string[]}
   * @memberof Address
   */
  street?: string[];

  /**
   * @interface {string}
   * @memberof Address
   */
  company?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  telephone?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  fax?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  postcode?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  city?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  firstname?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  lastname?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  middlename?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  prefix?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  suffix?: string | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  vat_id?: string | null;

  /**
   * @interface {number}
   * @memberof Address
   */
  customer_id?: number | null;

  /**
   * @interface {string}
   * @memberof Address
   */
  email?: string | null;

  /**
   * @interface {number}
   * @memberof Address
   */
  same_as_billing?: number | null;

  /**
   * @interface {number}
   * @memberof Address
   */
  customer_address_id?: number | null;

  /**
   * @interface {number}
   * @memberof Address
   */
  save_in_address_book?: number | null;

  /**
   * @interface {AddressExtensionAttributes}
   * @memberof Address
   */
  extension_attributes?: AddressExtensionAttributes;

  /**
   * @interface {CustomAttribute[]}
   * @memberof Address
   */
  custom_attributes?: CustomAttribute[];
}
