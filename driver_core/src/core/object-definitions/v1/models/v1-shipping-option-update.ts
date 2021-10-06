import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1ShippingOptionUpdate
 */
export interface V1ShippingOptionUpdate {
  /**
   *
   * @type {V1UUID}
   * @memberof V1ShippingOptionUpdate
   */
  planId?: V1UUID;
  /**
   *
   * @type {V1UUID}
   * @memberof V1ShippingOptionUpdate
   */
  optionId?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1ShippingOptionUpdate
   */
  externalOptionId?: string;
}
