import { V1UUID } from "./v1-uuid";
import { V1EntityType } from "./v1-entity-type";
import { V1DeleteOrderRequestSegment } from "./v1-delete-order-request-segment";
import { V1WebhookSegment } from "./v1-webhook-segment";

/**
 * -------------------------------- Start: Delete Request -------------------------------- //
 * @export
 * @interface V1DeleteRequest
 */
export interface V1DeleteRequest {
  /**
   *
   * @type {string}
   * @memberof V1DeleteRequest
   */
  appId?: string;
  /**
   *
   * @type {V1UUID}
   * @memberof V1DeleteRequest
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1EntityType}
   * @memberof V1DeleteRequest
   */
  type?: V1EntityType;
  /**
   *
   * @type {V1DeleteOrderRequestSegment}
   * @memberof V1DeleteRequest
   */
  order?: V1DeleteOrderRequestSegment;
  /**
   *
   * @type {V1WebhookSegment}
   * @memberof V1DeleteRequest
   */
  webhook?: V1WebhookSegment;
};
