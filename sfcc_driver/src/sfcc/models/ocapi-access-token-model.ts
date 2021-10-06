/**
 * SFCC Access token model.
 * 
 * @export
 * @type SFCCAccessToken
 */
type SFCCAccessToken = {
  /**
   *
   * @type {string}
   * @memberof SFCCAccessToken
   */
  access_token: string;

  /**
   * 
   * @type {number}
   * @memberof SFCCAccessToken
   */
  expires_in: number;

  /**
   * 
   * @type {string}
   * @memberof SFCCAccessToken
   */
  token_type: string;
};

export default SFCCAccessToken;