import Cookies from "js-cookie";

export const config = {
  apiUrl: process.env.API_URL ?? "https://api.dev.slow.dev",
  checkoutUrl: process.env.CHECKOUT_URL,
  localCheckoutUrl: "https://local.dev.slow.dev:3000",
  debugCookieName: "fast_debug",
};

export const getCheckoutBaseUrl = (): string => {
  return Cookies.get(config.debugCookieName)
    ? config.localCheckoutUrl
    : config.checkoutUrl ?? "";
};
