import { V1UUID } from "./v1-uuid";
import { V1EntityType } from "./v1-entity-type";
import { V1DeleteOrderResponseSegment } from "./v1-delete-order-response-segment";
import { V1WebhookSegment } from "./v1-webhook-segment";

/**
 * -------------------------------- Start: Delete Response -------------------------------- //
 * @export
 * @interface V1DeleteResponse
 */
export interface V1DeleteResponse {
  /**
   *
   * @type {V1UUID}
   * @memberof V1DeleteResponse
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1EntityType}
   * @memberof V1DeleteResponse
   */
  type?: V1EntityType;
  /**
   *
   * @type {V1DeleteOrderResponseSegment}
   * @memberof V1DeleteResponse
   */
  order?: V1DeleteOrderResponseSegment;
  /**
   *
   * @type {V1WebhookSegment}
   * @memberof V1DeleteResponse
   */
  webhook?: V1WebhookSegment;
}
