import { V1ShippingOptionType } from "./v1-shipping-option-type";
import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1ShippingOption
 */
export interface V1ShippingOption {
  /**
   *
   * @type {V1UUID}
   * @memberof V1ShippingOption
   */
  id?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOption
   */
  externalId?: string;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOption
   */
  name?: string;
  /**
   *
   * @type {V1ShippingOptionType}
   * @memberof V1ShippingOption
   */
  shipmentType?: V1ShippingOptionType;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOption
   */
  cost?: string;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOption
   */
  tax?: string;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOption
   */
  total?: string;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOption
   */
  carrier?: string;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOption
   */
  serviceLevel?: string;
}
