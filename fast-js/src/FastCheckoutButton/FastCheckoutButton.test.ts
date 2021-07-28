import * as PopupWindow from "../../../fast-components/utils/popupWindow";
import url from "../../../fast-components/utils/url";
import waitForExpect from "wait-for-expect";
import * as Analytics from "../analytics";
import { VERSION } from "../Fast";
import { FastCheckoutButton } from "./FastCheckoutButton";

describe("<FastCheckoutButton />", () => {
  customElements.define("fast-checkout-button", FastCheckoutButton);
  const oldError = console.error;

  const sampleCheckoutData = {
    params: {
      product_id: "420",
      variant_id: "69",
      option_values: [["color", "red"]],
      quantity: 2,
    },
  };

  const popupWindowSpy = jest
    .spyOn(PopupWindow, "popupWindow")
    .mockImplementation(() => ({} as Window));

  const trackEventSpy = jest.spyOn(Analytics, "trackEvent").mockResolvedValue();

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    console.error = oldError;
    jest.clearAllMocks();
  });

  it("renders a button", () => {
    const element = document.createElement("fast-checkout-button");
    document.body.appendChild(element);
    expect(element.shadowRoot?.querySelector("button")).toBeTruthy();
  });

  it("opens checkout when a direct integration", () => {
    const sku = "r23f23d";
    const app_id = "23r2df23f";
    const listenerSpy = jest.fn();

    window.addEventListener("readytocheckout", listenerSpy);
    console.error = jest.fn();

    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();

    expect(console.error).not.toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalled();

    window.dispatchEvent(
      new CustomEvent("opencheckout", {
        detail: { invalidFields: [], formParams: { sku } },
      })
    );
    expect(popupWindowSpy).toHaveBeenCalledWith({
      url:
        process.env.CHECKOUT_URL +
        url`/checkout?sku=${sku}&app_id=${app_id}&button_id=${element.id}&version=${VERSION}`,
      buttonId: element.id,
    });

    // track event. In case this wasn't meant to be direct
    expect(trackEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: Analytics.EventName.PDP_CHECKOUT_BUTTON_FAILED_NO_DATA,
      })
    );
    // do not show backdrop
    expect(
      document.body.contains(document.querySelector("fast-failure-backdrop"))
    ).toBeFalsy();

    window.removeEventListener("readytocheckout", listenerSpy);
  });

  it("shows and hides tooltip", () => {
    const sku = "r23f23d";
    const app_id = "23r2df23f";
    const listenerSpy = jest.fn();
    window.addEventListener("readytocheckout", listenerSpy);
    console.error = jest.fn();
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;
    form.appendChild(element);
    element.setAttribute("custom", "true");
    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalled();
    window.dispatchEvent(
      new CustomEvent("opencheckout", {
        detail: { invalidFields: ["size"], formParams: { sku } },
      })
    );
    expect(popupWindowSpy).not.toHaveBeenCalled();
    expect(element.invalid).toBeTruthy();

    document.body.click();
    expect(element.invalid).toBeFalsy();
    window.removeEventListener("readytocheckout", listenerSpy);
  });

  // This test doesn't do everything due to security restrictions
  it("handles a message", () => {
    const app_id = "23r2df23f";
    const listenerSpy = jest.fn();
    window.addEventListener("message", listenerSpy);
    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);
    element.setAttribute("custom", "true");
    element.setAttribute("app_id", app_id);
    window.dispatchEvent(
      new CustomEvent("message", {
        detail: "Hello",
      })
    );
    expect(listenerSpy).toHaveBeenCalled();
    window.removeEventListener("message", listenerSpy);
  });

  it("tracks a button view when the button is loaded", () => {
    // We can't make a fast-checkout-button with document.createElement AND give it attributes like app_id before the
    // constructor is called. Making the button this way does work, though.
    const div = document.createElement("div");
    div.innerHTML = `
      <fast-checkout-button app_id="123"></fast-checkout-button>
    `;

    expect(trackEventSpy).toHaveBeenCalledWith({
      eventName: Analytics.EventName.PDP_CHECKOUT_BUTTON_VIEWED,
      appId: "123",
      details: expect.objectContaining({
        button_id: expect.any(String),
      }),
    });
  });

  it("tracks a button click when the button is clicked", () => {
    const fastCheckoutButton = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;

    fastCheckoutButton.app_id = "123";

    jest
      .spyOn(fastCheckoutButton, "getCheckoutData")
      .mockReturnValueOnce(sampleCheckoutData);

    fastCheckoutButton.click();

    // first track was the button view, second one is the click
    expect(trackEventSpy).toHaveBeenNthCalledWith(2, {
      eventName: Analytics.EventName.PDP_CHECKOUT_BUTTON_CLICKED,
      appId: "123",
      details: {
        button_id: expect.any(String),
        merchant_product_id: sampleCheckoutData.params.product_id,
        merchant_variant_id: sampleCheckoutData.params.variant_id,
        merchant_option_values: [
          {
            option_id: sampleCheckoutData.params.option_values[0][0],
            option_value: sampleCheckoutData.params.option_values[0][1],
          },
        ],
        quantity: sampleCheckoutData.params.quantity,
      },
    });
  });

  it("forwards currency attribute to checkout", () => {
    const fastCheckoutButton = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;

    fastCheckoutButton.app_id = "123";
    fastCheckoutButton.currency = "USD";

    jest
      .spyOn(fastCheckoutButton, "getCheckoutData")
      .mockReturnValue(sampleCheckoutData);

    fastCheckoutButton.click();

    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("display_currency=USD"),
      })
    );
  });

  it("currency attribute values get properly encoded to url parameters to prevent injection", () => {
    const fastCheckoutButton = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;

    fastCheckoutButton.app_id = "123";
    fastCheckoutButton.currency = "USD&hacked=true";

    jest
      .spyOn(fastCheckoutButton, "getCheckoutData")
      .mockReturnValue(sampleCheckoutData);

    fastCheckoutButton.click();

    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("display_currency=USD%26hacked%3Dtrue"),
      })
    );
  });

  it("does not open checkout if the button is clicked while disabled", () => {
    const fastCheckoutButton = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;

    fastCheckoutButton.app_id = "123";
    fastCheckoutButton.disabled = true;

    const getCheckoutDataSpy = jest.spyOn(
      fastCheckoutButton,
      "getCheckoutData"
    );

    fastCheckoutButton.click();

    expect(getCheckoutDataSpy).not.toHaveBeenCalled();
  });

  it("handles error when opening popup", () => {
    const sku = "r23f23d";
    const app_id = "23r2df23f";
    const listenerSpy = jest.fn();
    popupWindowSpy.mockImplementation(() => null);

    window.addEventListener("readytocheckout", listenerSpy);
    console.error = jest.fn();

    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalled();

    window.dispatchEvent(
      new CustomEvent("opencheckout", {
        detail: { invalidFields: [], formParams: { sku } },
      })
    );
    expect(popupWindowSpy).toHaveBeenCalledWith({
      url:
        process.env.CHECKOUT_URL +
        url`/checkout?sku=${sku}&app_id=${app_id}&button_id=${element.id}&version=${VERSION}`,
      buttonId: element.id,
    });

    expect(trackEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: Analytics.EventName.PDP_CHECKOUT_BUTTON_FAILED_NO_DATA,
      })
    );
    expect(
      document.body.contains(document.querySelector("fast-failure-backdrop"))
    ).toBeTruthy();

    window.removeEventListener("readytocheckout", listenerSpy);
  });

  it("handles error when app_id is missing", async () => {
    const sku = "r23f23d";
    const listenerSpy = jest.fn();

    window.addEventListener("readytocheckout", listenerSpy);
    console.error = jest.fn();

    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);
    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalled();

    window.dispatchEvent(
      new CustomEvent("opencheckout", {
        detail: { invalidFields: [], formParams: { sku } },
      })
    );

    await waitForExpect(() => {
      expect(trackEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: Analytics.EventName.PDP_CHECKOUT_BUTTON_FAILED_NO_APP_ID,
        })
      );
    });
    expect(
      document.body.contains(document.querySelector("fast-failure-backdrop"))
    ).toBeTruthy();

    window.removeEventListener("readytocheckout", listenerSpy);
  });

  it("opens checkout when provided a product_id attribute", () => {
    const productId = "420";

    const fastCheckoutButton = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;
    fastCheckoutButton.app_id = "123";
    fastCheckoutButton.setAttribute("product_id", productId);

    jest.spyOn(fastCheckoutButton, "getCheckoutDataFromPage");

    fastCheckoutButton.click();

    // When product_id attribute is provided, the getCheckoutDataFromPage should be ignored
    expect(fastCheckoutButton.getCheckoutDataFromPage).not.toHaveBeenCalled();

    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`product_id=${productId}`),
      })
    );

    // variant_id and option_values should _not_ be in the url
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.not.stringContaining("variant_id"),
      })
    );
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.not.stringContaining("option_values"),
      })
    );
  });

  it("opens checkout when provided all of the product-defining attributes", () => {
    const productId = "420";
    const variantId = "69";
    const productOptions = {
      color: "blue",
      size: "xxxl",
    };
    const quantity = "5";

    const fastCheckoutButton = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;
    fastCheckoutButton.app_id = "3b4929eb-7bb1-486a-b045-d0b40344ac38";
    fastCheckoutButton.setAttribute("product_id", productId);
    fastCheckoutButton.setAttribute("variant_id", variantId);
    fastCheckoutButton.setAttribute(
      "product_options",
      JSON.stringify(productOptions)
    );
    fastCheckoutButton.setAttribute("quantity", quantity);

    fastCheckoutButton.click();

    // All of the above fields should be present in the URL
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`product_id=${productId}`),
      })
    );
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`variant_id=${variantId}`),
      })
    );
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          // entries.flat.join mimics what URLSearchParams does when you give it a nested array
          url`option_values=${Object.entries(productOptions).flat().join(",")}`
        ),
      })
    );
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`quantity=${quantity}`),
      })
    );

    expect(popupWindowSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`no_variant_selected=true`),
      })
    );
  });

  it("opens variant selection when product options are not provided", () => {
    const productId = "420";
    const quantity = "5";

    const fastCheckoutButton = document.createElement(
      "fast-checkout-button"
    ) as FastCheckoutButton;
    fastCheckoutButton.app_id = "3b4929eb-7bb1-486a-b045-d0b40344ac38";
    fastCheckoutButton.setAttribute("product_id", productId);

    fastCheckoutButton.setAttribute("quantity", quantity);

    fastCheckoutButton.click();

    // All of the above fields should be present in the URL
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`product_id=${productId}`),
      })
    );

    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`quantity=${quantity}`),
      })
    );

    expect(popupWindowSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`option_values=`),
      })
    );
    // redirects to variant selection
    expect(popupWindowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(url`no_variant_selected=true`),
      })
    );
  });
});
