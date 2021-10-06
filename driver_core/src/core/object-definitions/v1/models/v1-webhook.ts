import { V1WebhookScope } from "./v1-webhook-scope";

/**
 *
 * @export
 * @interface V1Webhook
 */
export interface V1Webhook {
  /**
   *
   * @type {string}
   * @memberof V1Webhook
   */
  id?: string;
  /**
   *
   * @type {V1WebhookScope}
   * @memberof V1Webhook
   */
  scope?: V1WebhookScope;
}
