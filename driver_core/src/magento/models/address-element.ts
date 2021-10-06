import CustomAttribute from "./custom-attribute";
import { ExtensionAttributesElement } from "./extension-attributes-element";
import Region from "./region";

export default interface AddressElement {
  /**
   * @interface {number}
   * @memberof AddressElement
   */
  id?: number | null;

  /**
   * @interface {number}
   * @memberof AddressElement
   */
  customer_id?: number | null;

  /**
   * @interface {Region}
   * @memberof AddressElement
   */
  region?: Region | null;

  /**
   * @interface {number}
   * @memberof AddressElement
   */
  region_id?: number | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  country_id?: string | null;

  /**
   * @interface {string[]}
   * @memberof AddressElement
   */
  street?: string[];

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  company?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  telephone?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  fax?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  postcode?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  city?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  firstname?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  lastname?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  middlename?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  prefix?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  suffix?: string | null;

  /**
   * @interface {string}
   * @memberof AddressElement
   */
  vat_id?: string | null;

  /**
   * @interface {boolean}
   * @memberof AddressElement
   */
  default_shipping?: boolean;

  /**
   * @interface {boolean}
   * @memberof AddressElement
   */
  default_billing?: boolean;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof AddressElement
   */
  extension_attributes?: ExtensionAttributesElement;

  /**
   * @interface {CustomAttribute[]}
   * @memberof AddressElement
   */
  custom_attributes?: CustomAttribute[];
}
