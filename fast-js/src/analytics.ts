import { config } from "./config";
// Helper functions for sending events to the Fast Event service
// https://www.notion.so/fastaf/Events-Service-e1fa24aa048043dda93db29279c9301b

// Proto: https://github.com/fast-af/monorepo/blob/master/events/api/v1/shared.proto#L149
export enum EventName {
  CART_CHECKOUT_BUTTON_CLICKED = "Cart Checkout Button Clicked",
  CART_CHECKOUT_BUTTON_VIEWED = "Cart Checkout Button Viewed",
  CART_CHECKOUT_BUTTON_FAILED = "Cart Checkout Button Failed",
  LOGIN_BUTTON_CLICKED = "Login Button Clicked",
  LOGIN_BUTTON_VIEWED = "Login Button Viewed",
  LOGIN_BUTTON_FAILED = "Login Button Failed",
  PDP_CHECKOUT_BUTTON_CLICKED = "PDP Checkout Button Clicked",
  PDP_CHECKOUT_BUTTON_VIEWED = "PDP Checkout Button Viewed",
  PDP_CHECKOUT_BUTTON_FAILED = "PDP Checkout Button Failed",
  PDP_CHECKOUT_BUTTON_FAILED_NO_APP_ID = "PDP Checkout Button Failed - No APP ID",
  PDP_CHECKOUT_BUTTON_FAILED_NO_DATA = "PDP Checkout Button Failed - No Data",
  HEADLESS_CHECKOUT_BUTTON_FAILED_MALFORMED_PRODUCT_OPTIONS = "Headless Checkout Button Failed - Malformed Product Options JSON",
}

const CLIENT_SOURCE_FASTJS = "CLIENT_SOURCE_FASTJS";

interface Product {
  merchant_product_id?: string;
  merchant_variant_id?: string;
  merchant_option_values?: Array<{
    option_id: string;
    option_value: string;
  }>;
  quantity?: string | number;
}

// Proto: https://github.com/fast-af/monorepo/blob/master/events/api/v1/shared.proto#L211
interface EventDetail {
  eventName: EventName;
  appId: string;
  // details always has a button_id, sometimes has cart_data (array of product data), and sometimes has product data at
  // top level
  // Note that the fields here use snake_case. This is so that we can send them straight through in the REST request
  // without having to spend extra time converting between 🐪 and 🐍.
  details?: {
    button_id: string;
    cart_data?: Array<Product>;
    merchant_cart_id?: string;
    coupon_codes?: string[];
  } & Product;
  // source and occurredAt will be populated by trackEvent
}

export const trackEvent = async (event: EventDetail): Promise<void> => {
  // we accept string/number for the quantity field, but events API requires it be a string
  if (event.details?.quantity) {
    event.details.quantity = String(event.details.quantity);
  }

  const body = JSON.stringify({
    events: [
      {
        event_name: event.eventName,
        app_id: event.appId,
        fastjs_event_detail: event.details,
        occurred_at: new Date().toISOString(),
        source: CLIENT_SOURCE_FASTJS,
      },
    ],
  });

  await fetch(`${config.apiUrl}/v1/events`, {
    method: "POST",
    body,
  });
};
