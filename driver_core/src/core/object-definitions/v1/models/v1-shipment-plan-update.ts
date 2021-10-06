import { V1UUID } from "./v1-uuid";
import { V1OrderAddress } from "./v1-order-address";
import { V1OrderLineReference } from "./v1-order-line-reference";

/**
 *
 * @export
 * @interface V1ShipmentPlanUpdate
 */
export interface V1ShipmentPlanUpdate {
  /**
   *
   * @type {V1UUID}
   * @memberof V1ShipmentPlanUpdate
   */
  planId?: V1UUID;
  /**
   *
   * @type {V1OrderAddress}
   * @memberof V1ShipmentPlanUpdate
   */
  shipTo?: V1OrderAddress;
  /**
   *
   * @type {Array&lt;V1OrderLineReference&gt;}
   * @memberof V1ShipmentPlanUpdate
   */
  lineRefs?: V1OrderLineReference[];
};
