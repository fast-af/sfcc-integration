import { V1Adjuster } from "./v1-adjuster";
import { V1PurchaseStatus } from "./v1-purchase-status";

/**
 *
 * @export
 * @interface V1Adjusters
 */
export interface V1Adjusters {
  /**
   *
   * @type {V1Adjuster}
   * @memberof V1Adjusters
   */
  price?: V1Adjuster;
  /**
   *
   * @type {V1Adjuster}
   * @memberof V1Adjusters
   */
  weight?: V1Adjuster;
  /**
   *
   * @type {string}
   * @memberof V1Adjusters
   */
  imageUrl?: string;
  /**
   *
   * @type {V1PurchaseStatus}
   * @memberof V1Adjusters
   */
  purchasingDisabled?: V1PurchaseStatus;
};
