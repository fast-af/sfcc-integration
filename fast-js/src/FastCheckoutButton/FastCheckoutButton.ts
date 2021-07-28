import { FastJsEvent } from "../../../fast-components/FastJS";
import { EventName } from "../../../fast-components/FastJS/events";
import {
  showFailureBackDrop,
  showMobileBackdrop,
} from "../../../fast-components/utils/popupWindow";
import { EventName as EventServiceEventName, trackEvent } from "../analytics";
import {
  buttonTemplate,
  checkIcon,
  defaultButtonText,
  lockIcon,
  lockIconDarkMode,
  xIcon,
} from "../buttonTemplate";
import { getCheckoutBaseUrl } from "../config";
import { VERSION } from "../Fast";
import { launchCheckout } from "../launchCheckout";
import { generateUuid } from "../util";

export type InvalidFields = null | string[];
export type Params = Record<string, any>;

// TODO: remove after variant selection is live
const VARIANT_SELECTION_APP_ID_WHITELIST = [
  // dev
  "3b4929eb-7bb1-486a-b045-d0b40344ac38",
  // staging
  "f864c369-e470-40ac-81ad-df2cd3c7f44c",
  // fast store
  "ff22da78-c330-44ce-ab3b-88b3d8968257",
];

export interface CheckoutData {
  invalidFields?: InvalidFields;
  params: Params;
  shouldOpenVariantSelection?: boolean;
}

// The opencheckout event should return with these parameters
export interface OpenCheckoutEvent extends Event {
  detail: {
    shouldOpenVariantSelection: boolean;
    invalidFields: InvalidFields;
    formParams: Params;
  };
}

export interface FastJsMessage {
  type: string;
  event: FastJsEvent;
}

const attributeNames = {
  app_id: "app_id",
  disabled: "disabled",
  invalid: "invalid",
  cancelled: "cancelled",
  completed: "completed",
  orderAgain: "order-again",
  hidden: "hidden",
  darkMode: "dark",
  currency: "currency",
};

export const eventNames = {
  message: "message",
  openCheckout: "opencheckout",
  readyToCheckout: "readytocheckout",
};

export enum OrderStatus {
  NONE,
  CREATED,
  // todo: two L's is the queen's english but it matches the rest of our code. need to localize our code at some point
  CANCELLED,
  ITEM_CANCELLED,
}

const STATUS_TIMEOUT = 5000;

export class FastCheckoutButton extends HTMLElement {
  popup?: Window | null;
  // Status of the current order:
  // None - no order yet, or order isn't created (e.g. user is still in Complete Profile)
  // Created - order has been placed (Complete Profile is done, or non-bootstrap user opened checkout)
  //   Triggered when we receive CHECKOUT_ORDER_CREATED event
  // Canceled - order has been canceled
  //   Triggered when we receive CHECKOUT_ORDER_CANCELLED event
  // Item Canceled - special case when user accidentally re-buys something but then decides not to after we ask them if
  //                 they are sure
  //   Triggered when we receive CHECKOUT_ITEM_CANCELLED event
  // When the checkout popup is closed, we'll use the value of this field to decide how to re-style the button
  orderStatus: OrderStatus = OrderStatus.NONE;

  private uuid: string;

  constructor() {
    super();

    this.uuid = generateUuid();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));

    this.onclick = this.handleClick;

    window.addEventListener(eventNames.openCheckout, this.handleOpenCheckout);

    const checkoutData = this.getCheckoutData();

    trackEvent({
      eventName: EventServiceEventName.PDP_CHECKOUT_BUTTON_VIEWED,
      appId: this.app_id,
      details: {
        button_id: this.uuid,
        merchant_product_id: checkoutData.params.product_id,
      },
    });
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
    const checkoutDetails = {
      ...e.detail,
      params: e.detail.formParams,
    };
    this.openCheckout(checkoutDetails);
  }) as EventListener;

  get app_id() {
    return this.getAttribute(attributeNames.app_id) ?? "";
  }

  set app_id(val: string) {
    this.setAttribute(attributeNames.app_id, val);
  }

  get darkMode() {
    return this.hasAttribute(attributeNames.darkMode);
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

  get invalid() {
    return this.hasAttribute(attributeNames.invalid);
  }

  set invalid(val: boolean) {
    if (val) {
      this.setAttribute(attributeNames.invalid, "");
    } else {
      this.removeAttribute(attributeNames.invalid);
    }
  }

  get hidden(): boolean {
    return this.hasAttribute(attributeNames.hidden);
  }

  set hidden(val: boolean) {
    if (val) {
      this.setAttribute(attributeNames.hidden, "");
    } else {
      this.removeAttribute(attributeNames.hidden);
    }
  }

  get currency() {
    return this.getAttribute(attributeNames.currency) ?? "";
  }

  set currency(val: string) {
    this.setAttribute(attributeNames.currency, val);
  }

  // If this button has an id attribute, we will use it. If it doesn't, we'll use a UUID that was generated when the
  // button was instantiated.
  get id(): string {
    return this.getAttribute("id") || this.uuid;
  }

  set id(val: string) {
    this.setAttribute("id", val);
  }

  // getCheckoutDataFromAttributes checks for the product_id and variant_id attributes, and returns a Params object
  // if they exist, or undefined otherwise
  getCheckoutParamsFromAttributes(): Params | undefined {
    const productId = this.getAttribute("product_id");
    if (productId) {
      // These other fields mean nothing to us if product_id isn't set, so we check for em in here

      // Default to undefined so it's just not in the params object if it wasn't set
      const variantId = this.getAttribute("variant_id") || undefined;

      // if Number(quantity) is 0 or NaN, default to 1
      const quantity = Number(this.getAttribute("quantity")) || 1;

      let productOptions: [string, string][] | undefined;
      const productOptionsJson = this.getAttribute("product_options");
      if (productOptionsJson) {
        try {
          const productOptionsMap = JSON.parse(productOptionsJson) as Record<
            string,
            string
          >;

          productOptions = Object.entries(productOptionsMap);
        } catch {
          this.handleFailure(
            EventServiceEventName.HEADLESS_CHECKOUT_BUTTON_FAILED_MALFORMED_PRODUCT_OPTIONS,
            false
          );
          // Invalid/malformed JSON; just ignore it and log an error.
          console.error(
            "<fast-checkout-button>: unable to parse JSON from the product_options attribute. Opening variant selection instead"
          );
        }
      }

      return {
        product_id: productId,
        variant_id: variantId,
        option_values: productOptions,
        quantity,
      };
    }
  }

  // getCheckoutDataFromPage tries to read any product information from the page the button is on. Platform-specific
  // fast.js extensions can override this to read data for their platform.
  getCheckoutDataFromPage(): CheckoutData {
    // The base fast.js does not try to read any product information from the page.
    return {
      params: {},
    };
  }

  // getCheckoutData first looks for product information from the button attributes. Then, if there isn't any, it tries
  // to read product data from the page.
  getCheckoutData(): CheckoutData {
    const attributeParams = this.getCheckoutParamsFromAttributes();
    // If the button attributes are provided, use them
    if (attributeParams !== undefined) {
      return {
        params: attributeParams,
        shouldOpenVariantSelection: !attributeParams.option_values,
      };
    } else {
      // Otherwise, use getCheckoutDataFromPage
      return this.getCheckoutDataFromPage();
    }
  }

  // When the button is clicked but it does not popup the window
  handleFailure(eventName: EventServiceEventName, showBackdrop = true) {
    trackEvent({
      eventName,
      appId: this.app_id,
      details: {
        button_id: this.uuid,
      },
    });
    if (showBackdrop) {
      showFailureBackDrop();
    }
  }

  handleDataFailure() {
    // Note that this event will ALWAYS be sent for Direct Integration sites. We can filter these out
    // in our event dashboards so that we only see the sellers where this is a real problem.
    // Most common cause - loading fast.js instead of fast-bigcommerce.js
    // Do not show anything to the user as it will be confusing for Direct Integration site users
    this.handleFailure(
      EventServiceEventName.PDP_CHECKOUT_BUTTON_FAILED_NO_DATA,
      false
    );
  }

  handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    window.dispatchEvent(new Event(eventNames.readyToCheckout));

    const checkoutData = this.getCheckoutData();

    trackEvent({
      eventName: EventServiceEventName.PDP_CHECKOUT_BUTTON_CLICKED,
      appId: this.app_id,
      details: {
        button_id: this.uuid,
        merchant_product_id: checkoutData.params.product_id,
        merchant_variant_id: checkoutData.params.variant_id,
        merchant_option_values: checkoutData.params.option_values?.map(
          ([option_id, option_value]: string[]) => ({
            option_id,
            option_value,
          })
        ),
        quantity: checkoutData.params.quantity,
      },
    });

    // If we have any product data, open checkout app
    // There might be no product data if the host page is planning on using Fast.checkout() instead.
    if (Object.keys(checkoutData.params).length > 0) {
      this.openCheckout(checkoutData);
    } else {
      this.handleDataFailure();
    }
  }

  private popupCheckout = (searchParams: URLSearchParams) => {
    if (showMobileBackdrop() && this.popup) {
      this.popup.postMessage("close", getCheckoutBaseUrl());

      // If there is no timeout, the new window is closed
      window.setTimeout(() => {
        this.popup = launchCheckout(searchParams.toString(), this.id);
        if (!this.popup) {
          this.handleFailure(EventServiceEventName.PDP_CHECKOUT_BUTTON_FAILED);
        }
      }, 100);
    } else {
      this.popup = launchCheckout(searchParams.toString(), this.id);

      if (!this.popup) {
        this.handleFailure(EventServiceEventName.PDP_CHECKOUT_BUTTON_FAILED);
      }
    }
  };

  openCheckout(data: CheckoutData) {
    const { invalidFields, params, shouldOpenVariantSelection } = data;

    const searchParams = new URLSearchParams();
    if (
      shouldOpenVariantSelection &&
      VARIANT_SELECTION_APP_ID_WHITELIST.includes(this.app_id)
    ) {
      /* if the user hasn't selected all required options and
        variant selection is available (product has 2 options or less): redirect to variant selection screen */
      searchParams.append("no_variant_selected", "true");
    } else if (invalidFields?.length) {
      this.invalid = true;
      window.addEventListener("click", this.closeTooltip);
      return;
    }

    // create url parameters for checkout app
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        searchParams.append(key, params[key]);
      }
    });

    if (!this.app_id) {
      this.handleFailure(
        EventServiceEventName.PDP_CHECKOUT_BUTTON_FAILED_NO_APP_ID
      );
      return;
    }

    searchParams.append("app_id", this.app_id);
    searchParams.append("button_id", this.id);
    searchParams.append("version", VERSION);
    if (this.currency) {
      searchParams.append("display_currency", this.currency);
    }

    this.popupCheckout(searchParams);
  }

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
          case OrderStatus.CANCELLED:
            this.handleCancelledOrder();
            break;
          case OrderStatus.ITEM_CANCELLED:
            this.handleCancelledItem();
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

  closeTooltip = () => {
    this.invalid = false;
  };

  private handleCancelledOrder() {
    const buttonText = this.shadowRoot?.querySelector("button span");
    const button = this.shadowRoot?.querySelector("button");
    const icon = this.shadowRoot?.querySelector(
      "button #icon"
    ) as HTMLImageElement;

    if (!buttonText || !button || !icon) {
      console.error("button elements not found");
      return;
    }

    this.setButtonToCancelled(buttonText, icon);
    button.onmouseenter = () => {
      this.setButtonToOrderAgain(buttonText);
    };
    button.onmouseleave = () => {
      this.setButtonToCancelled(buttonText, icon);
    };

    setTimeout(() => {
      this.setButtonToDefault(buttonText, icon);
      button.onmouseenter = null;
      button.onmouseleave = null;
    }, STATUS_TIMEOUT);
  }

  private handleCancelledItem() {
    const buttonText = this.shadowRoot?.querySelector("button span");
    const button = this.shadowRoot?.querySelector("button");
    const icon = this.shadowRoot?.querySelector(
      "button #icon"
    ) as HTMLImageElement;

    if (!buttonText || !button || !icon) {
      console.error("button elements not found");
      return;
    }

    this.setButtonToItemCancelled(buttonText, icon);
    button.onmouseenter = () => {
      this.setButtonToOrderAgain(buttonText);
    };
    button.onmouseleave = () => {
      this.setButtonToItemCancelled(buttonText, icon);
    };

    setTimeout(() => {
      this.setButtonToDefault(buttonText, icon);
      button.onmouseenter = null;
      button.onmouseleave = null;
    }, STATUS_TIMEOUT);
  }

  private handleCompletedOrder() {
    const buttonText = this.shadowRoot?.querySelector("button span");
    const button = this.shadowRoot?.querySelector("button");
    const icon = this.shadowRoot?.querySelector(
      "button #icon"
    ) as HTMLImageElement;

    if (!buttonText || !button || !icon) {
      console.error("button elements not found");
      return;
    }

    this.setButtonToCompleted(buttonText, icon);

    button.onmouseenter = () => {
      this.setButtonToOrderAgain(buttonText);
    };

    button.onmouseleave = () => {
      this.setButtonToCompleted(buttonText, icon);
    };

    setTimeout(() => {
      this.setButtonToDefault(buttonText, icon);
      button.onmouseenter = null;
      button.onmouseleave = null;
    }, STATUS_TIMEOUT);
  }

  private setButtonToOrderAgain(buttonText: Element) {
    this.removeAttribute(attributeNames.completed);
    this.removeAttribute(attributeNames.cancelled);

    this.setAttribute(attributeNames.orderAgain, "true");
    buttonText.textContent = "Order Again?";
  }

  private setButtonToCancelled(buttonText: Element, icon: HTMLImageElement) {
    this.removeAttribute(attributeNames.completed);
    this.removeAttribute(attributeNames.orderAgain);

    this.setAttribute(attributeNames.cancelled, "true");
    buttonText.textContent = "Order Cancelled";
    icon.style.backgroundImage = xIcon;
  }

  private setButtonToItemCancelled(
    buttonText: Element,
    icon: HTMLImageElement
  ) {
    this.removeAttribute(attributeNames.completed);
    this.removeAttribute(attributeNames.orderAgain);

    this.setAttribute(attributeNames.cancelled, "true");
    buttonText.textContent = "Item Cancelled";
    icon.style.backgroundImage = xIcon;
  }

  private setButtonToCompleted(buttonText: Element, icon: HTMLImageElement) {
    this.removeAttribute(attributeNames.cancelled);
    this.removeAttribute(attributeNames.orderAgain);

    this.setAttribute(attributeNames.completed, "true");
    buttonText.textContent = "Order Complete";
    icon.style.backgroundImage = checkIcon;
  }

  private setButtonToDefault(buttonText: Element, icon: HTMLImageElement) {
    this.removeAttribute(attributeNames.cancelled);
    this.removeAttribute(attributeNames.orderAgain);
    this.removeAttribute(attributeNames.completed);

    buttonText.textContent = defaultButtonText;
    icon.style.backgroundImage = this.darkMode ? lockIconDarkMode : lockIcon;
  }
}
