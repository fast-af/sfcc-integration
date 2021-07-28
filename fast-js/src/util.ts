import { CartCheckoutParams, ProductCheckoutParams } from "./Fast";

// Generates a UUID
// https://stackoverflow.com/a/2117523
export const generateUuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const isCartCheckoutParams = (
  params: CartCheckoutParams | ProductCheckoutParams
): params is CartCheckoutParams =>
  (params as CartCheckoutParams).cartId !== undefined &&
  (params as ProductCheckoutParams).products === undefined;

export const isProductCheckoutParams = (
  params: CartCheckoutParams | ProductCheckoutParams
): params is ProductCheckoutParams =>
  (params as ProductCheckoutParams).products !== undefined &&
  (params as CartCheckoutParams).cartId === undefined;

// Accepts parameters to fast.checkout() and returns an array of error messages
// If the return value is an empty array, then we are safe to launch checkout
export const validateCheckoutParams = (
  params: CartCheckoutParams | ProductCheckoutParams
): string[] => {
  const errors: string[] = [];
  // validate the BaseCheckoutParams fields

  if (!params.appId) {
    errors.push("appId is required.");
  } else if (typeof params.appId !== "string") {
    errors.push("appId must be a string.");
  }

  if (!params.buttonId) {
    errors.push("buttonId is required.");
  } else if (typeof params.buttonId !== "string") {
    errors.push("buttonId must be a string.");
  }

  // validate parameters based on sub-type
  if (isCartCheckoutParams(params)) {
    // validate the CartCheckoutParams fields

    // (we know cartId is defined here)
    if (typeof params.cartId !== "string") {
      errors.push("cartId must be a string.");
    }
  } else if (isProductCheckoutParams(params)) {
    // validate the ProductCheckoutParams fields

    // (we know products is defined here)
    if (!Array.isArray(params.products)) {
      errors.push("products must be an array.");
    } else if (params.products.length === 0) {
      errors.push("products cannot be empty.");
    } else {
      // validate each product
      params.products.forEach((product, productIdx) => {
        if (!product.id) {
          errors.push(`products[${productIdx}].id is required.`);
        } else if (typeof product.id !== "string") {
          errors.push(`products[${productIdx}].id must be a string.`);
        }

        if (product.variantId && typeof product.variantId !== "string") {
          errors.push(
            `products[${productIdx}].variantId must be a string if it is defined.`
          );
        }

        if (product.options && !Array.isArray(product.options)) {
          errors.push(
            `products[${productIdx}].options must be an array if it is defined.`
          );
        } else {
          // validate each option
          product.options?.forEach((option, optionIdx) => {
            if (!option.id) {
              errors.push(
                `products[${productIdx}].options[${optionIdx}].id is required.`
              );
            } else if (typeof option.id !== "string") {
              errors.push(
                `products[${productIdx}].options[${optionIdx}].id must be a string.`
              );
            }

            if (option.value === undefined) {
              errors.push(
                `products[${productIdx}].options[${optionIdx}].value is required.`
              );
            } else if (typeof option.value !== "string") {
              errors.push(
                `products[${productIdx}].options[${optionIdx}].value must be a string.`
              );
            }
          });
        }

        if (!product.quantity) {
          errors.push(`products[${productIdx}].quantity is required.`);
        } else if (!Number.isInteger(product.quantity)) {
          errors.push(
            `products[${productIdx}].quantity must be a whole number.`
          );
        } else if (product.quantity < 1) {
          errors.push(
            `products[${productIdx}].quantity must be greater than zero.`
          );
        }
      });
    }

    if (params.couponCode && typeof params.couponCode !== "string") {
      errors.push("couponCode must be a string if it is defined.");
    }

    // affiliateInfo must match the AffiliateInfo object if it is defined
    if (params.affiliateInfo) {
      if (!params.affiliateInfo.affiliates) {
        errors.push(
          "affiliateInfo.affiliates is required if affiliateInfo is defined."
        );
      } else if (!Array.isArray(params.affiliateInfo.affiliates)) {
        errors.push("affiliateInfo.affiliates must be an array.");
      } else if (params.affiliateInfo.affiliates.length === 0) {
        errors.push("affiliateInfo.affiliates cannot be empty.");
      } else {
        // validate each affiliate
        params.affiliateInfo.affiliates.forEach((affiliate, affiliateIdx) => {
          if (!affiliate.id) {
            errors.push(
              `affiliateInfo.affiliates[${affiliateIdx}].id is required.`
            );
          } else if (typeof affiliate.id !== "string") {
            errors.push(
              `affiliateInfo.affiliates[${affiliateIdx}].id must be a string.`
            );
          }
        });
      }
    }

    if (params.currency) {
      if (typeof params.currency !== "string") {
        errors.push("currency must be a string if it is defined.");
      }

      if (params.currency.length !== 3) {
        errors.push("currency must be a 3-letter currency code.");
      }
    }
  } else {
    // didn't match either type
    errors.push("Either cartId or products must be defined, but not both.");
  }

  return errors;
};
