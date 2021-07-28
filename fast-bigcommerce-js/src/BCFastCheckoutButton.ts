import {
  EventName as EventServiceEventName,
  FastCheckoutButton,
  VERSION,
} from "../../fast-js";
import {
  CheckoutData,
  Params,
} from "../../fast-js/src/FastCheckoutButton/FastCheckoutButton";

export const mapData = (parsed: Record<string, any>) => {
  const platform = "bigcommerce";
  const product_id = parsed.product_id;
  const quantity = parsed["qty[]"];
  const sku = parsed.sku;

  const option_values: any[] = [];
  for (const [key, value] of Object.entries(parsed)) {
    if (key.startsWith("attribute[")) {
      const option_id = key.replace("attribute[", "").replace("]", "");
      const option_value = value;

      option_values.push([option_id, option_value]);
    }
  }

  return {
    product_id,
    sku,
    quantity,
    platform,
    option_values,
  };
};

export class BCFastCheckoutButton extends FastCheckoutButton {
  getCheckoutDataFromPage = (): CheckoutData => {
    const form = this.closest("form");

    if (!form) {
      console.error(
        "<fast-checkout-button> must be placed inside an HTML form."
      );
      return {
        params: {},
      };
    }

    const params: Params = {
      version: VERSION,
      platform: "bigcommerce",
    };

    const invalidFields: string[] = [];

    const requiredFormOptions = new Set();

    Array.prototype.slice
      .call(form.elements)
      .forEach((field: HTMLFormElement) => {
        if (
          !field.name ||
          field.disabled ||
          ["file", "reset", "submit", "button"].indexOf(field.type) > -1
        ) {
          return;
        }
        if (field.type === "select-multiple") {
          Array.prototype.slice
            .call(field.options)
            .forEach((option: HTMLOptionElement) => {
              if (!option.selected) return;
              params[field.name] = option.value;
            });
          return;
        }
        // If the field is marked as aria-required, treat it as if its actual required attribute is set.
        // We saw an issue on hardwood-lumber.com where their required fields only had the aria-required="true" attribute,
        // but not the regular required attribute. This fixes the wonkiness they encounter.
        const required =
          field.required ||
          field.attributes.getNamedItem("aria-required")?.value === "true";

        if (required) {
          requiredFormOptions.add(field.parentElement);

          // If a field is required and its value is a falsey value other than zero, mark it as invalid. This might happen
          // if the field uses aria-required and not the normal required attribute
          if (
            !field?.validity?.valid ||
            (!field.value && field.value !== "0")
          ) {
            invalidFields.push(field.name);
          }
        }

        if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked) {
          return;
        }
        if (field.type === "select-one" && !field.value) {
          // only encode a select if its value is set
          return;
        }

        if (field.type === "radio" && field.value === "0") {
          // only encode a radio if its value is not "0"
          // BigCommerce likes to use "0" for "None" radio options. Similar to an empty select
          return;
        }
        params[field.name] = field.value;
      });
    // try to get SKU - BC hack for time
    // eslint-disable-next-line dot-notation
    const bcData = window["BCData"];
    const sku =
      bcData && bcData.product_attributes && bcData.product_attributes.sku;
    if (sku) {
      params.sku = sku;
    }

    return {
      invalidFields,
      /*  TODO: variant selection screen gets wonky with more than 2 product options,
       when that changes, remove this */
      shouldOpenVariantSelection:
        invalidFields.length > 0 && requiredFormOptions.size <= 2,
      params: mapData(params),
    };
  };

  handleDataFailure() {
    // Override the default behavior to show the failure backdrop
    this.handleFailure(
      EventServiceEventName.PDP_CHECKOUT_BUTTON_FAILED_NO_DATA
    );
  }
}
