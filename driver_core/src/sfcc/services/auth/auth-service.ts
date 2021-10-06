import http from 'axios';
import qs from 'qs';
import SFCCAccessToken from '../../models/ocapi-access-token-model';
import SFCCAuthModel from '../../models/ocapi-auth-model';

/**
 * A service class to communicate with the OCAPI
 * oauth endpoint.
 */
export default class AuthService {
  /**
   * Private members
   */
  private auth: SFCCAuthModel = {
    host: process.env.SFCC_OCAPI_HOST || '',
    clientId: process.env.SFCC_OCAPI_CLIENT_ID || '',
    clientPassword: process.env.SFCC_OCAPI_CLIENT_PASSWORD || '',
    bmUsername: process.env.SFCC_OCAPI_BM_USERNAME || '',
    bmPassword: process.env.SFCC_OCAPI_BM_PASSWORD || ''
  };

  /**
   * Constructor.
   * 
   * @param authParam {SFCCAuthModel} - the SFCC OCAPI parameters.
   */
  constructor(authParam?: SFCCAuthModel) {
    // If the authParam has been defined, assign value.
    if (authParam !== undefined) {
      this.auth = authParam;
    };
  };

  /**
   * Get the access token from the OCAPI.
   * 
   * @returns {SFCCAccessToken} the SFCC OCAPI access token.
   */
  public async getAccessToken(): Promise<SFCCAccessToken>  {
    const { data } = await http.post(`https://${this.auth.host}${process.env.SFCC_OCAPI_OAUTH_API || '/dw/oauth2/access_token?client_id='}${this.auth.clientId}`, 
      qs.stringify({ grant_type: process.env.SFCC_OCAPI_GRANT_TYPE }), {
        auth: {
          username: this.auth.bmUsername,
          password: `${this.auth.bmPassword}:${this.auth.clientPassword}`
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      });
    return data;
  };
};