/**
 *
 * @export
 * @interface MagentoAuthModel
 */
export default interface MagentoAuthModel {
  /**
   *
   * @type {string}
   * @memberof MagentoAuthModel
   */
  merchant_api_url: string;

  /**
   *
   * @type {string}
   * @memberof MagentoAuthModel
   */
  magento_access_token: string;

  /**
   *
   * @type {number}
   * @memberof MagentoAuthModel
   */
  store_id: number;
}
