import { V1UserSegment } from "./v1-user-segment";
import { V1EntityType } from "./v1-entity-type";
import { V1CreateRequestSegment } from "./v1-create-request-segment";
import { V1UUID } from "./v1-uuid";
import { V1WebhookSegment } from "./v1-webhook-segment";

/**
 * -------------------------------- Start: Create Request -------------------------------- //
 *
 * @export
 * @interface V1CreateRequest
 */
export interface V1CreateRequest {
  /**
   *
   * @type {V1EntityType}
   * @memberof V1CreateRequest
   */
  type?: V1EntityType;
  /**
   *
   * @type {string}
   * @memberof V1CreateRequest
   */
  appId?: string;
  /**
   *
   * @type {V1CreateRequestSegment}
   * @memberof V1CreateRequest
   */
  order?: V1CreateRequestSegment;
  /**
   *
   * @type {V1UUID}
   * @memberof V1CreateRequest
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1UserSegment}
   * @memberof V1CreateRequest
   */
  user?: V1UserSegment;
  /**
   *
   * @type {V1WebhookSegment}
   * @memberof V1CreateRequest
   */
  webhook?: V1WebhookSegment;
};
