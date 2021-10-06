import AddressElement from "./address-element";
import CustomAttribute from "./custom-attribute";
import CustomerExtensionAttributes from "./customer-extension-attributes";

export default interface Customer {
  /**
   * @interface {number}
   * @memberof Customer
   */
  id?: number | null;

  /**
   * @interface {number}
   * @memberof Currency
   */
  group_id?: number;

  /**
   * @interface {string}
   * @memberof Currency
   */
  default_billing?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  default_shipping?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  confirmation?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  created_at?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  updated_at?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  created_in?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  dob?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  email?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  firstname?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  lastname?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  middlename?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  prefix?: string | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  suffix?: string | null;

  /**
   * @interface {number}
   * @memberof Currency
   */
  gender?: number | null;

  /**
   * @interface {number}
   * @memberof Currency
   */
  store_id?: number | null;

  /**
   * @interface {string}
   * @memberof Currency
   */
  taxvat?: string | null;

  /**
   * @interface {number}
   * @memberof Currency
   */
  website_id?: number | null;

  /**
   * @interface {AddressElement[]}
   * @memberof Currency
   */
  addresses?: AddressElement[];

  /**
   * @interface {number}
   * @memberof Currency
   */
  disable_auto_group_change?: number | null;

  /**
   * @interface {CustomerExtensionAttributes}
   * @memberof Currency
   */
  extension_attributes?: CustomerExtensionAttributes;

  /**
   * @interface {CustomAttribute[]}
   * @memberof Currency
   */
  custom_attributes?: CustomAttribute[];
}
