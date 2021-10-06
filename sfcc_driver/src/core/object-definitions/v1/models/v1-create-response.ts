import { V1EntityType } from "./v1-entity-type";
import { V1WebhookSegment } from "./v1-webhook-segment";
import { V1OrderResponseSegment } from "./v1-order-response-segment";
import { V1UserSegment } from "./v1-user-segment";
import { V1UUID } from "./v1-uuid";

/**
 * -------------------------------- Start: Create Response -------------------------------- //
 * @export
 * @interface V1CreateResponse
 */
export interface V1CreateResponse {
  /**
   *
   * @type {V1EntityType}
   * @memberof V1CreateResponse
   */
  type?: V1EntityType;
  /**
   *
   * @type {V1OrderResponseSegment}
   * @memberof V1CreateResponse
   */
  order?: V1OrderResponseSegment;
  /**
   *
   * @type {V1UUID}
   * @memberof V1CreateResponse
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1UserSegment}
   * @memberof V1CreateResponse
   */
  user?: V1UserSegment;
  /**
   *
   * @type {V1WebhookSegment}
   * @memberof V1CreateResponse
   */
  webhook?: V1WebhookSegment;
}
