/**
 * Fast SFCC Auth model.
 * 
 * @export
 * @type FastSFCCAuthModel - {"salesforce_access_token":"AccessToken","host_server":"example.com","api_type":"v21_9","site_id":"XYZ"}
 */
type FastSFCCAuthModel = {
  /**
   * Access token as sent by Fast in the request header.
   * 
   * @type {string}
   * @memberof FastSFCCAuthModel
   */
  salesforce_access_token: string;

  /**
   * Seller provided Salesforce server host.
   * 
   * @type {string}
   * @memberof FastSFCCAuthModel
   */
  host_server: string;

  /**
   * SFCC OCAPI version supported and as configured in Fast.
   * 
   * @type {string}
   * @memberof FastSFCCAuthModel
   */
  api_type: string;

  /**
   * Seller provided Site id and as configured in Fast.
   * 
   * @type {string}
   * @memberof FastSFCCAuthModel
   */
  site_id: string;

  /**
   * The client id through whith access is granted
   * by the seller.
   * 
   * @type {string}
   * @memberof FastSFCCAuthModel
   */
  client_id: string;
};

export default FastSFCCAuthModel;
