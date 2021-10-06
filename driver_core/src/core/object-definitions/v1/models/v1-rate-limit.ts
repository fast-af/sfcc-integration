/**
 *
 * @export
 * @interface V1RateLimit
 */
export interface V1RateLimit {
  /**
   *
   * @type {number}
   * @memberof V1RateLimit
   */
  requestLeft?: number;
  /**
   *
   * @type {number}
   * @memberof V1RateLimit
   */
  requestQuota?: number;
  /**
   *
   * @type {number}
   * @memberof V1RateLimit
   */
  timeResetMs?: number;
  /**
   *
   * @type {number}
   * @memberof V1RateLimit
   */
  timeWindowMs?: number;
};
