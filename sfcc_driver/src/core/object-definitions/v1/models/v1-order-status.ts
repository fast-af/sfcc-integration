/**
 * - ORDER_STATUS_UNSPECIFIED: Order and Cart share the same data model, this status means that Order is in Cart status this status will be populated on all Fast Carts
 * @export
 * @enum {string}
 */
export enum V1OrderStatus {
  UNSPECIFIED = "ORDER_STATUS_UNSPECIFIED",
  CART = "ORDER_STATUS_CART",
  PENDING = "ORDER_STATUS_PENDING",
  HOLD = "ORDER_STATUS_HOLD",
  BOOKED = "ORDER_STATUS_BOOKED",
  PENDINGFULFILLMENT = "ORDER_STATUS_PENDING_FULFILLMENT",
  FULFILLED = "ORDER_STATUS_FULFILLED",
  COMPLETE = "ORDER_STATUS_COMPLETE",
  CANCELED = "ORDER_STATUS_CANCELED",
  DELETED = "ORDER_STATUS_DELETED",
}
