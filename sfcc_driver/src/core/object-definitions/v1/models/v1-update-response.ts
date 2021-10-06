import { V1UUID } from "./v1-uuid";
import { V1EntityType } from "./v1-entity-type";
import { V1UpdateOrderResponseSegment } from "./v1-update-order-response-segment";

/**
 * -------------------------------- Start: Update Response -------------------------------- //
 * @export
 * @interface V1UpdateResponse
 */
export interface V1UpdateResponse {
  /**
   *
   * @type {V1UUID}
   * @memberof V1UpdateResponse
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1EntityType}
   * @memberof V1UpdateResponse
   */
  type?: V1EntityType;
  /**
   *
   * @type {V1UpdateOrderResponseSegment}
   * @memberof V1UpdateResponse
   */
  order?: V1UpdateOrderResponseSegment;
}
