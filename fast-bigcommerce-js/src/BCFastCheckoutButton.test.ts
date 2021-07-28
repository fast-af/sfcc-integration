import * as PopupWindow from "../../fast-components/utils/popupWindow";
import { VERSION } from "../../fast-js";
import * as Analytics from "../../fast-js/src/analytics";
import { BCFastCheckoutButton } from "./BCFastCheckoutButton";

declare global {
  interface Window {
    BCData: { product_attributes: { sku: string } };
  }
}

const popupWindowSpy = jest
  .spyOn(PopupWindow, "popupWindow")
  .mockImplementation(() => {
    return {} as Window;
  });

const sku = "r23f23d";
const app_id = "3b4929eb-7bb1-486a-b045-d0b40344ac38"; // dev
const sizeFieldName = "attribute[117]";
const XLFieldValue = "126";

const strip = (v: string) => v.replace("attribute[", "").replace("]", "");

describe("<BCFastCheckoutButton />", () => {
  customElements.define("fast-checkout-button", BCFastCheckoutButton);
  const oldError = console.error;

  jest.spyOn(Analytics, "trackEvent").mockImplementation(() => {
    return new Promise((resolve) => resolve());
  });

  beforeEach(() => {
    console.error = jest.fn();
  });

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

  it("shows an error if button is not within a form", () => {
    console.error = jest.fn();
    const element = document.createElement("fast-checkout-button");
    document.body.appendChild(element);
    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).toHaveBeenCalled();
  });

  it("opens checkout", () => {
    const multiFieldName = "attribute[5]";
    const optionValue = "77";

    window.BCData = { product_attributes: { sku } };

    const form = document.createElement("form");
    document.body.appendChild(form);

    const sizeDiv = document.createElement("div");
    sizeDiv.setAttribute("data-product-attribute", "size");

    // Checked Radio
    const XLField = document.createElement("input");
    XLField.type = "radio";
    XLField.name = sizeFieldName;
    XLField.value = XLFieldValue;
    XLField.required = true;
    XLField.checked = true;
    sizeDiv.appendChild(XLField);

    // Unchecked radio
    const XXLField = document.createElement("input");
    XXLField.type = "radio";
    XXLField.name = sizeFieldName;
    XXLField.value = "44";
    XXLField.checked = false;
    XXLField.required = true;

    sizeDiv.appendChild(XXLField);

    // Zeroed radio
    const zeroedField = document.createElement("input");
    zeroedField.type = "radio";
    zeroedField.name = sizeFieldName;
    zeroedField.value = "0";
    zeroedField.checked = false;
    zeroedField.required = true;

    sizeDiv.appendChild(zeroedField);

    form.appendChild(sizeDiv);

    const multiFieldDiv = document.createElement("div");
    multiFieldDiv.setAttribute("data-product-attribute", "multiField");

    // Multi-Select with one selected
    const multiField = document.createElement("select");
    multiField.multiple = true;
    multiField.name = multiFieldName;
    const option1 = document.createElement("option");
    option1.value = optionValue;
    option1.selected = true;
    multiField.appendChild(option1);
    const option2 = document.createElement("option");
    option2.selected = false;
    multiField.appendChild(option2);
    multiFieldDiv.appendChild(multiField);

    form.appendChild(multiFieldDiv);

    const multiField2Div = document.createElement("div");
    multiField2Div.setAttribute("data-product-attribute", "multiField2");

    // Multi-Select with none selected
    const multiField2 = document.createElement("select");
    multiField2.multiple = true;
    multiField2.name = "Mary";
    multiField2.value = "32";
    const option21 = document.createElement("option");
    option21.selected = false;
    multiField.appendChild(option1);
    const option22 = document.createElement("option");
    option22.selected = false;
    multiField2.appendChild(option2);
    multiField2Div.appendChild(multiField2);
    form.appendChild(multiField2Div);

    const singleSelectDiv = document.createElement("div");
    singleSelectDiv.setAttribute("data-product-attribute", "singleSelect");

    // Single-Select with none selected
    const singleSelect = document.createElement("select");
    singleSelect.multiple = false;
    singleSelect.name = "Celese";
    singleSelect.value = "34";
    const option31 = document.createElement("option");
    option31.selected = false;
    multiField.appendChild(option1);
    const option32 = document.createElement("option");
    option32.selected = false;
    singleSelect.appendChild(option2);
    singleSelectDiv.appendChild(singleSelect);

    form.appendChild(singleSelectDiv);

    // Button
    const button = document.createElement("button");
    form.appendChild(button);

    // Fast Button
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);

    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();

    expect(popupWindowSpy).toHaveBeenCalledWith({
      url:
        process.env.CHECKOUT_URL +
        "/checkout?" +
        new URLSearchParams({
          sku,
          platform: "bigcommerce",
          option_values: `${strip(sizeFieldName)},${XLFieldValue},${strip(
            multiFieldName
          )},${optionValue}`,
          app_id,
          button_id: element.id,
          version: VERSION,
        }).toString(),
      buttonId: element.id,
    });
  });

  it("does not open checkout if there are unchecked options and product has more than 2 options", () => {
    window.BCData = { product_attributes: { sku } };

    const form = document.createElement("form");
    document.body.appendChild(form);

    const sizeDiv = document.createElement("div");
    sizeDiv.setAttribute("data-product-attribute", "size");

    // Checked Radio
    const XLField = document.createElement("input");
    XLField.type = "radio";
    XLField.name = sizeFieldName;
    XLField.value = XLFieldValue;
    XLField.required = true;
    XLField.checked = true;
    sizeDiv.appendChild(XLField);

    // Unchecked radio
    const XXLField = document.createElement("input");
    XXLField.type = "radio";
    XXLField.name = sizeFieldName;
    XXLField.value = "44";
    XXLField.checked = false;
    XXLField.required = true;

    sizeDiv.appendChild(XXLField);

    form.appendChild(sizeDiv);

    const colorDiv = document.createElement("div");
    colorDiv.setAttribute("data-product-attribute", "color");

    // Checked Radio
    const redField = document.createElement("input");
    redField.type = "radio";
    redField.name = "color";
    redField.value = "red";
    redField.required = true;
    redField.checked = false;
    colorDiv.appendChild(redField);

    // Unchecked radio
    const blueField = document.createElement("input");
    blueField.type = "radio";
    blueField.name = "color";
    blueField.value = "blue";
    blueField.checked = true;
    blueField.required = true;

    colorDiv.appendChild(blueField);

    form.appendChild(colorDiv);

    // missing option
    const waistDiv = document.createElement("div");
    colorDiv.setAttribute("data-product-attribute", "waist");

    // Checked Radio
    const smallField = document.createElement("input");
    smallField.type = "radio";
    smallField.name = "waist";
    smallField.value = "small";
    smallField.required = true;
    smallField.checked = false;
    waistDiv.appendChild(smallField);

    // Unchecked radio
    const largeField = document.createElement("input");
    largeField.type = "radio";
    largeField.name = "waist";
    largeField.value = "small";
    largeField.checked = false;
    largeField.required = true;

    waistDiv.appendChild(largeField);

    form.appendChild(waistDiv);

    // Button
    const button = document.createElement("button");
    form.appendChild(button);

    // Fast Button
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);

    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();

    expect(popupWindowSpy).not.toHaveBeenCalled();
  });

  it("opens variant selection screen when there is an invalid field", () => {
    window.BCData = { product_attributes: { sku } };

    const form = document.createElement("form");
    document.body.appendChild(form);

    const sizeDiv = document.createElement("div");
    sizeDiv.setAttribute("data-product-attribute", "size");
    // Radio
    const XLField = document.createElement("input");
    XLField.type = "radio";
    XLField.name = sizeFieldName;
    XLField.value = XLFieldValue;
    XLField.checked = false;
    XLField.required = true;

    sizeDiv.appendChild(XLField);
    form.appendChild(sizeDiv);
    // Fast Button
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);

    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();

    expect(popupWindowSpy).toHaveBeenCalledWith({
      url:
        process.env.CHECKOUT_URL +
        "/checkout?" +
        new URLSearchParams({
          no_variant_selected: "true",
          sku,
          platform: "bigcommerce",
          option_values: "",
          app_id,
          button_id: element.id,
          version: VERSION,
        }).toString(),
      buttonId: element.id,
    });
  });

  it("opens variant selection screen when there is a field without a value", () => {
    window.BCData = { product_attributes: { sku } };

    const form = document.createElement("form");
    document.body.appendChild(form);

    const sizeDiv = document.createElement("div");
    sizeDiv.setAttribute("data-product-attribute", "size");
    // Radio
    const XLField = document.createElement("input");
    XLField.type = "radio";
    XLField.name = sizeFieldName;
    XLField.value = "";
    XLField.checked = false;
    XLField.required = true;

    sizeDiv.appendChild(XLField);
    form.appendChild(sizeDiv);

    // Fast Button
    const element = document.createElement("fast-checkout-button");
    form.appendChild(element);

    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();

    expect(popupWindowSpy).toHaveBeenCalledWith({
      url:
        process.env.CHECKOUT_URL +
        "/checkout?" +
        new URLSearchParams({
          no_variant_selected: "true",
          sku,
          platform: "bigcommerce",
          option_values: "",
          app_id,
          button_id: element.id,
          version: VERSION,
        }).toString(),
      buttonId: element.id,
    });
  });
});
