import {
  FastBackdrop,
  FastLoginMobileBackdrop,
  FastMobileBackdrop,
  Timer,
} from "./FastBackdrop";
import { FastCheckoutButton } from "./FastCheckoutButton";
import { FastCheckoutCartButton } from "./FastCheckoutCartButton";
import { FastLogin } from "./FastLogin";
import { FastLoginButton } from "./FastLoginButton";

customElements.define("fast-checkout-button", FastCheckoutButton);
customElements.define("fast-checkout-cart-button", FastCheckoutCartButton);
customElements.define("fast-backdrop", FastBackdrop);
customElements.define("fast-mobile-backdrop", FastMobileBackdrop);
customElements.define("fast-login-mobile-backdrop", FastLoginMobileBackdrop);
customElements.define("fast-login", FastLogin);
customElements.define("fast-login-button", FastLoginButton);
customElements.define("fast-timer", Timer);

export * from "./Fast";

declare global {
  interface Window {
    FAST_VERSION: string;
  }
}

window.FAST_VERSION = process.env.VERSION ?? "";
