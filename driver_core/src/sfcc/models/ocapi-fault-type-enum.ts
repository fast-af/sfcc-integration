// SFCC OCAPI - Fault Type enum.
enum OCAPIFaultType {
  // Common authorization exceptions.
  INVALID_AUTHORIZATION_HEADER = "InvalidAuthorizationHeaderException",
  INVALID_ACCESS_TOKEN = "InvalidAccessTokenException",
  MISSING_CLIENT_ID = "MissingClientIdException",
  CONNECTION_REFUSED = "ECONNREFUSED",

  // Other common exceptions.
  METHOD_NOT_ALLOWED = "MethodNotAllowedException",
  RESOURCE_STATE_CONFLICT = "ResourceStateConflictException",
  UNKNOWN_PROPERTY = "UnknownPropertyException",
  HOOK_INTERNAL_SERVER_ERROR = "HookInternalServerErrorException",
  CLIENT_ACCESS_FORBIDDEN = "ClientAccessForbiddenException",
  PROPERTY_VALUE_CONSTRAINT_VIOLATION = "PropertyConstraintViolationException",

  // POST /baskets exceptions.
  // PUT /baskets/{basketId}/customer exceptions.
  // POST /baskets/{basketId}/coupons exceptions.
  // POST /baskets/{basketId}/items exceptions.
  // PATCH /baskets/{basketId}/items/{itemId} exceptions.
  // PATCH /baskets/{basketId}/shipments/{shipmentId} exceptions.
  INVALID_PAYMENT_METHOD_ID = "InvalidPaymentMethodIdException",
  CUSTOMER_BASKETS_QUOTA_EXCEEDED = "CustomerBasketsQuotaExceededException",
  DUPLICATE_SHIPMENT_ID = "DuplicateShipmentIdException",
  MISSING_COUPON_CODE = "MissingCouponCodeException",
  INVALID_PRICE_ADJUSTMENT_LEVEL = "InvalidPriceAdjustmentLevelException",
  INVALID_PROMOTION_ID = "InvalidPromotionIdException",
  SYSTEM_PROMOTION_ID = "SystemPromotionIdException",
  TOO_MANY_PROMOTIONS = "TooManyPromotionsException",
  SHIPMENT_NOT_FOUND = "ShipmentNotFoundException",

  // PATCH /baskets/{basketId} exceptions.
  UNSUPPORTED_CURRENCY = "UnsupportedCurrencyException",
  INVALID_SHIPPING_ITEM_ID = "InvalidShippingItemIdException",
  DUPLICATE_SHIPPING_ITEM_ID = "DuplicateShippingItemIdException",
  SOURCE_CODE_INACTIVE = "SourceCodeInactiveException",
  SHIPPING_ITEM_NOT_FOUND = "ShippingItemNotFoundException",
  SOURCE_CODE_NOT_FOUND = "SourceCodeNotFoundException",

  // GET /baskets/{basketId} exceptions.
  // DELETE /baskets/{basketId} exceptions.
  // PUT /baskets/{basketId}/customer exceptions.
  // PATCH /baskets/{basketId} exceptions.
  // POST /baskets/{basketId}/coupons exceptions.
  // DELETE /baskets/{basketId}/coupons/{couponItemId} exceptions.
  // POST /baskets/{basketId}/items exceptions.
  // PATCH /baskets/{basketId}/items/{itemId} exceptions.
  // PUT /baskets/{basketId}/shipments/{shipmentId}/shipping_method exceptions.
  // PATCH /baskets/{basketId}/shipments/{shipmentId} exceptions.
  // POST /orders exceptions.
  BASKET_NOT_FOUND = "BasketNotFoundException",

  // GET /customers/{customerId} exceptions.
  // PUT /baskets/{basketId}/customer exceptions.
  CUSTOMER_NOT_FOUND = "CustomerNotFoundException",

  // GET /orders/{orderId} exceptions.
  ORDER_NOT_FOUND = "OrderNotFoundException",

  // GET /products/{productId}/images exceptions.
  PRODUCT_NOT_FOUND = "ProductNotFoundException",

  // DELETE /baskets/{basketId}/coupons/{couponItemId} exceptions.
  COUPON_ITEM_NOT_FOUND = "CouponItemNotFoundException",

  // POST /baskets/{basketId}/coupons exceptions.
  INVALID_COUPON_CODE = "InvalidCouponCodeException",

  // POST /baskets/{basketId}/items exceptions.
  // PATCH /baskets/{basketId}/items/{itemId} exceptions.
  // DELETE /baskets/{basketId}/items/{itemId} exceptions.
  // POST /orders exceptions.
  INVALID_PRODUCT_ID = "InvalidProductIdException",
  INVALID_PRODUCT_ITEM = "InvalidProductItemException",
  INVALID_PRODUCT_ITEM_QUANTITY = "InvalidProductItemQuantityException",
  PRODUCT_ITEM_NOT_AVAILABLE = "ProductItemNotAvailableException",
  INVALID_PRODUCT_TYPE = "InvalidProductTypeException",
  INVALID_PRODUCT_OPTION_ITEM = "InvalidProductOptionItemException",
  INVALID_PRODUCT_OPTION_VALUE_ITEM = "InvalidProductOptionValueItemException",
  BASKET_QUOTA_EXCEEDED = "BasketQuotaExceededException",
  BONUS_DISCOUNT_LINE_ITEM_NOT_FOUND = "BonusDiscountLineItemNotFoundException",
  BONUS_PRODUCT_QUANTITY = "BonusProductQuantityException",
  INVALID_BONUS_PRODUCT = "InvalidBonusProductException",

  // PATCH /baskets/{basketId}/items/{itemId} exceptions.
  // PATCH /baskets/{basketId}/shipments/{shipmentId} exceptions.
  INVALID_PRODUCT_ITEM_ID = "InvalidProductItemIdException",
  INVALID_SHIPMENT_ID = "InvalidShipmentIdException",

  // PUT /baskets/{basketId}/shipments/{shipmentId}/shipping_method exceptions.
  // PATCH /baskets/{basketId}/shipments/{shipmentId} exceptions.
  MISSING_SHIPPING_METHOD_ID = "MissingShippingMethodIdException",
  INVALID_SHIPPING_METHOD_ID = "InvalidShippingMethodIdException",

  // PATCH /baskets/{basketId}/shipments/{shipmentId} exceptions.
  DUPLICATE_SHIPMENT_NO = "DuplicateShipmentNoException",

  // POST /orders exceptions.
  GIFT_CERTIFICATE_CREATION = "GiftCertificateCreationException",
  INVALID_BASKET_ID = "InvalidBasketIdException",
  VALIDATION = "ValidationException",
};

export { OCAPIFaultType };
