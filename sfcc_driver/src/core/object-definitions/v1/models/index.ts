// Not required as this is similar to Externalmodelv1DeviceInfo
//-export * from './apiblender-corev1-device-info';
export * from './externalmodelv1-device-info';

//export * from './protobuf-any';
//export * from './rpc-status';
export * from './type-money';
export * from './v1-adjuster';
export * from './v1-adjusters';
export * from './v1-availability';
export * from './v1-cart-to-order-convert';
export * from './v1-category';
export * from './v1-condition';
export * from './v1-coupon-update';
export * from './v1-create-request';
export * from './v1-create-request-segment';
export * from './v1-create-response';
//-export * from './v1-create-response-segment';

// New - Normalized to a single interface from
// V1ReadOrderResponseSegment, V1CreateResponseSegment
export * from './v1-order-response-segment';

//-export * from './v1-create-user-request-segment';
//-export * from './v1-create-user-response-segment';
//-export * from './v1-create-webhook-request-segment';
//-export * from './v1-create-webhook-response-segment';

export * from './v1-custom-url';
export * from './v1-delete-order-request-segment';
export * from './v1-delete-order-response-segment';
export * from './v1-delete-request';
export * from './v1-delete-response';

//-export * from './v1-delete-webhook-request-segment';
//-export * from './v1-delete-webhook-response-segment';

export * from './v1-dimension';
export * from './v1-discount-origin';
export * from './v1-discount-type';
export * from './v1-entity-type';
export * from './v1-fast-order';
export * from './v1-item-fulfillment-mode';
export * from './v1-modifier-option-value';
export * from './v1-modifier-type';
export * from './v1-option-value';

// New - Option value map to hold the key-value of V1OptionValue.
export * from './v1-option-value-map';

export * from './v1-order-address';
export * from './v1-order-custom-value';
export * from './v1-order-discount';
export * from './v1-order-item-update';
export * from './v1-order-line';
export * from './v1-order-line-reference';
export * from './v1-order-refund';
export * from './v1-order-shipment-plan';
export * from './v1-order-status';
export * from './v1-order-type';

// New - Option value map to hold the key-value of TypeMoney.
export * from './v1-price-range-map';

export * from './v1-product';
export * from './v1-product-image';
export * from './v1-product-modifier';
export * from './v1-product-type';
export * from './v1-purchase-status';
export * from './v1-rate-limit';
export * from './v1-read-categories-request-segment';
export * from './v1-read-categories-response-segment';
export * from './v1-read-category-request-segment';
export * from './v1-read-category-response-segment';
export * from './v1-read-order-request-segment';
//-export * from './v1-read-order-response-segment';
export * from './v1-read-orders-request-segment';
export * from './v1-read-orders-response-segment';
export * from './v1-read-product-request-segment';
export * from './v1-read-product-response-segment';
export * from './v1-read-products-request-segment';
export * from './v1-read-products-response-segment';
export * from './v1-read-request';
export * from './v1-read-response';

//-export * from './v1-read-shipping-option-request-segment';
//-export * from './v1-read-shipping-option-response-segment';

// New - Normalized to a single interface from
// V1ReadShippingOptionRequestSegment, V1ReadShippingOptionResponseSegment.
export * from './v1-read-shipping-option-segment';

export * from './v1-read-shipping-zones-request-segment';
export * from './v1-read-shipping-zones-response-segment';
export * from './v1-read-user-request-segment';
//-export * from './v1-read-user-response-segment';
export * from './v1-shipment';
export * from './v1-shipment-plan-update';
export * from './v1-shipping-option';
export * from './v1-shipping-option-type';
export * from './v1-shipping-option-update';
export * from './v1-shipping-zone';
export * from './v1-sub-resource';
export * from './v1-uuid';
export * from './v1-update-order-request-segment';
export * from './v1-update-order-response-segment';
export * from './v1-update-order-segment-status';
export * from './v1-update-order-segment-type';
export * from './v1-update-request';
export * from './v1-update-response';
export * from './v1-user';

// New - Normalized to a single interface from
// V1ReadUserResponseSegment, V1CreateUserRequestSegment,
// V1CreateUserResponseSegment.
export * from './v1-user-segment';

export * from './v1-user-update';
export * from './v1-value-data';
export * from './v1-variant';

// New - Normalized to a single interface from
// V1CreateWebhookRequestSegment, V1CreateWebhookResponseSegment,
// V1DeleteWebhookRequestSegment, V1DeleteWebhookResponseSegment
export * from './v1-webhook-segment';

export * from './v1-webhook';
export * from './v1-webhook-scope';
