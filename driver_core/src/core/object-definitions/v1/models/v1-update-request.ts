import { V1UUID } from "./v1-uuid";
import { V1EntityType } from "./v1-entity-type";
import { V1UpdateOrderRequestSegment } from "./v1-update-order-request-segment";

/**
 * -------------------------------- Start: Update Request -------------------------------- //
 * @export
 * @interface V1UpdateRequest
 */
export interface V1UpdateRequest {
  /**
   *
   * @type {string}
   * @memberof V1UpdateRequest
   */
  appId?: string;
  /**
   *
   * @type {V1UUID}
   * @memberof V1UpdateRequest
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1EntityType}
   * @memberof V1UpdateRequest
   */
  type?: V1EntityType;
  /**
   *
   * @type {V1UpdateOrderRequestSegment}
   * @memberof V1UpdateRequest
   */
  order?: V1UpdateOrderRequestSegment;
};
