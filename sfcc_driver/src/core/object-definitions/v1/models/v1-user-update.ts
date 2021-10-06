/**
 *
 * @export
 * @interface V1UserUpdate
 */
export interface V1UserUpdate {
  /**
   *
   * @type {string}
   * @memberof V1UserUpdate
   */
  externalCustomerId?: string;

  /**
   * Added after a confirmation from the Fast team
   * on 11 Sep 2021.
   * 
   * @type {string}
   * @memberof V1UserUpdate
   */
  email?: string;
};
