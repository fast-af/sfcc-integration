import { Externalmodelv1DeviceInfo } from "./externalmodelv1-device-info";
import { V1OrderAddress } from "./v1-order-address";
import { V1OrderCustomValue } from "./v1-order-custom-value";
import { V1OrderDiscount } from "./v1-order-discount";
import { V1OrderLine } from "./v1-order-line";
import { V1OrderRefund } from "./v1-order-refund";
import { V1OrderShipmentPlan } from "./v1-order-shipment-plan";
import { V1OrderStatus } from "./v1-order-status";
import { V1OrderType } from "./v1-order-type";
import { V1UUID } from "./v1-uuid";

/**
 *
 * @export
 * @interface V1FastOrder
 */
export interface V1FastOrder {
  /**
   *
   * @type {V1UUID}
   * @memberof V1FastOrder
   */
  id?: V1UUID;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  externalId?: string;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  userId?: string;
  /**
   *
   * @type {V1OrderType}
   * @memberof V1FastOrder
   */
  orderType?: V1OrderType;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  currencyCode?: string;
  /**
   *
   * @type {V1OrderStatus}
   * @memberof V1FastOrder
   */
  status?: V1OrderStatus;
  /**
   *
   * @type {V1OrderAddress}
   * @memberof V1FastOrder
   */
  billTo?: V1OrderAddress;
  /**
   *
   * @type {Array&lt;V1OrderLine&gt;}
   * @memberof V1FastOrder
   */
  lines?: V1OrderLine[];
  /**
   *
   * @type {Array&lt;V1OrderShipmentPlan&gt;}
   * @memberof V1FastOrder
   */
  shipmentPlans?: V1OrderShipmentPlan[];
  /**
   *
   * @type {Array&lt;V1OrderDiscount&gt;}
   * @memberof V1FastOrder
   */
  coupons?: V1OrderDiscount[];
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  totalAmount?: string;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  subTotal?: string;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  totalDiscounts?: string;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  totalTax?: string;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  totalShipping?: string;
  /**
   *
   * @type {Array&lt;V1OrderRefund&gt;}
   * @memberof V1FastOrder
   */
  refunds?: V1OrderRefund[];
  /**
   *
   * @type {Array&lt;V1OrderCustomValue&gt;}
   * @memberof V1FastOrder
   */
  customValues?: V1OrderCustomValue[];
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  userNote?: string;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  storeNote?: string;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  fastNote?: string;
  /**
   *
   * @type {Externalmodelv1DeviceInfo}
   * @memberof V1FastOrder
   */
  deviceInfo?: Externalmodelv1DeviceInfo;
  /**
   *
   * @type {string}
   * @memberof V1FastOrder
   */
  shortOrderId?: string;
}
