import { EventName } from "../../../fast-components/FastJS/events";
import * as PopupWindow from "../../../fast-components/utils/popupWindow";
import url from "../../../fast-components/utils/url";
import waitForExpect from "wait-for-expect";
import * as Analytics from "../analytics";
import { VERSION } from "../Fast";
import { OrderStatus } from "../FastCheckoutButton/FastCheckoutButton";
import { FastCheckoutCartButton } from "./FastCheckoutCartButton";

describe("<FastCheckoutCartButton />", () => {
  customElements.define("fast-checkout-cart-button", FastCheckoutCartButton);
  const oldError = console.error;

  const popupWindowSpy = jest
    .spyOn(PopupWindow, "popupWindow")
    .mockImplementation(() => {
      return {} as Window;
    });

  const trackEventSpy = jest
    .spyOn(Analytics, "trackEvent")
    .mockImplementation(() => {
      return new Promise((resolve) => resolve());
    });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    console.error = oldError;
    jest.clearAllMocks();
  });

  it("renders a button", () => {
    const element = document.createElement("fast-checkout-cart-button");
    document.body.appendChild(element);
    expect(element.shadowRoot?.querySelector("button")).toBeTruthy();
  });

  it("opens checkout with a cart_id", async (done) => {
    const app_id = "23r2df23f";
    const cart_id = "rdc33";
    const platform = "Woo";

    console.error = jest.fn();
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-cart-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);
    element.setAttribute("platform", platform);
    element.setAttribute("cart_id", cart_id);

    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();
    await waitForExpect(() => {
      expect(popupWindowSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(url`platform_cart_id=${cart_id}`),
          reloadOnClose: true,
        })
      );
    });
    done();
  });

  it("opens checkout with products", async (done) => {
    const app_id = "23r2df23f";
    const platform = "Woo";
    const products = [
      {
        product_id: "c32f2332f",
        variant_id: "f32v32f23",
        quantity: 5,
      },
    ];

    console.error = jest.fn();
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-cart-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);
    element.setAttribute("platform", platform);
    element.setAttribute("cart_data", JSON.stringify(products));

    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();

    const params = new URLSearchParams();
    params.append("app_id", app_id);
    params.append("platform", platform);
    params.append("version", VERSION);
    params.append("products", JSON.stringify(products));

    await waitForExpect(() => {
      expect(popupWindowSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(
            url`products=${JSON.stringify(products)}`
          ),
          reloadOnClose: true,
        })
      );
    });
    done();
  });

  it("handles CHECKOUT_ORDER_CREATED and POPUP_WINDOW_CLOSED messages", () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;
    form.appendChild(element);

    // Simulate order being created in Fast popup
    const orderCreatedEvent = new MessageEvent("message", {
      origin: process.env.CHECKOUT_URL,
      data: {
        type: "user_event",
        event: {
          buttonId: element.id,
          name: EventName.CHECKOUT_ORDER_CREATED,
        },
      },
    });
    window.dispatchEvent(orderCreatedEvent);

    // Button should have updated its internal tracker of order status
    expect(element.orderStatus).toEqual(OrderStatus.CREATED);
    // Simulate user closing popup
    const popupWindowClosedEvent = new MessageEvent("message", {
      origin: process.env.CHECKOUT_URL,
      data: {
        type: "user_event",
        event: {
          buttonId: element.id,
          name: EventName.POPUP_WINDOW_CLOSED,
        },
      },
    });
    window.dispatchEvent(popupWindowClosedEvent);

    expect(element.orderStatus).toEqual(OrderStatus.NONE);
  });

  it("handles CHECKOUT_ITEM_CANCELLED message", () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;
    form.appendChild(element);

    const itemCancelledEvent = new MessageEvent("message", {
      origin: process.env.CHECKOUT_URL,
      data: {
        type: "user_event",
        event: {
          buttonId: element.id,
          name: EventName.CHECKOUT_ITEM_CANCELLED,
        },
      },
    });
    window.dispatchEvent(itemCancelledEvent);
    expect(element.orderStatus).toEqual(OrderStatus.ITEM_CANCELLED);
  });

  it("handles CHECKOUT_ORDER_CANCELLED message", () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;
    form.appendChild(element);

    const itemCancelledEvent = new MessageEvent("message", {
      origin: process.env.CHECKOUT_URL,
      data: {
        type: "user_event",
        event: {
          buttonId: element.id,
          name: EventName.CHECKOUT_ORDER_CANCELLED,
        },
      },
    });
    window.dispatchEvent(itemCancelledEvent);
    expect(element.orderStatus).toEqual(OrderStatus.CANCELLED);
  });

  it("tracks a button view when the button is loaded", async () => {
    document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;

    // The logic that generates the event detail is tested in the next test 👇, so here we are just testing that it's a
    // view event.
    await waitForExpect(() => {
      expect(trackEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: Analytics.EventName.CART_CHECKOUT_BUTTON_VIEWED,
        })
      );
    });
  });

  it("tracks a button click when the button is clicked", async () => {
    const sampleCartData = [
      {
        product_id: "420",
        variant_id: "69",
        option_values: [
          {
            option_id: "color",
            option_value: "red",
          },
        ],
        quantity: "2",
      },
    ];

    const fastCheckoutCartButton = document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;
    fastCheckoutCartButton.app_id = "123";
    fastCheckoutCartButton.cart_id = "234";
    fastCheckoutCartButton.cart_data = JSON.stringify(sampleCartData);
    fastCheckoutCartButton.coupon_code = "FREE";

    fastCheckoutCartButton.click();

    await waitForExpect(() => {
      expect(trackEventSpy).toHaveBeenNthCalledWith(2, {
        eventName: Analytics.EventName.CART_CHECKOUT_BUTTON_CLICKED,
        appId: "123",
        details: {
          button_id: expect.any(String),
          // Normally a button has either cart_id OR cart_data, but whatever is available is provided, so we are testing
          // both here.
          merchant_cart_id: "234",
          cart_data: [
            {
              merchant_product_id: sampleCartData[0].product_id,
              merchant_variant_id: sampleCartData[0].variant_id,
              merchant_option_values: sampleCartData[0].option_values,
              quantity: sampleCartData[0].quantity,
            },
          ],
          coupon_codes: ["FREE"],
        },
      });
    });
  });

  it("forwards currency attribute to checkout", async () => {
    const fastCheckoutCartButton = document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;

    fastCheckoutCartButton.app_id = "123";
    fastCheckoutCartButton.currency = "USD";

    fastCheckoutCartButton.click();

    await waitForExpect(() => {
      expect(popupWindowSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("display_currency=USD"),
        })
      );
    });
  });

  it("does not open checkout if the button is clicked while disabled", async () => {
    const fastCheckoutCartButton = document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;

    fastCheckoutCartButton.app_id = "123";
    fastCheckoutCartButton.disabled = true;

    const openCheckoutSpy = jest.spyOn(fastCheckoutCartButton, "openCheckout");

    fastCheckoutCartButton.click();

    await waitForExpect(() => {
      expect(openCheckoutSpy).not.toHaveBeenCalled();
    });
  });

  it("opens checkout when a custom integration", () => {
    const app_id = "23r2df23f";
    const cart_id = "rdc33";
    const platform = "Wix";

    popupWindowSpy.mockImplementation(() => null);

    const listenerSpy = jest.fn();
    window.addEventListener("readytocheckout", listenerSpy);
    console.error = jest.fn();
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement(
      "fast-checkout-cart-button"
    ) as FastCheckoutCartButton;
    form.appendChild(element);
    element.app_id = app_id;
    element.platform = platform;

    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalled();
    window.dispatchEvent(
      new CustomEvent("opencheckout", {
        detail: { cart_id },
      })
    );
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`platform=${platform}`),
        reloadOnClose: true,
      })
    );

    expect(trackEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "Cart Checkout Button Failed",
      })
    );
    expect(
      document.body.contains(document.querySelector("fast-failure-backdrop"))
    ).toBeTruthy();

    window.removeEventListener("readytocheckout", listenerSpy);
  });
});
