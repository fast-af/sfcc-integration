import {
  arrayItemsEnclosing,
  unionMembersEnclosing,
  objectEnclosing,
  referenceEnclosing,
} from "./../common/function-utils";

/**
 * Common objects.
 */
// Device info type.
const deviceInfo = objectEnclosing([
  { json: "ip_address", js: "ipAddress", typ: unionMembersEnclosing(undefined, ""), },
], false);
// String type.
const stringType = ["string"];
// TypeMoney type.
const typeMoney = objectEnclosing([
  { json: "currency_code", js: "currencyCode", typ: unionMembersEnclosing(undefined, ""), },
  { json: "units", js: "units", typ: unionMembersEnclosing(undefined, ""), },
  { json: "nanos", js: "nanos", typ: unionMembersEnclosing(undefined, 0), },
], false);
// V1Adjuster type.
const v1Adjuster = objectEnclosing([
  { json: "adjuster", js: "adjuster", typ: unionMembersEnclosing(undefined, ""), },
  { json: "adjuster_value", js: "adjusterValue", typ: unionMembersEnclosing(undefined, 0), },
], false);
// V1Adjusters type.
const v1Adjusters = objectEnclosing([
  { json: "price", js: "price", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Adjuster")), },
  { json: "weight", js: "weight", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Adjuster")), },
  { json: "image_url", js: "imageUrl", typ: unionMembersEnclosing(undefined, ""), },
  { json: "purchasing_disabled", js: "purchasingDisabled", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1PurchaseStatus")), },
], false);
// V1Availability - enum.
const v1Availability = [
  "AVAILABILITY_UNSPECIFIED",
  "AVAILABILITY_AVAILABLE",
  "AVAILABILITY_DISABLED",
  "AVAILABILITY_PREORDER",
];
// V1CartToOrderConvert - enum.
const v1CartToOrderConvert = [
  "CART_TO_ORDER_CONVERT_UNSPECIFIED",
  "CART_TO_ORDER_CONVERT_ONLY",
  "CART_TO_ORDER_CONVERT_UPDATE_AND_CONVERT",
];
// V1Category type.
const v1Category = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "description", js: "description", typ: unionMembersEnclosing(undefined, ""), },
  { json: "name", js: "name", typ: unionMembersEnclosing(undefined, ""), },
  { json: "meta_keywords", js: "metaKeywords", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing("")), },
  { json: "default_product_sort", js: "defaultProductSort", typ: unionMembersEnclosing(undefined, ""), },
  { json: "image_url", js: "imageUrl", typ: unionMembersEnclosing(undefined, ""), },
  { json: "is_visible", js: "isVisible", typ: unionMembersEnclosing(undefined, true), },
  { json: "layout_file", js: "layoutFile", typ: unionMembersEnclosing(undefined, ""), },
  { json: "meta_description", js: "metaDescription", typ: unionMembersEnclosing(undefined, ""), },
  { json: "page_title", js: "pageTitle", typ: unionMembersEnclosing(undefined, ""), },
  { json: "parent_id", js: "parentId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "search_keywords", js: "searchKeywords", typ: unionMembersEnclosing(undefined, ""), },
  { json: "sort_order", js: "sortOrder", typ: unionMembersEnclosing(undefined, 0), },
  { json: "views", js: "views", typ: unionMembersEnclosing(undefined, 0), },
  { json: "custom_url", js: "customUrl", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1CustomURL")), },
], false);
// V1Condition - enum.
const v1Condition = [
  "CONDITION_UNSPECIFIED",
  "CONDITION_NEW",
  "CONDITION_USED",
  "CONDITION_REFURBISHED",
];
// V1CustomURL type.
const v1CustomUrl = objectEnclosing([
  { json: "is_customized", js: "isCustomized", typ: unionMembersEnclosing(undefined, true), },
  { json: "url", js: "url", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1Dimension type.
const v1Dimension = objectEnclosing([
  { json: "height", js: "height", typ: unionMembersEnclosing(undefined, 0), },
  { json: "width", js: "width", typ: unionMembersEnclosing(undefined, 0), },
  { json: "weight", js: "weight", typ: unionMembersEnclosing(undefined, 0), },
], false);
// V1DiscountOrigin - enum.
const v1DiscountOrigin = [
  "DISCOUNT_ORIGIN_UNSPECIFIED",
  "DISCOUNT_ORIGIN_USER",
  "DISCOUNT_ORIGIN_FAST",
  "DISCOUNT_ORIGIN_VENDOR",
];
// V1DiscountType - enum.
const v1DiscountType = [
  "DISCOUNT_TYPE_UNSPECIFIED",
  "DISCOUNT_TYPE_MISC",
  "DISCOUNT_TYPE_REGULAR",
  "DISCOUNT_TYPE_SHIPPING",
  "DISCOUNT_TYPE_HANDLING",
  "DISCOUNT_TYPE_WRAPPING",
];
// V1EmptySegment type.
const v1EmptySegment = objectEnclosing([], false);
// V1EntityType - enum.
const v1EntityType = [
  "ENTITY_TYPE_UNSPECIFIED",
  "ENTITY_TYPE_ORDER",
  "ENTITY_TYPE_SHIPPING_OPTION",
  "ENTITY_TYPE_USER",
  "ENTITY_TYPE_SHIPPING_ZONES",
  "ENTITY_TYPE_CATALOG_PRODUCT",
  "ENTITY_TYPE_WEBHOOK",
  "ENTITY_TYPE_ORDER_SYNC",
  "ENTITY_TYPE_CATALOG_CATEGORY",
];
// V1FastOrder type.
const v1FastOrder = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
  { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "user_id", js: "userId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "order_type", js: "orderType", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderType")), },
  { json: "currency_code", js: "currencyCode", typ: unionMembersEnclosing(undefined, ""), },
  { json: "status", js: "status", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderStatus")), },
  { json: "bill_to", js: "billTo", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderAddress")), },
  { json: "lines", js: "lines", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderLine"))), },
  { json: "shipment_plans", js: "shipmentPlans", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderShipmentPlan"))), },
  { json: "coupons", js: "coupons", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderDiscount"))), },
  { json: "total_amount", js: "totalAmount", typ: unionMembersEnclosing(undefined, ""), },
  { json: "sub_total", js: "subTotal", typ: unionMembersEnclosing(undefined, ""), },
  { json: "total_discounts", js: "totalDiscounts", typ: unionMembersEnclosing(undefined, ""), },
  { json: "total_tax", js: "totalTax", typ: unionMembersEnclosing(undefined, ""), },
  { json: "total_shipping", js: "totalShipping", typ: unionMembersEnclosing(undefined, ""), },
  { json: "refunds", js: "refunds", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderRefund"))), },
  { json: "custom_values", js: "customValues", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderCustomValue"))), },
  { json: "user_note", js: "userNote", typ: unionMembersEnclosing(undefined, ""), },
  { json: "store_note", js: "storeNote", typ: unionMembersEnclosing(undefined, ""), },
  { json: "fast_note", js: "fastNote", typ: unionMembersEnclosing(undefined, ""), },
  { json: "device_info", js: "deviceInfo", typ: unionMembersEnclosing(undefined, referenceEnclosing("Externalmodelv1DeviceInfo")), },
  { json: "short_order_id", js: "shortOrderId", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1ItemFulfillmentMode - enum.
const v1ItemFulfillmentMode = [
  "ITEM_FULFILLMENT_MODEL_UNSPECIFIED",
  "ITEM_FULFILLMENT_MODEL_PHYSICAL",
  "ITEM_FULFILLMENT_MODEL_DIGITAL",
  "ITEM_FULFILLMENT_MODEL_SERVICE",
];
// V1ModifierOptionValue type.
const v1ModifierOptionValue = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "option_id", js: "optionId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "label", js: "label", typ: unionMembersEnclosing(undefined, ""), },
  { json: "is_default", js: "isDefault", typ: unionMembersEnclosing(undefined, true), },
  { json: "sort_order", js: "sortOrder", typ: unionMembersEnclosing(undefined, 0), },
  { json: "adjusters", js: "adjusters", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Adjusters")), },
  { json: "value_data", js: "valueData", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ValueData")), },
], false);
// V1ModifierType - enum.
const v1ModifierType = [
  "MODIFIER_TYPE_UNSPECIFIED",
  "MODIFIER_TYPE_DATE",
  "MODIFIER_TYPE_CHECKBOX",
  "MODIFIER_TYPE_FILE",
  "MODIFIER_TYPE_TEXT",
  "MODIFIER_TYPE_MULTI_LINE_TEXT",
  "MODIFIER_TYPE_NUMBERS_ONLY_TEXT",
  "MODIFIER_TYPE_RADIO_BUTTONS",
  "MODIFIER_TYPE_RECTANGLES",
  "MODIFIER_TYPE_DROPDOWN",
  "MODIFIER_TYPE_PRODUCT_LIST",
  "MODIFIER_TYPE_PRODUCT_LIST_WITH_IMAGES",
  "MODIFIER_TYPE_SWATCH",
];
// V1OptionValue type.
const v1OptionValue = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "option_id", js: "optionId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "label", js: "label", typ: unionMembersEnclosing(undefined, ""), },
  { json: "option_display_name", js: "optionDisplayName", typ: unionMembersEnclosing(undefined, ""), },
  { json: "value_data", js: "valueData", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ValueData")), },
], false);
// V1OptionValueMap type.
const v1OptionValueMap = objectEnclosing([
  { json: "additionalProperties", js: "additionalProperties", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OptionValue")), },
], false);
// V1OrderAddress type.
const v1OrderAddress = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
  { json: "first_name", js: "firstName", typ: unionMembersEnclosing(undefined, ""), },
  { json: "last_name", js: "lastName", typ: unionMembersEnclosing(undefined, ""), },
  { json: "middle_name", js: "middleName", typ: unionMembersEnclosing(undefined, ""), },
  { json: "company", js: "company",typ: unionMembersEnclosing(undefined, ""), },
  { json: "email", js: "email", typ: unionMembersEnclosing(undefined, ""), },
  { json: "phone", js: "phone", typ: unionMembersEnclosing(undefined, ""), },
  { json: "address_1", js: "address1", typ: unionMembersEnclosing(undefined, ""), },
  { json: "address_2", js: "address2", typ: unionMembersEnclosing(undefined, ""), },
  { json: "city_locality", js: "cityLocality", typ: unionMembersEnclosing(undefined, ""), },
  { json: "state_province", js: "stateProvince", typ: unionMembersEnclosing(undefined, ""), },
  { json: "state_province_code", js: "stateProvinceCode", typ: unionMembersEnclosing(undefined, ""), },
  { json: "country", js: "country", typ: unionMembersEnclosing(undefined, ""), },
  { json: "country_code", js: "countryCode", typ: unionMembersEnclosing(undefined, ""), },
  { json: "postal_code", js: "postalCode", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1OrderCustomValue type.
const v1OrderCustomValue = objectEnclosing([
  { json: "key", js: "key", typ: unionMembersEnclosing(undefined, "") },
  { json: "value", js: "value", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1OrderDiscount type.
const v1OrderDiscount = objectEnclosing([
  { json: "code", js: "code", typ: unionMembersEnclosing(undefined, ""), },
  { json: "description", js: "description", typ: unionMembersEnclosing(undefined, ""), },
  { json: "origin", js: "origin", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1DiscountOrigin")), },
  { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1DiscountType")), },
  { json: "applied", js: "applied", typ: unionMembersEnclosing(undefined, true), },
  { json: "total_amount", js: "totalAmount", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1OrderLine type.
const v1OrderLine = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
  { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "external_product_id", js: "externalProductId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "external_variant_id", js: "externalVariantId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "external_options", js: "externalOptions", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderCustomValue"))), },
  { json: "customizations", js: "customizations", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderCustomValue"))), },
  { json: "quantity", js: "quantity", typ: unionMembersEnclosing(undefined, 0), },
  { json: "quantity_fulfilled", js: "quantityFulfilled", typ: unionMembersEnclosing(undefined, 0), },
  { json: "unit_price", js: "unitPrice", typ: unionMembersEnclosing(undefined, ""), },
  { json: "discounted_unit_price", js: "discountedUnitPrice", typ: unionMembersEnclosing(undefined, ""), },
  { json: "line_discount_amount", js: "lineDiscountAmount", typ: unionMembersEnclosing(undefined, ""), },
  { json: "subtotal_amount", js: "subtotalAmount", typ: unionMembersEnclosing(undefined, ""), },
  { json: "tax_amount", js: "taxAmount", typ: unionMembersEnclosing(undefined, ""), },
  { json: "total_amount", js: "totalAmount", typ: unionMembersEnclosing(undefined, ""), },
  { json: "discounts", js: "discounts", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderDiscount"))), },
  { json: "name", js: "name", typ: unionMembersEnclosing(undefined, ""), },
  { json: "description", js: "description", typ: unionMembersEnclosing(undefined, ""), },
  { json: "image_url", js: "imageUrl", typ: unionMembersEnclosing(undefined, ""), },
  { json: "fulfillment_mode", js: "fulfillmentMode", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ItemFulfillmentMode")), },
], false);
// V1OrderLineReference type.
const v1OrderLineReference = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
  { json: "quantity", js: "quantity", typ: unionMembersEnclosing(undefined, 0), },
  { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1OrderRefund type.
const v1OrderRefund = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
  { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "reason", js: "reason", typ: unionMembersEnclosing(undefined, ""), },
  { json: "use_original_method", js: "useOriginalMethod", typ: unionMembersEnclosing(undefined, true), },
  { json: "lines", js: "lines", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderLineReference"))), },
  { json: "refund_date", js: "refundDate", typ: unionMembersEnclosing(undefined, ""), },
  { json: "amount", js: "amount", typ: unionMembersEnclosing(undefined, ""), },
  { json: "tax", js: "tax", typ: unionMembersEnclosing(undefined, ""), },
  { json: "shipping", js: "shipping", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1OrderResponseSegment type.
const v1OrderResponseSegment = objectEnclosing([
  { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1FastOrder")), },
], false);
// V1OrderShipmentPlan type.
const v1OrderShipmentPlan = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
  { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "ship_to", js: "shipTo", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderAddress")), },
  { json: "lines", js: "lines", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderLineReference"))), },
  { json: "selected_option", js: "selectedOption", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ShippingOption")), },
  { json: "available_options", js: "availableOptions", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ShippingOption"))), },
  { json: "shipments", js: "shipments", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1Shipment"))), },
], false);
// V1OrderStatus - enum.
const v1OrderStatus = [
  "ORDER_STATUS_UNSPECIFIED",
  "ORDER_STATUS_CART",
  "ORDER_STATUS_PENDING",
  "ORDER_STATUS_HOLD",
  "ORDER_STATUS_BOOKED",
  "ORDER_STATUS_PENDING_FULFILLMENT",
  "ORDER_STATUS_FULFILLED",
  "ORDER_STATUS_COMPLETE",
  "ORDER_STATUS_CANCELED",
  "ORDER_STATUS_DELETED",
];
// V1OrderType - enum.
const v1OrderType = [
  "ORDER_TYPE_UNSPECIFIED",
  "ORDER_TYPE_CART",
  "ORDER_TYPE_ORDER",
  "ORDER_TYPE_RETURN",
  "ORDER_TYPE_EXCHANGE",
  "ORDER_TYPE_CREDIT",
  "ORDER_TYPE_REFUND",
];
// V1PriceRangeMap type.
const v1PriceRangeMap = objectEnclosing([
  { json: "additionalProperties", js: "additionalProperties", typ: unionMembersEnclosing(undefined, referenceEnclosing("TypeMoney")), },
], false);
// V1Product type.
const v1Product = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "sku", js: "sku", typ: unionMembersEnclosing(undefined, ""), },
  { json: "availability", js: "availability", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Availability")), },
  { json: "availability_description", js: "availabilityDescription", typ: unionMembersEnclosing(undefined, ""), },
  { json: "is_visible", js: "isVisible", typ: unionMembersEnclosing(undefined, true), },
  { json: "bin_picking_number", js: "binPickingNumber", typ: unionMembersEnclosing(undefined, ""), },
  { json: "brand_id", js: "brandId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "categories", js: "categories", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(0)), },
  { json: "condition", js: "condition", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Condition")), },
  { json: "custom_url", js: "customUrl", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1CustomURL")), },
  { json: "display_price", js: "displayPrice", typ: unionMembersEnclosing(undefined, referenceEnclosing("TypeMoney")), },
  { json: "fixed_cost_shipping_price", js: "fixedCostShippingPrice", typ: unionMembersEnclosing(undefined, referenceEnclosing("TypeMoney")), },
  { json: "is_free_shipping", js: "isFreeShipping", typ: unionMembersEnclosing(undefined, true), },
  { json: "name", js: "name", typ: unionMembersEnclosing(undefined, "") },
  { json: "description", js: "description", typ: unionMembersEnclosing(undefined, ""), },
  { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ProductType")), },
  { json: "dimension", js: "dimension", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Dimension")), },
  { json: "inventory_level", js: "inventoryLevel", typ: unionMembersEnclosing(undefined, 0), },
  { json: "meta_keywords", js: "metaKeywords", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing("")), },
  { json: "search_keywords", js: "searchKeywords", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing("")), },
  { json: "related_products", js: "relatedProducts", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(0)), },
  { json: "reviews_count", js: "reviewsCount", typ: unionMembersEnclosing(undefined, 0), },
  { json: "reviews_rating_sum", js: "reviewsRatingSum", typ: unionMembersEnclosing(undefined, 0), },
  { json: "total_sold", js: "totalSold", typ: unionMembersEnclosing(undefined, ""), },
  { json: "view_count", js: "viewCount", typ: unionMembersEnclosing(undefined, ""), },
  { json: "primary_image", js: "primaryImage", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ProductImage")), },
  { json: "variants", js: "variants", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1Variant"))), },
  { json: "images", js: "images", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ProductImage"))), },
  { json: "modifiers", js: "modifiers", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ProductModifier"))), },
  { json: "date_created", js: "dateCreated", typ: unionMembersEnclosing(undefined, Date), },
  { json: "date_modified", js: "dateModified", typ: unionMembersEnclosing(undefined, Date), },
  { json: "inventory_tracking", js: "inventoryTracking", typ: unionMembersEnclosing(undefined, ""), },
  { json: "price_range", js: "priceRange", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1PriceRangeMap")), },
], false);
// V1ProductImage type.
const v1ProductImage = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "product_id", js: "productId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "description", js: "description", typ: unionMembersEnclosing(undefined, ""), },
  { json: "is_thumbnail", js: "isThumbnail", typ: unionMembersEnclosing(undefined, true), },
  { json: "sort_order", js: "sortOrder", typ: unionMembersEnclosing(undefined, 0), },
  { json: "image_file", js: "imageFile", typ: unionMembersEnclosing(undefined, ""), },
  { json: "url_standard", js: "urlStandard", typ: unionMembersEnclosing(undefined, ""), },
  { json: "url_thumbnail", js: "urlThumbnail", typ: unionMembersEnclosing(undefined, ""), },
  { json: "url_tiny", js: "urlTiny", typ: unionMembersEnclosing(undefined, ""), },
  { json: "url_zoom", js: "urlZoom", typ: unionMembersEnclosing(undefined, ""), },
  { json: "date_modified", js: "dateModified", typ: unionMembersEnclosing(undefined, Date), },
], false);
// V1ProductModifier type.
const v1ProductModifier = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "product_id", js: "productId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "name", js: "name", typ: unionMembersEnclosing(undefined, ""), },
  { json: "display_name", js: "displayName", typ: unionMembersEnclosing(undefined, ""), },
  { json: "sort_order", js: "sortOrder", typ: unionMembersEnclosing(undefined, 0), },
  { json: "required", js: "required", typ: unionMembersEnclosing(undefined, true), },
  { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ModifierType")), },
  { json: "option_values", js: "optionValues", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ModifierOptionValue"))), },
], false);
// V1ProductType type.
const v1ProductType = [
  "PRODUCT_TYPE_UNSPECIFIED",
  "PRODUCT_TYPE_PHYSICAL",
  "PRODUCT_TYPE_DIGITAL",
];
// V1PurchaseStatus type.
const v1PurchaseStatus = objectEnclosing([
  { json: "status", js: "status", typ: unionMembersEnclosing(undefined, true), },
  { json: "message", js: "message", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1RateLimit type.
const v1RateLimit = objectEnclosing([
  { json: "request_left", js: "requestLeft", typ: unionMembersEnclosing(undefined, 0), },
  { json: "request_quota", js: "requestQuota", typ: unionMembersEnclosing(undefined, 0), },
  { json: "time_reset_ms", js: "timeResetMs", typ: unionMembersEnclosing(undefined, 0), },
  { json: "time_window_ms", js: "timeWindowMs", typ: unionMembersEnclosing(undefined, 0), },
], false);
// V1Shipment type.
const v1Shipment = objectEnclosing([
  { json: "carrier", js: "carrier", typ: unionMembersEnclosing(undefined, ""), },
  { json: "tracking_number", js: "trackingNumber", typ: unionMembersEnclosing(undefined, ""), },
  { json: "estimated_delivery_date", js: "estimatedDeliveryDate", typ: unionMembersEnclosing(undefined, ""), },
  { json: "lines", js: "lines", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderLineReference"))), },
], false);
// V1ShippingOption type.
const v1ShippingOption = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
  { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "name", js: "name", typ: unionMembersEnclosing(undefined, ""), },
  { json: "shipment_type", js: "shipmentType", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ShippingOptionType")), },
  { json: "cost", js: "cost", typ: unionMembersEnclosing(undefined, ""), },
  { json: "tax", js: "tax", typ: unionMembersEnclosing(undefined, ""), },
  { json: "total", js: "total", typ: unionMembersEnclosing(undefined, ""), },
  { json: "carrier", js: "carrier", typ: unionMembersEnclosing(undefined, ""), },
  { json: "service_level", js: "serviceLevel", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1ShippingOptionType - enum.
const v1ShippingOptionType = [
  "SHIPPING_OPTION_TYPE_UNSPECIFIED",
  "SHIPPING_OPTION_TYPE_IN_STORE_PICKUP",
  "SHIPPING_OPTION_TYPE_OTHER",
];
// V1ShippingZone type.
const v1ShippingZone = objectEnclosing([
  { json: "country_iso2", js: "countryIso2", typ: unionMembersEnclosing(undefined, ""), },
  { json: "subdivision_iso2", js: "subdivisionIso2", typ: unionMembersEnclosing(undefined, ""), },
], false);
// V1SubResource - enum.
const v1SubResource = [
  "SUB_RESOURCE_UNSPECIFIED",
  "SUB_RESOURCE_VARIANTS",
  "SUB_RESOURCE_IMAGES",
  "SUB_RESOURCE_CUSTOM_FIELDS",
  "SUB_RESOURCE_BULK_PRICING_RULES",
  "SUB_RESOURCE_PRIMARY_IMAGE",
  "SUB_RESOURCE_MODIFIERS",
  "SUB_RESOURCE_OPTIONS",
  "SUB_RESOURCE_VIDEOS",
];
// V1UpdateOrderSegmentType - enum.
const v1UpdateOrderSegmentType = [
  "UPDATE_ORDER_SEGMENT_TYPE_UNSPECIFIED",
  "UPDATE_ORDER_SEGMENT_TYPE_COUPON",
  "UPDATE_ORDER_SEGMENT_TYPE_SHIPPING_ADDRESS",
  "UPDATE_ORDER_SEGMENT_TYPE_BILLING_ADDRESS",
  "UPDATE_ORDER_SEGMENT_TYPE_LINE_ITEM",
  "UPDATE_ORDER_SEGMENT_TYPE_SHIPPING_OPTION",
  "UPDATE_ORDER_SEGMENT_TYPE_CONVERT_CART_TO_ORDER",
  "UPDATE_ORDER_SEGMENT_TYPE_ORDER_STATUS",
];
// V1User type.
const v1User = objectEnclosing([
  { json: "external_user_id", js: "externalUserId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "email", js: "email", typ: unionMembersEnclosing(undefined, ""), },
  { json: "first_name", js: "firstName", typ: unionMembersEnclosing(undefined, ""), },
  { json: "last_name", js: "lastName", typ: unionMembersEnclosing(undefined, ""), },
  { json: "phone", js: "phone", typ: unionMembersEnclosing(undefined, ""), },
  { json: "store_credit", js: "storeCredit", typ: unionMembersEnclosing(undefined, referenceEnclosing("TypeMoney")), },
], false);
// V1UserSegment type.
const v1UserSegment = objectEnclosing([
  { json: "user", js: "user", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1User")), },
], false);
// V1UUID type.
const v1UUID = objectEnclosing([
  { json: "value", js: "value", typ: unionMembersEnclosing(undefined, ""), }
], false);
// V1ValueData type.
const v1ValueData = objectEnclosing([
  { json: "colors", js: "colors", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing("")), },
  { json: "image_url", js: "imageUrl", typ: unionMembersEnclosing(undefined, ""), },
  { json: "product_id", js: "productId", typ: unionMembersEnclosing(undefined, ""), },
  { json: "checked_value", js: "checkedValue", typ: unionMembersEnclosing(undefined, true), },
], false);
// V1Variant type.
const v1Variant = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "sku", js: "sku", typ: unionMembersEnclosing(undefined, ""), },
  { json: "display_price", js: "displayPrice", typ: unionMembersEnclosing(undefined, referenceEnclosing("TypeMoney")), },
  { json: "fixed_cost_shipping_price", js: "fixedCostShippingPrice", typ: unionMembersEnclosing(undefined, referenceEnclosing("TypeMoney")), },
  { json: "is_free_shipping", js: "isFreeShipping", typ: unionMembersEnclosing(undefined, true), },
  { json: "purchasing_disabled", js: "purchasingDisabled", typ: unionMembersEnclosing(undefined, true), },
  { json: "dimension", js: "dimension", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Dimension")), },
  { json: "option_values", js: "optionValues", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OptionValue"))), },
  { json: "inventory_level", js: "inventoryLevel", typ: unionMembersEnclosing(undefined, 0), },
  { json: "image_url", js: "imageUrl",typ: unionMembersEnclosing(undefined, ""), },
  { json: "option_value_map", js: "optionValueMap", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OptionValueMap")), },
], false);
// V1Webhook type.
const v1Webhook = objectEnclosing([
  { json: "id", js: "id", typ: unionMembersEnclosing(undefined, ""), },
  { json: "scope", js: "scope", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1WebhookScope")), },
], false);
// V1WebhookScope - enum.
const v1WebhookScope = [
  "WEBHOOK_SCOPE_UNSPECIFIED",
  "WEBHOOK_SCOPE_ORDER",
  "WEBHOOK_SCOPE_CUSTOMER",
  "WEBHOOK_SCOPE_CART",
  "WEBHOOK_SCOPE_PRODUCT",
  "WEBHOOK_SCOPE_COUPON",
  "WEBHOOK_SCOPE_CATEGORY",
];
// V1WebhookSegment type.
const v1WebhookSegment = objectEnclosing([
  { json: "webhooks", js: "webhooks", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1Webhook"))), },
], false);
/**
 * Create Request base type
 */
export const createRequestBaseType: Record<string, unknown> = {
  Externalmodelv1DeviceInfo: deviceInfo,
  string: stringType,
  TypeMoney: typeMoney,
  V1CreateRequest: objectEnclosing([
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1EntityType")), },
    { json: "app_id", js: "appId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1CreateRequestSegment")), },
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "user", js: "user", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UserSegment")), },
    { json: "webhook", js: "webhook", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1WebhookSegment")), },
  ], false),
  V1CreateRequestSegment: objectEnclosing([
    { json: "is_cart", js: "isCart", typ: unionMembersEnclosing(undefined, true), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1FastOrder")), },
  ], false),
  V1DiscountOrigin: v1DiscountOrigin,
  V1DiscountType: v1DiscountType,
  V1EntityType: v1EntityType,
  V1FastOrder: v1FastOrder,
  V1ItemFulfillmentMode: v1ItemFulfillmentMode,
  V1OrderAddress: v1OrderAddress,
  V1OrderCustomValue: v1OrderCustomValue,
  V1OrderDiscount: v1OrderDiscount,
  V1OrderLine: v1OrderLine,
  V1OrderLineReference: v1OrderLineReference,
  V1OrderRefund: v1OrderRefund,
  V1OrderShipmentPlan: v1OrderShipmentPlan,
  V1OrderStatus: v1OrderStatus,
  V1OrderType: v1OrderType,
  V1Shipment: v1Shipment,
  V1ShippingOption: v1ShippingOption,
  V1ShippingOptionType: v1ShippingOptionType,
  V1User: v1User,
  V1UserSegment: v1UserSegment,
  V1UUID: v1UUID,
  V1Webhook: v1Webhook,
  V1WebhookScope: v1WebhookScope,
  V1WebhookSegment: v1WebhookSegment,
};
/**
 * Create Response base type
 */
export const createResponseBaseType: Record<string, unknown> = {
  Externalmodelv1DeviceInfo: deviceInfo,
  string: stringType,
  TypeMoney: typeMoney,
  V1CreateResponse: objectEnclosing([
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1EntityType")), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderResponseSegment")), },
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "user", js: "user", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UserSegment")), },
    { json: "webhook", js: "webhook", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1WebhookSegment")), },
  ], false),
  V1OrderResponseSegment: v1OrderResponseSegment,
  V1DiscountOrigin: v1DiscountOrigin,
  V1DiscountType: v1DiscountType,
  V1EntityType: v1EntityType,
  V1FastOrder: v1FastOrder,
  V1ItemFulfillmentMode: v1ItemFulfillmentMode,
  V1OrderAddress: v1OrderAddress,
  V1OrderCustomValue: v1OrderCustomValue,
  V1OrderDiscount: v1OrderDiscount,
  V1OrderLine: v1OrderLine,
  V1OrderLineReference: v1OrderLineReference,
  V1OrderRefund: v1OrderRefund,
  V1OrderShipmentPlan: v1OrderShipmentPlan,
  V1OrderStatus: v1OrderStatus,
  V1OrderType: v1OrderType,
  V1Shipment: v1Shipment,
  V1ShippingOption: v1ShippingOption,
  V1ShippingOptionType: v1ShippingOptionType,
  V1User: v1User,
  V1UserSegment: v1UserSegment,
  V1UUID: v1UUID,
  V1Webhook: v1Webhook,
  V1WebhookScope: v1WebhookScope,
  V1WebhookSegment: v1WebhookSegment,
};

/**
 * Read Request base type
 */
export const readRequestBaseType: Record<string, unknown> = {
  string: stringType,
  V1EntityType: v1EntityType,
  V1OrderStatus: v1OrderStatus,
  V1ReadRequest: objectEnclosing([
    { json: "app_id", js: "appId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1EntityType")), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadOrderRequestSegment")), },
    { json: "shipping_option", js: "shippingOption", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadShippingOptionRequestSegment")), },
    { json: "user", js: "user", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadUserRequestSegment")), },
    { json: "shipping_zones", js: "shippingZones", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadShippingZonesRequestSegment")), },
    { json: "product", js: "product", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadProductRequestSegment")), },
    { json: "category", js: "category", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadCategoryRequestSegment")), },
    { json: "orders", js: "orders", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadOrdersRequestSegment")), },
    { json: "products", js: "products", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadProductsRequestSegment")), },
    { json: "categories", js: "categories", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadCategoriesRequestSegment")), },
  ], false),
  V1ReadCategoriesRequestSegment: objectEnclosing([
    { json: "last_id", js: "lastId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "page", js: "page", typ: unionMembersEnclosing(undefined, 0), },
  ], false),
  V1ReadCategoryRequestSegment: objectEnclosing([
    { json: "category_id", js: "categoryId", typ: unionMembersEnclosing(undefined, ""), },
  ], false),
  V1ReadOrderRequestSegment: objectEnclosing([
    { json: "is_cart", js: "isCart", typ: unionMembersEnclosing(undefined, true), },
    { json: "order_id", js: "orderId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "include", js: "include", typ: unionMembersEnclosing(undefined, ""), },
  ], false),
  V1ReadOrdersRequestSegment: objectEnclosing([
    { json: "after", js: "after", typ: unionMembersEnclosing(undefined, ""), },
    { json: "status", js: "status", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderStatus")), },
    { json: "page", js: "page", typ: unionMembersEnclosing(undefined, 0), },
    { json: "limit", js: "limit", typ: unionMembersEnclosing(undefined, 0), },
  ], false),
  V1ReadProductRequestSegment: objectEnclosing([
    { json: "product_id", js: "productId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "subresource_includes", js: "subresourceIncludes", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1SubResource"))), },
  ], false),
  V1SubResource: v1SubResource,
  V1ReadProductsRequestSegment: objectEnclosing([
    { json: "last_id", js: "lastId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "page", js: "page", typ: unionMembersEnclosing(undefined, 0), },
    { json: "subresource_includes", js: "subresourceIncludes", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1SubResource"))), },
  ], false),
  V1ReadShippingOptionSegment: v1EmptySegment,
  V1ReadShippingZonesRequestSegment: v1EmptySegment,
  V1ReadUserRequestSegment: objectEnclosing([
    { json: "email", js: "email", typ: unionMembersEnclosing(undefined, ""), },
    { json: "external_user_id", js: "externalUserId", typ: unionMembersEnclosing(undefined, ""), },
  ], false),
  V1UUID: v1UUID,
};

/**
 * Read Response base type
 */
export const readResponseBaseType: Record<string, unknown> = {
  Externalmodelv1DeviceInfo: deviceInfo,
  string: stringType,
  TypeMoney: typeMoney,
  V1Adjuster: v1Adjuster,
  V1Adjusters: v1Adjusters,
  V1Availability: v1Availability,
  V1Category: v1Category,
  V1Condition: v1Condition,
  V1CustomURL: v1CustomUrl,
  V1Dimension: v1Dimension,
  V1DiscountOrigin: v1DiscountOrigin,
  V1DiscountType: v1DiscountType,
  V1EntityType: v1EntityType,
  V1FastOrder: v1FastOrder,
  V1ItemFulfillmentMode: v1ItemFulfillmentMode,
  V1ModifierOptionValue: v1ModifierOptionValue,
  V1ModifierType: v1ModifierType,
  V1OptionValue: v1OptionValue,
  V1OptionValueMap: v1OptionValueMap,
  V1OrderAddress: v1OrderAddress,
  V1OrderCustomValue: v1OrderCustomValue,
  V1OrderDiscount: v1OrderDiscount,
  V1OrderLine: v1OrderLine,
  V1OrderLineReference: v1OrderLineReference,
  V1OrderRefund: v1OrderRefund,
  V1OrderResponseSegment: v1OrderResponseSegment,
  V1OrderShipmentPlan: v1OrderShipmentPlan,
  V1OrderStatus: v1OrderStatus,
  V1OrderType: v1OrderType,
  V1PriceRangeMap: v1PriceRangeMap,
  V1Product: v1Product,
  V1ProductImage: v1ProductImage,
  V1ProductModifier: v1ProductModifier,
  V1ProductType: v1ProductType,
  V1PurchaseStatus: v1PurchaseStatus,
  V1RateLimit: v1RateLimit,
  V1ReadCategoryResponseSegment: objectEnclosing([
    { json: "category", js: "category", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Category")), },
  ], false),
  V1ReadCategoriesResponseSegment: objectEnclosing([
    { json: "app_id", js: "appId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "categories", js: "categories", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1Category"))), },
    { json: "last_id", js: "lastId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "more_results", js: "moreResults", typ: unionMembersEnclosing(undefined, true), },
  ], false),
  V1ReadProductResponseSegment: objectEnclosing([
    { json: "app_id", js: "appId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "product", js: "product", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1Product")), },
    { json: "rate_limit", js: "rateLimit", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1RateLimit")), },
  ], false),
  V1ReadProductsResponseSegment: objectEnclosing([
    { json: "app_id", js: "appId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "products", js: "products", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1Product"))), },
    { json: "rate_limit", js: "rateLimit", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1RateLimit")), },
    { json: "last_id", js: "lastId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "more_results", js: "moreResults", typ: unionMembersEnclosing(undefined, true), },
  ], false),
  V1ReadOrdersResponseSegment: objectEnclosing([
    { json: "orders", js: "orders", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1FastOrder"))), },
  ], false),
  V1ReadResponse: objectEnclosing([
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1EntityType")), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderResponseSegment")), },
    { json: "shipping_option", js: "shippingOption", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadShippingOptionResponseSegment")), },
    { json: "user", js: "user", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UserSegment")), },
    { json: "shipping_zones", js: "shippingZones", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadShippingZonesResponseSegment")), },
    { json: "product", js: "product", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadProductResponseSegment")), },
    { json: "category", js: "category", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ReadCategoryResponseSegment")), },
    { json: "orders", js: "orders", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ReadOrdersResponseSegment"))), },
    { json: "products", js: "products", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ReadProductsResponseSegment"))), },
    { json: "categories", js: "categories", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ReadCategoriesResponseSegment"))), },
  ], false),
  V1ReadShippingOptionResponseSegment: v1EmptySegment,
  V1ReadShippingZonesResponseSegment: objectEnclosing([
    { json: "shipping_zones", js: "shippingZones", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ShippingZone"))), },
  ], false),
  V1Shipment: v1Shipment,
  V1ShippingOption: v1ShippingOption,
  V1ShippingOptionType: v1ShippingOptionType,
  V1ShippingZone: v1ShippingZone,
  V1User: v1User,
  V1UserSegment: v1UserSegment,
  V1UUID: v1UUID,
  V1ValueData: v1ValueData,
  V1Variant: v1Variant,
};

/**
 * Update Request base type
 */
export const updateRequestBaseType: Record<string, unknown> = {
  Externalmodelv1DeviceInfo: deviceInfo,
  string: stringType,
  TypeMoney: typeMoney,
  V1CartToOrderConvert: v1CartToOrderConvert,
  V1CouponUpdate: objectEnclosing([
    { json: "code", js: "code", typ: unionMembersEnclosing(undefined, ""), },
    { json: "remove", js: "remove", typ: unionMembersEnclosing(undefined, true), },
  ], false),
  V1EntityType: v1EntityType,
  V1OrderAddress: v1OrderAddress,
  V1OrderCustomValue: v1OrderCustomValue,
  V1OrderItemUpdate: objectEnclosing([
    { json: "item_id", js: "itemId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "quantity", js: "quantity", typ: unionMembersEnclosing(undefined, 0), },
    { json: "external_item_id", js: "externalItemId", typ: unionMembersEnclosing(undefined, "")}, 
    { json: "external_product_id", js: "externalProductId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "external_variant_id", js: "externalVariantId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "external_options", js: "externalOptions", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderCustomValue"))), },
    { json: "customizations", js: "customizations", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderCustomValue"))), },
  ], false),
  V1OrderLineReference: v1OrderLineReference,
  V1OrderStatus: v1OrderStatus,
  V1ShipmentPlanUpdate: objectEnclosing([
    { json: "plan_id", js: "planId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "ship_to", js: "shipTo", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderAddress")), },
    { json: "line_refs", js: "lineRefs", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderLineReference"))), },
  ], false),
  V1ShippingOptionUpdate: objectEnclosing([
    { json: "plan_id", js: "planId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "option_id", js: "optionId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "external_option_id", js: "externalOptionId", typ: unionMembersEnclosing(undefined, ""), },
  ], false),
  V1UpdateOrderRequestSegment: objectEnclosing([
    { json: "order_id", js: "orderId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "is_cart", js: "isCart", typ: unionMembersEnclosing(undefined, true), },
    { json: "convert_mode", js: "convertMode", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1CartToOrderConvert")), },
    { json: "convert_cart_to_order", js: "convertCartToOrder", typ: unionMembersEnclosing(undefined, true), },
    { json: "status", js: "status", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderStatus")), },
    { json: "bill_to", js: "billTo", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1OrderAddress")), },
    { json: "items", js: "items", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1OrderItemUpdate"))), },
    { json: "coupon", js: "coupon", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1CouponUpdate")), },
    { json: "shipping_option", js: "shippingOption", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1ShippingOptionUpdate")), },
    { json: "shipments", js: "shipments", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1ShipmentPlanUpdate"))), },
    { json: "updated_segments", js: "updatedSegments", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1UpdateOrderSegmentType"))), },
    { json: "user_info", js: "userInfo", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UserUpdate")), },
    { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "device_info", js: "deviceInfo", typ: unionMembersEnclosing(undefined, referenceEnclosing("Externalmodelv1DeviceInfo")), },
  ], false),
  V1UpdateOrderSegmentType: v1UpdateOrderSegmentType,
  V1UpdateRequest: objectEnclosing([
    { json: "app_id", js: "appId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, "V1EntityType"), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UpdateOrderRequestSegment")), },
  ], false),
  V1UserUpdate: objectEnclosing([
    { json: "external_customer_id", js: "externalCustomerId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "email", js: "email", typ: unionMembersEnclosing(undefined, ""), },
  ], false),
  V1UUID: v1UUID,
};

/**
 * Update Response base type
 */
export const updateResponseBaseType: Record<string, unknown> = {
  Externalmodelv1DeviceInfo: deviceInfo,
  string: stringType,
  V1DiscountOrigin: v1DiscountOrigin,
  V1DiscountType: v1DiscountType,
  V1EntityType: v1EntityType,
  V1FastOrder: v1FastOrder,
  V1ItemFulfillmentMode: v1ItemFulfillmentMode,
  V1OrderAddress: v1OrderAddress,
  V1OrderCustomValue: v1OrderCustomValue,
  V1OrderDiscount: v1OrderDiscount,
  V1OrderLine: v1OrderLine,
  V1OrderLineReference: v1OrderLineReference,
  V1OrderRefund: v1OrderRefund,
  V1OrderShipmentPlan: v1OrderShipmentPlan,
  V1OrderStatus: v1OrderStatus,
  V1OrderType: v1OrderType,
  V1Shipment: v1Shipment,
  V1ShippingOption: v1ShippingOption,
  V1ShippingOptionType: v1ShippingOptionType,
  V1UpdateOrderResponseSegment: objectEnclosing([
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1FastOrder")), },
    { json: "status", js: "status", typ: unionMembersEnclosing(undefined, arrayItemsEnclosing(referenceEnclosing("V1UpdateOrderSegmentStatus"))), },
  ], false),
  V1UpdateOrderSegmentStatus: objectEnclosing([
    { json: "updated", js: "updated", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UpdateOrderSegmentType")), },
    { json: "status", js: "status", typ: unionMembersEnclosing(undefined, true), },
    { json: "reason_code", js: "reasonCode", typ: unionMembersEnclosing(undefined, ""), },
    { json: "message", js: "message", typ: unionMembersEnclosing(undefined, ""), },
  ], false),
  V1UpdateOrderSegmentType: v1UpdateOrderSegmentType,
  V1UpdateResponse: objectEnclosing([
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1EntityType")), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UpdateOrderResponseSegment")), },
  ], false),
  V1UUID: v1UUID,
};

/**
 * Delete Request base type
 */
export const deleteRequestBaseType: Record<string, unknown> = {
  string: stringType,
  V1DeleteOrderRequestSegment: objectEnclosing([
    { json: "is_cart", js: "isCart", typ: unionMembersEnclosing(undefined, true), },
    { json: "order_id", js: "orderId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "external_id", js: "externalId", typ: unionMembersEnclosing(undefined, unionMembersEnclosing(undefined, "")), },
  ], false),
  V1DeleteRequest: objectEnclosing([
    { json: "app_id", js: "appId", typ: unionMembersEnclosing(undefined, ""), },
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1EntityType")), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1DeleteOrderRequestSegment")), },
    { json: "webhook", js: "webhook", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1WebhookSegment")), },
  ], false),
  V1EntityType: v1EntityType,
  V1UUID: v1UUID,
  V1Webhook: v1Webhook,
  V1WebhookScope: v1WebhookScope,
  V1WebhookSegment: v1WebhookSegment,
};

/**
 * Delete Response base type
 */
export const deleteResponseBaseType: Record<string, unknown> = {
  string: stringType,
  V1DeleteOrderResponseSegment: v1EmptySegment,
  V1DeleteResponse: objectEnclosing([
    { json: "request_id", js: "requestId", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1UUID")), },
    { json: "type", js: "type", typ: unionMembersEnclosing(undefined, ""), },
    { json: "order", js: "order", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1DeleteOrderResponseSegment")), },
    { json: "webhook", js: "webhook", typ: unionMembersEnclosing(undefined, referenceEnclosing("V1WebhookSegment")), },
  ], false),
  V1EntityType: v1EntityType,
  V1UUID: v1UUID,
  V1Webhook: v1Webhook,
  V1WebhookScope: v1WebhookScope,
  V1WebhookSegment: v1WebhookSegment,
};
