import { V1OrderAddress } from "./v1-order-address";
import { V1OrderLineReference } from "./v1-order-line-reference";
import { V1ShippingOption } from "./v1-shipping-option";
import { V1Shipment } from "./v1-shipment";
import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1OrderShipmentPlan
 */
export interface V1OrderShipmentPlan {
  /**
   *
   * @type {V1UUID}
   * @memberof V1OrderShipmentPlan
   */
  id?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1OrderShipmentPlan
   */
  externalId?: string;
  /**
   *
   * @type {V1OrderAddress}
   * @memberof V1OrderShipmentPlan
   */
  shipTo?: V1OrderAddress;
  /**
   *
   * @type {Array&lt;V1OrderLineReference&gt;}
   * @memberof V1OrderShipmentPlan
   */
  lines?: V1OrderLineReference[];
  /**
   *
   * @type {V1ShippingOption}
   * @memberof V1OrderShipmentPlan
   */
  selectedOption?: V1ShippingOption;
  /**
   *
   * @type {Array&lt;V1ShippingOption&gt;}
   * @memberof V1OrderShipmentPlan
   */
  availableOptions?: V1ShippingOption[];
  /**
   *
   * @type {Array&lt;V1Shipment&gt;}
   * @memberof V1OrderShipmentPlan
   */
  shipments?: V1Shipment[];
}
