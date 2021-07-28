import {
  FastBackdrop,
  FastFailureBackdrop,
  FastLogin,
  FastLoginButton,
  FastLoginMobileBackdrop,
  FastMobileBackdrop,
  Timer,
} from "../../fast-js";
import { BCFastCheckoutButton } from "./BCFastCheckoutButton";
import { BCFastCheckoutCartButton } from "./BCFastCheckoutCartButton";

customElements.define("fast-checkout-button", BCFastCheckoutButton);
customElements.define("fast-checkout-cart-button", BCFastCheckoutCartButton);
customElements.define("fast-backdrop", FastBackdrop);
customElements.define("fast-mobile-backdrop", FastMobileBackdrop);
customElements.define("fast-login-mobile-backdrop", FastLoginMobileBackdrop);
customElements.define("fast-failure-backdrop", FastFailureBackdrop);

customElements.define("fast-login", FastLogin);
customElements.define("fast-login-button", FastLoginButton);
customElements.define("fast-timer", Timer);

export { Fast } from "../../fast-js";

declare global {
  interface Window {
    FAST_VERSION: string;
  }
}

window.FAST_VERSION = process.env.VERSION ?? "";
