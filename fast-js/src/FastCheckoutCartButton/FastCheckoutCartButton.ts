/* eslint-disable @typescript-eslint/naming-convention */
import DomPurify from "dompurify";
import { EventName } from "../../../fast-components/FastJS/events";
import {
  showFailureBackDrop,
  showMobileBackdrop,
} from "../../../fast-components/utils/popupWindow";
import { EventName as EventServiceEventName, trackEvent } from "../analytics";
import { buttonTemplate } from "../buttonTemplate";
import { getCheckoutBaseUrl } from "../config";
import { OrderStatus } from "../FastCheckoutButton/FastCheckoutButton";
import { PlatformProduct, VERSION } from "../index";
import { launchCheckout } from "../launchCheckout";
import { generateUuid } from "../util";

// opencheckout event should send the payload in this format
export interface OpenCheckoutEvent extends Event {
  detail: {
    cart_id: string;
  };
}

const attributeNames = {
  app_id: "app_id",
  cart_id: "cart_id",
  platform: "platform",
  custom: "custom",
  cart_data: "cart_data",
  coupon_code: "coupon_code",
  disabled: "disabled",
  currency: "currency",
};

const eventNames = {
  message: "message",
  openCheckout: "opencheckout",
  readyToCheckout: "readytocheckout",
};

export class FastCheckoutCartButton extends HTMLElement {
  popup?: Window | null;
  orderStatus = OrderStatus.NONE;

  private uuid: string;

  constructor() {
    super();

    this.uuid = generateUuid();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));
    window.name = DomPurify.sanitize(window.location.href);

    this.onclick = this.handleClick;

    // Add a listener for the openCheckout event.
    // When the event is received it should have a cart id in the details
    // and then call openCheckout
    window.addEventListener(eventNames.openCheckout, this.handleOpenCheckout);

    this.trackFastJsEvent("view");
  }

  connectedCallback() {
    window.addEventListener(
      eventNames.message,
      this.handleReceiveMessage.bind(this)
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      eventNames.message,
      this.handleReceiveMessage.bind(this)
    );
    window.removeEventListener(
      eventNames.openCheckout,
      this.handleOpenCheckout
    );
  }

  handleOpenCheckout = ((e: OpenCheckoutEvent) => {
    this.cart_id = e.detail.cart_id;
    this.openCheckout();
  }) as EventListener;

  get app_id() {
    return this.getAttribute(attributeNames.app_id) ?? "";
  }

  set app_id(val: string) {
    this.setAttribute(attributeNames.app_id, val);
  }

  get cart_id() {
    return this.getAttribute(attributeNames.cart_id) ?? "";
  }

  set cart_id(val: string) {
    this.setAttribute(attributeNames.cart_id, val);
  }

  get cart_data() {
    return this.getAttribute(attributeNames.cart_data) ?? "";
  }

  set cart_data(val: string) {
    this.setAttribute(attributeNames.cart_data, val);
  }

  get coupon_code() {
    return this.getAttribute(attributeNames.coupon_code) ?? "";
  }

  set coupon_code(val: string) {
    this.setAttribute(attributeNames.coupon_code, val);
  }

  get disabled() {
    return this.hasAttribute(attributeNames.disabled);
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute(attributeNames.disabled, "");
    } else {
      this.removeAttribute(attributeNames.disabled);
    }
  }

  get currency() {
    return this.getAttribute(attributeNames.currency) ?? "";
  }

  set currency(val: string) {
    this.setAttribute(attributeNames.currency, val);
  }

  get platform() {
    return this.getAttribute(attributeNames.platform) ?? "";
  }

  set platform(val: string) {
    this.setAttribute(attributeNames.platform, val);
  }

  // If this button has an id attribute, we will use it. If it doesn't, we'll use a UUID that was generated when the
  // button was instantiated.
  get id(): string {
    return this.getAttribute("id") || this.uuid;
  }

  set id(val: string) {
    this.setAttribute("id", val);
  }

  fetchCartId = async () => {
    return this.cart_id;
  };

  fetchCartData = async () => {
    return this.cart_data;
  };

  async trackFastJsEvent(type: "click" | "view") {
    const cartDataJson = await this.fetchCartData();
    // Only parse cartDataJson if it's truthy (i.e. a real JSON string and not empty or undefined)
    const cartData = cartDataJson
      ? (JSON.parse(cartDataJson) as PlatformProduct[])
      : undefined;
    const eventName =
      type === "click"
        ? EventServiceEventName.CART_CHECKOUT_BUTTON_CLICKED
        : EventServiceEventName.CART_CHECKOUT_BUTTON_VIEWED;

    await trackEvent({
      eventName,
      appId: this.app_id,
      details: {
        button_id: this.id,
        merchant_cart_id: this.cart_id,
        cart_data: cartData?.map((product) => ({
          merchant_product_id: product.product_id,
          merchant_variant_id: product.variant_id,
          merchant_option_values: product.option_values,
          quantity: product.quantity,
        })),
        coupon_codes: this.coupon_code ? [this.coupon_code] : undefined,
      },
    });
  }

  handleClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    // Intentionally not await-ing on this as we don't want to have a delay between clicking the button and launching
    // the Fast window, otherwise popup blockers might stop us from working.
    this.trackFastJsEvent("click");

    // Dispatch an event to notify the page that the user has clicked
    // the button.
    window.dispatchEvent(new Event(eventNames.readyToCheckout));

    await this.fetchCartData();
    this.openCheckout();
  };

  // When the button is clicked but it does not popup the window
  handleFailure() {
    trackEvent({
      eventName: EventServiceEventName.CART_CHECKOUT_BUTTON_FAILED,
      appId: this.app_id,
      details: {
        button_id: this.id,
      },
    });
    showFailureBackDrop();
  }

  openCheckout = () => {
    const params = new URLSearchParams();
    params.append("app_id", this.app_id);
    params.append("button_id", this.id);
    params.append("platform", this.platform);
    params.append("version", VERSION);

    // Only pass on cart_id if there are no products
    if (this.cart_data) {
      params.append("products", this.cart_data);
    } else if (this.cart_id) {
      params.append("platform_cart_id", this.cart_id);
    }

    if (this.coupon_code) {
      params.append("coupon_code", this.coupon_code);
    }

    if (this.currency) {
      params.append("display_currency", this.currency);
    }

    if (showMobileBackdrop() && this.popup) {
      this.popup?.postMessage?.("close", getCheckoutBaseUrl());

      // If there is no timeout, the new window is closed
      window.setTimeout(() => {
        this.popup = launchCheckout(params.toString(), this.id, true);
        if (!this.popup) {
          console.error("could not open checkout window");
          this.handleFailure();
        }
      }, 100);
    } else {
      this.popup = launchCheckout(params.toString(), this.id, true);
      if (!this.popup) {
        console.error("could not open checkout window");
        this.handleFailure();
      }
    }
  };

  // abstract method
  handleCompletedOrder() {}

  handleReceiveMessage(event: Event) {
    const messageEvent = event as MessageEvent;
    if (messageEvent.origin !== getCheckoutBaseUrl()) {
      return;
    }

    const { type, ...rest } = messageEvent.data;

    // If this event comes from a window owned by a different button (or a different message-event sender entirely),
    // ignore it.
    if (rest?.event?.buttonId !== this.id) {
      return;
    }

    switch (rest?.event?.name) {
      case EventName.CHECKOUT_ITEM_CANCELLED:
        this.orderStatus = OrderStatus.ITEM_CANCELLED;
        break;
      case EventName.CHECKOUT_ORDER_CANCELLED:
        this.orderStatus = OrderStatus.CANCELLED;
        break;
      case EventName.CHECKOUT_ORDER_CREATED:
        this.orderStatus = OrderStatus.CREATED;
        break;
      case EventName.POPUP_WINDOW_CLOSED:
        // Update button feedback based on status of their order
        switch (this.orderStatus) {
          case OrderStatus.CREATED:
            this.handleCompletedOrder();
            break;
        }
        // Clear the order status after we show feedback so that subsequent orders don't give weird button styles
        this.orderStatus = OrderStatus.NONE;
        break;
    }

    this.dispatchEvent(
      new CustomEvent(type, {
        detail: {
          ...rest,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}
