import { TypeMoney } from "./type-money";

/**
 *
 * @export
 * @interface V1User
 */
export interface V1User {
  /**
   * Unique identifier from the commerce platform apart from email address.
   * This is only  for the registered user.
   *
   * @type {string}
   * @memberof V1User
   */
  externalUserId?: string;
  /**
   * Email address as passed-in and recognized by the commerce platform
   * for registered user.
   * In case of a user not recognized, this is going to be new and a
   * guest user.
   *
   * @type {string}
   * @memberof V1User
   */
  email?: string;
  /**
   * First name of the user.
   *
   * @type {string}
   * @memberof V1User
   */
  firstName?: string;
  /**
   * Last name of the user.
   *
   * @type {string}
   * @memberof V1User
   */
  lastName?: string;
  /**
   * Phone number of the user.
   *
   * @type {string}
   * @memberof V1User
   */
  phone?: string;
  /**
   * Any awarded store credits.  This is only populated if the
   * commerce platform provides the functionality and has it
   * stored against the user, or exposes an API endpoint to
   * lookup and fetch the data.
   *
   * @type {TypeMoney}
   * @memberof V1User
   */
  storeCredit?: TypeMoney;
}
