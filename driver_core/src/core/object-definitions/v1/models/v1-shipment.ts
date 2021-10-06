import { V1OrderLineReference } from "./v1-order-line-reference";

/**
 *
 * @export
 * @interface V1Shipment
 */
export interface V1Shipment {
  /**
   *
   * @type {string}
   * @memberof V1Shipment
   */
  carrier?: string;
  /**
   *
   * @type {string}
   * @memberof V1Shipment
   */
  trackingNumber?: string;
  /**
   *
   * @type {string}
   * @memberof V1Shipment
   */
  estimatedDeliveryDate?: string;
  /**
   *
   * @type {Array&lt;V1OrderLineReference&gt;}
   * @memberof V1Shipment
   */
  lines?: V1OrderLineReference[];
}
