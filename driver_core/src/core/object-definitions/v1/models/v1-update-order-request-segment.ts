import { V1UUID } from "./v1-uuid";
import { V1CartToOrderConvert } from "./v1-cart-to-order-convert";
import { V1OrderStatus } from "./v1-order-status";
import { V1OrderAddress } from "./v1-order-address";
import { V1OrderItemUpdate } from "./v1-order-item-update";
import { V1CouponUpdate } from "./v1-coupon-update";
import { V1ShippingOptionUpdate } from "./v1-shipping-option-update";
import { V1ShipmentPlanUpdate } from "./v1-shipment-plan-update";
import { V1UpdateOrderSegmentType } from "./v1-update-order-segment-type";
import { V1UserUpdate } from "./v1-user-update";
import { Externalmodelv1DeviceInfo } from "./externalmodelv1-device-info";

/**
 *
 * @export
 * @interface V1UpdateOrderRequestSegment
 */
export interface V1UpdateOrderRequestSegment {
  /**
   *
   * @type {V1UUID}
   * @memberof V1UpdateOrderRequestSegment
   */
  orderId?: V1UUID;
  /**
   *
   * @type {boolean}
   * @memberof V1UpdateOrderRequestSegment
   */
  isCart?: boolean;
  /**
   *
   * @type {V1CartToOrderConvert}
   * @memberof V1UpdateOrderRequestSegment
   */
  convertMode?: V1CartToOrderConvert;
  /**
   *
   * @type {boolean}
   * @memberof V1UpdateOrderRequestSegment
   */
  convertCartToOrder?: boolean;
  /**
   *
   * @type {V1OrderStatus}
   * @memberof V1UpdateOrderRequestSegment
   */
  status?: V1OrderStatus;
  /**
   *
   * @type {V1OrderAddress}
   * @memberof V1UpdateOrderRequestSegment
   */
  billTo?: V1OrderAddress;
  /**
   *
   * @type {Array&lt;V1OrderItemUpdate&gt;}
   * @memberof V1UpdateOrderRequestSegment
   */
  items?: V1OrderItemUpdate[];
  /**
   *
   * @type {V1CouponUpdate}
   * @memberof V1UpdateOrderRequestSegment
   */
  coupon?: V1CouponUpdate;
  /**
   *
   * @type {V1ShippingOptionUpdate}
   * @memberof V1UpdateOrderRequestSegment
   */
  shippingOption?: V1ShippingOptionUpdate;
  /**
   *
   * @type {Array&lt;V1ShipmentPlanUpdate&gt;}
   * @memberof V1UpdateOrderRequestSegment
   */
  shipments?: V1ShipmentPlanUpdate[];
  /**
   *
   * @type {Array&lt;V1UpdateOrderSegmentType&gt;}
   * @memberof V1UpdateOrderRequestSegment
   */
  updatedSegments?: V1UpdateOrderSegmentType[];
  /**
   *
   * @type {V1UserUpdate}
   * @memberof V1UpdateOrderRequestSegment
   */
  userInfo?: V1UserUpdate;
  /**
   *
   * @type {string}
   * @memberof V1UpdateOrderRequestSegment
   */
  externalId?: string;
  /**
   *
   * @type {Externalmodelv1DeviceInfo}
   * @memberof V1UpdateOrderRequestSegment
   */
  deviceInfo?: Externalmodelv1DeviceInfo;
};
