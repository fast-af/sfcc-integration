import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1OrderAddress
 */
export interface V1OrderAddress {
  /**
   *
   * @type {V1UUID}
   * @memberof V1OrderAddress
   */
  id?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  firstName?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  lastName?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  middleName?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  company?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  email?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  phone?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  address1?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  address2?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  cityLocality?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  stateProvince?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  stateProvinceCode?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  country?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  countryCode?: string;
  /**
   *
   * @type {string}
   * @memberof V1OrderAddress
   */
  postalCode?: string;
}
