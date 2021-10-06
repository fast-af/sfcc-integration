/**
 * SFCC OAuth model.
 * 
 * @export
 * @type SFCCAuthModel
 */
type SFCCAuthModel = {
  /**
   * 
   * @type {string}
   * @memberof SFCCAuthModel
   */
  host: string;

  /**
   * 
   * @type {string}
   * @memberof SFCCAuthModel
   */
  clientId: string;

  /**
   * 
   * @type {string}
   * @memberof SFCCAuthModel
   */
  clientPassword: string;

  /**
   * 
   * @type {string}
   * @memberof SFCCAuthModel
   */
  bmUsername: string;

  /**
   * 
   * @type {string}
   * @memberof SFCCAuthModel
   */
  bmPassword: string;
};

export default SFCCAuthModel;