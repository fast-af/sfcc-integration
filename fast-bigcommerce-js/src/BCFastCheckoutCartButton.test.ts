import waitForExpect from "wait-for-expect";
import { EventName } from "../../fast-components/FastJS/events";
import * as PopupWindow from "../../fast-components/utils/popupWindow";
import url from "../../fast-components/utils/url";
import * as Analytics from "../../fast-js/src/analytics";
import { VERSION } from "../../fast-js/src/Fast";
import { OrderStatus } from "../../fast-js/src/FastCheckoutButton/FastCheckoutButton";
import { BCFastCheckoutCartButton } from "./BCFastCheckoutCartButton";

const popupWindowSpy = jest
  .spyOn(PopupWindow, "popupWindow")
  .mockImplementation(() => {
    return {} as Window;
  });

const cart_id = "rdc33";

const BCProducts = [
  {
    productId: "c32f2332f",
    variantId: "f32v32f23",
    quantity: 5,
    options: [
      { nameId: 45, valueId: 892 },
      { nameId: 32, valueId: 5 },
    ],
  },
];

const products = BCProducts.map((product) => ({
  product_id: product.productId,
  variant_id: product.variantId,
  quantity: product.quantity,
  option_values: product.options?.map((option) => ({
    option_id: option.nameId.toString(),
    option_value: option.valueId.toString(),
  })),
}));

const globalRef: any = global;
globalRef.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { id: cart_id, lineItems: { physicalItems: BCProducts } },
      ]),
  })
);

describe("<BCFastCheckoutCartButton />", () => {
  customElements.define("fast-checkout-cart-button", BCFastCheckoutCartButton);
  const oldError = console.error;

  jest.spyOn(Analytics, "trackEvent").mockImplementation(() => {
    return new Promise((resolve) => resolve());
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    console.error = oldError;
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete globalRef.fetch;
  });

  it("renders a button", () => {
    const element = document.createElement("fast-checkout-cart-button");
    document.body.appendChild(element);
    expect(element.shadowRoot?.querySelector("button")).toBeTruthy();
  });

  // INCIDENT-146
  it.skip("opens checkout with products from the API call", async (done) => {
    const app_id = "23r2df23f";

    console.error = jest.fn();
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-cart-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);

    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();

    const params = new URLSearchParams();
    params.append("app_id", app_id);
    params.append("platform", "bigcommerce");
    params.append("version", VERSION);
    params.append("products", JSON.stringify(products));

    await waitForExpect(() => {
      expect(popupWindowSpy).toHaveBeenCalledWith({
        buttonId: "",
        url: process.env.CHECKOUT_URL + `/checkout?${params.toString()}`,
        reloadOnClose: true,
      });
    });
    done();
  });

  it("opens checkout with cart id", async (done) => {
    const app_id = "23r2df23f";

    console.error = jest.fn();
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-cart-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);
    element.setAttribute("cart_id", cart_id);

    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();

    await waitForExpect(() => {
      expect(popupWindowSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(url`platform_cart_id=${cart_id}`),
        })
      );
    });
    done();
  });

  // INCIDENT-146
  it.skip("clears cart when order is complete", () => {
    const app_id = "23r2df23f";

    const form = document.createElement("form");
    document.body.appendChild(form);

    const fastCheckoutButton = document.createElement(
      "fast-checkout-cart-button"
    ) as BCFastCheckoutCartButton;
    form.appendChild(fastCheckoutButton);
    fastCheckoutButton.app_id = app_id;

    // Simulate order being created in Fast popup
    const orderCreatedEvent = new MessageEvent("message", {
      origin: process.env.CHECKOUT_URL,
      data: {
        type: "user_event",
        event: {
          name: EventName.CHECKOUT_ORDER_CREATED,
        },
      },
    });
    window.dispatchEvent(orderCreatedEvent);

    // Button should have updated its internal tracker of order status
    expect(fastCheckoutButton.orderStatus).toEqual(OrderStatus.CREATED);

    // Simulate user closing popup
    const popupWindowClosedEvent = new MessageEvent("message", {
      origin: process.env.CHECKOUT_URL,
      data: {
        type: "user_event",
        event: {
          name: EventName.POPUP_WINDOW_CLOSED,
        },
      },
    });
    window.dispatchEvent(popupWindowClosedEvent);

    // Window should be reloaded with URL paramater
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/storefront/carts/${cart_id}`),
      {
        method: "DELETE",
      }
    );
  });
});
