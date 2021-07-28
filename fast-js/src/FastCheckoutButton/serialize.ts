/* eslint-disable dot-notation */

declare global {
  interface Window {
    BCData: {
      product_attributes: {
        sku: string;
      };
    };
  }
}

/*!
 * Serialize all form data into a SearchParams string
 * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return [{Invalid Fields}, {String}]     The serialized form data
 */
export const serialize: (form: HTMLFormElement) => [string[], string] = (
  form
) => {
  const arr = [];
  const invalidFields: string[] = [];
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
            arr.push(
              encodeURIComponent(field.name) +
                "=" +
                encodeURIComponent(option.value)
            );
          });
        return;
      }

      // If the field is marked as aria-required, treat it as if its actual required attribute is set.
      // We saw an issue on hardwood-lumber.com where their required fields only had the aria-required="true" attribute,
      // but not the regular required attribute. This fixes the wonkiness they encounter.
      const required =
        field.required ||
        field.attributes.getNamedItem("aria-required")?.value === "true";

      let valid = field?.validity?.valid;
      if (required && !field.value && field.value !== 0) {
        // If a field is required and its value is a falsey value other than zero, mark it as invalid. This might happen
        // if the field uses aria-required and not the normal required attribute
        valid = false;
      }

      if (required && !valid) {
        invalidFields.push(field.name);
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
      arr.push(
        encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
      );
    });
  // try to get SKU - BC hack for time
  // eslint-disable-next-line dot-notation
  const bcData = window["BCData"];
  const sku =
    bcData && bcData.product_attributes && bcData.product_attributes.sku;
  if (sku) {
    arr.push(`${encodeURIComponent("sku")}=${encodeURIComponent(sku)}`);
  }

  return [invalidFields, arr.join("&")];
};
