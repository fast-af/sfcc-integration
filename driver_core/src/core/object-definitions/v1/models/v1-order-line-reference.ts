import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1OrderLineReference
 */
export interface V1OrderLineReference {
  /**
   *
   * @type {V1UUID}
   * @memberof V1OrderLineReference
   */
  id?: V1UUID;
  /**
   *
   * @type {number}
   * @memberof V1OrderLineReference
   */
  quantity?: number;
  /**
   *
   * @type {string}
   * @memberof V1OrderLineReference
   */
  externalId?: string;
};
