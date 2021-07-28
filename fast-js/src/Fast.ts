import { EventName } from "../../fast-components/FastJS/events";
import { showBackDrop } from "../../fast-components/utils/popupWindow";
import { getCheckoutBaseUrl } from "./config";
import { launchCheckout } from "./launchCheckout";
import {
  isCartCheckoutParams,
  isProductCheckoutParams,
  validateCheckoutParams,
} from "./util";

// Version of the paramters that are sent to checkout
export const VERSION = "1.2.0";

interface CheckoutCartButtonOption {
  app_id: string;
  cart_id: string;
}

export interface BaseCheckoutParams {
  appId: string;
  buttonId: string;
  currency?: string;
}

export interface CartCheckoutParams extends BaseCheckoutParams {
  cartId: string;
}

// TODO - reconcile this with Product. They are subtly different
export interface PlatformProduct {
  product_id: string;
  variant_id?: string;
  option_values?: {
    option_id: string;
    option_value: string;
  }[];
  quantity: string | number;
}

interface Product {
  id: string;
  variantId?: string;
  options?: {
    id: string;
    value: string;
  }[];
  quantity: number;
}

export interface ProductCheckoutParams extends BaseCheckoutParams {
  products: Product[];
  couponCode?: string;
  affiliateInfo?: {
    affiliates: {
      id: string;
    }[];
  };
}

export class Fast {
  events: { [type: string]: ((ev: any) => Promise<void> | void)[] } = {};

  constructor(appId: string = "") {
    window.addEventListener("message", this.handleReceiveMessage.bind(this));
    const { backdrop } = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    if (backdrop) {
      showBackDrop();
    }
  }

  static Events = EventName;

  addEventListener(
    type: string,
    listener: (event: any) => Promise<void> | void
  ) {
    if (this.events[type]) {
      this.events[type].push(listener);
    } else {
      this.events[type] = [listener];
    }
  }

  removeEventListener(
    type: string,
    listener: (ev: any) => Promise<void> | void
  ) {
    if (!this.events[type]) {
      return;
    }

    const index = this.events[type].indexOf(listener);
    if (index >= 0) {
      this.events[type].splice(index, 1);
    }
  }

  async handleReceiveMessage(event: MessageEvent) {
    const { type, ...rest } = event.data;
    const baseUrl = getCheckoutBaseUrl();

    if (event.origin !== baseUrl || !this.events[type]) {
      return;
    }

    const listeners = this.events[type];

    for (const listener of listeners) {
      const listenerReturnValue = listener(rest.event);
      if (listenerReturnValue instanceof Promise) {
        await listenerReturnValue;
      }
    }
  }

  createButton(appId = "") {
    const button = document.createElement("fast-checkout-button");
    button.setAttribute("app_id", appId);
    return button;
  }

  createCheckoutCartButton(options: CheckoutCartButtonOption) {
    const { app_id, cart_id } = options;
    const button = document.createElement("fast-checkout-cart-button");
    button.setAttribute("app_id", app_id);
    button.setAttribute("cart_id", cart_id);
    return button;
  }

  static checkout(params: CartCheckoutParams | ProductCheckoutParams) {
    if (!window) {
      throw new Error(
        "Unable to call checkout: please make sure this is called in a browser environment."
      );
    }

    // since our params are likely coming from javascript, we should validate that they are really the types they are
    // supposed to be
    const errors = validateCheckoutParams(params);
    if (errors.length > 0) {
      throw new Error(
        `Errors exist in fast.checkout parameters: ${errors.join(" ")}`
      );
    }

    // create url parameters for checkout app
    const urlParams = new URLSearchParams();
    urlParams.append("app_id", params.appId);
    urlParams.append("button_id", params.buttonId);
    urlParams.append("version", VERSION);

    if (isCartCheckoutParams(params)) {
      urlParams.append("platform_cart_id", params.cartId);
    } else if (isProductCheckoutParams(params)) {
      // Convert fast.js products array to the format checkout expects
      const products = params.products.map((product) => ({
        product_id: product.id,
        variant_id: product.variantId,
        option_values: product.options?.map((option) => ({
          option_id: option.id,
          option_value: option.value,
        })),
        quantity: product.quantity,
      }));
      urlParams.append("products", JSON.stringify(products));

      // optional params for product checkout
      if (params.couponCode) {
        urlParams.append("coupon_code", params.couponCode);
      }

      if (params.affiliateInfo) {
        const affiliateInfo = {
          entities: params.affiliateInfo.affiliates,
        };
        urlParams.append("affiliate_info", JSON.stringify(affiliateInfo));
      }

      if (params.currency) {
        urlParams.append("display_currency", params.currency);
      }
    }

    launchCheckout(urlParams.toString(), params.buttonId);
  }
}

// If someone wants to ensure that their code runs once Fast is ready, they can listen for this event and then use
// e.detail.Fast
window.dispatchEvent(new CustomEvent("fastready", { detail: { Fast } }));
