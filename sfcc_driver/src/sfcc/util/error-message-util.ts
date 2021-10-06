/* eslint-disable indent */
import { OCAPIFaultType } from "../models/ocapi-fault-type-enum";

/**
 * Get an appropriate error code for the SFCC OCAPI fault type.
 * 
 * Note: The error code to be identified first in the
 * respective commerce platform's messages.json file before
 * including it here.
 * 
 * @param faultType {OCAPIFaultType} - the SFCC OCAPI fault type.
 * @returns {string} - the error code to look up in the messages.
 */
const getErrorCode = (faultType: OCAPIFaultType): string => {
  switch (faultType) {
    /* Authorization exceptions */
    case OCAPIFaultType.INVALID_AUTHORIZATION_HEADER: {
      return "1001";
    };
    case OCAPIFaultType.MISSING_CLIENT_ID: {
      return "1004";
    };
    case OCAPIFaultType.INVALID_ACCESS_TOKEN: {
      return "1006";
    };
    case OCAPIFaultType.CONNECTION_REFUSED: {
      return "1013";
    };

    /* Other common exceptions. */
    case OCAPIFaultType.METHOD_NOT_ALLOWED: {
      return "1002";
    };
    case OCAPIFaultType.RESOURCE_STATE_CONFLICT: {
      return "1007";
    };
    case OCAPIFaultType.UNKNOWN_PROPERTY: {
      return "1009";
    };
    case OCAPIFaultType.HOOK_INTERNAL_SERVER_ERROR: {
      return "1010";
    };
    case OCAPIFaultType.CLIENT_ACCESS_FORBIDDEN: {
      return "1011";
    };
    case OCAPIFaultType.PROPERTY_VALUE_CONSTRAINT_VIOLATION: {
      return "1012";
    };

    /* Error types for ActionType.CREATE operation. */
    case OCAPIFaultType.INVALID_PAYMENT_METHOD_ID: {
      return "2002";
    };
    case OCAPIFaultType.CUSTOMER_BASKETS_QUOTA_EXCEEDED: {
      return "2003";
    };
    case OCAPIFaultType.DUPLICATE_SHIPMENT_ID: {
      return "2004";
    };
    case OCAPIFaultType.MISSING_COUPON_CODE: {
      return "2005";
    };
    case OCAPIFaultType.INVALID_PRICE_ADJUSTMENT_LEVEL: {
      return "2006";
    };
    case OCAPIFaultType.INVALID_PROMOTION_ID: {
      return "2007";
    };
    case OCAPIFaultType.SYSTEM_PROMOTION_ID: {
      return "2008";
    };
    case OCAPIFaultType.TOO_MANY_PROMOTIONS: {
      return "2009";
    };
    case OCAPIFaultType.SHIPMENT_NOT_FOUND: {
      return "2010";
    };

    /* Error types for ActionType.READ and ActionType.DELETE operations. */
    case OCAPIFaultType.BASKET_NOT_FOUND: {
      return "3001";
    };
    case OCAPIFaultType.CUSTOMER_NOT_FOUND: {
      return "3002";
    };
    case OCAPIFaultType.ORDER_NOT_FOUND: {
      return "3003";
    };
    case OCAPIFaultType.PRODUCT_NOT_FOUND: {
      return "3004";
    };

    /* Error types for ActionType.UPDATE operations. */
    case OCAPIFaultType.UNSUPPORTED_CURRENCY: {
      return "4004";
    };
    case OCAPIFaultType.INVALID_SHIPPING_ITEM_ID: {
      return "4005";
    };
    case OCAPIFaultType.DUPLICATE_SHIPPING_ITEM_ID: {
      return "4006";
    };
    case OCAPIFaultType.SOURCE_CODE_INACTIVE: {
      return "4007";
    };
    case OCAPIFaultType.SHIPPING_ITEM_NOT_FOUND: {
      return "4008";
    };
    case OCAPIFaultType.SOURCE_CODE_NOT_FOUND: {
      return "4009";
    };
    case OCAPIFaultType.COUPON_ITEM_NOT_FOUND: {
      return "4010";
    };
    case OCAPIFaultType.INVALID_COUPON_CODE: {
      return "4011";
    };
    case OCAPIFaultType.INVALID_PRODUCT_ID: {
      return "4012";
    };
    case OCAPIFaultType.INVALID_PRODUCT_ITEM: {
      return "4013";
    };
    case OCAPIFaultType.INVALID_PRODUCT_ITEM_QUANTITY: {
      return "4014";
    };
    case OCAPIFaultType.PRODUCT_ITEM_NOT_AVAILABLE: {
      return "4015";
    };
    case OCAPIFaultType.INVALID_PRODUCT_TYPE: {
      return "4016";
    };
    case OCAPIFaultType.INVALID_PRODUCT_OPTION_ITEM: {
      return "4017";
    };
    case OCAPIFaultType.INVALID_PRODUCT_OPTION_VALUE_ITEM: {
      return "4018";
    };
    case OCAPIFaultType.BASKET_QUOTA_EXCEEDED: {
      return "4019";
    };
    case OCAPIFaultType.BONUS_DISCOUNT_LINE_ITEM_NOT_FOUND: {
      return "4020";
    };
    case OCAPIFaultType.BONUS_PRODUCT_QUANTITY: {
      return "4021";
    };
    case OCAPIFaultType.INVALID_BONUS_PRODUCT: {
      return "4022";
    };
    case OCAPIFaultType.INVALID_PRODUCT_ITEM_ID: {
      return "4023";
    };
    case OCAPIFaultType.INVALID_SHIPMENT_ID: {
      return "4024";
    };
    case OCAPIFaultType.MISSING_SHIPPING_METHOD_ID: {
      return "4026";
    };
    case OCAPIFaultType.INVALID_SHIPPING_METHOD_ID: {
      return "4027";
    };
    case OCAPIFaultType.DUPLICATE_SHIPMENT_NO: {
      return "4028";
    };
    case OCAPIFaultType.GIFT_CERTIFICATE_CREATION: {
      return "4029";
    };
    case OCAPIFaultType.INVALID_BASKET_ID: {
      return "4030";
    };
    case OCAPIFaultType.VALIDATION: {
      return "4031";
    };

    /* Default error code if none matches. */
    default: {
      return "1002";
    };
  };
};

export default getErrorCode;
