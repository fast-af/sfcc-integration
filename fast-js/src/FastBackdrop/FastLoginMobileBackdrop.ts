import { EventName } from "../../../fast-components/FastJS/events";
import { eventNames } from "../FastCheckoutButton/FastCheckoutButton";
import { createBaseTemplate } from "./FastMobileBackdrop";
import { attributeNames } from "./Timer";

/**
 * Backdrop to show on the client's page when the login popup is active.
 * Shows a countdown timer and a button to hide the backdrop.
 */
export const FastLoginMobileBackdrop = class extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    const tmpl = createBaseTemplate(
      "60",
      "Open the login window to edit your login information, or ",
      "continue"
    );
    shadowRoot?.appendChild(tmpl.content.cloneNode(true));

    const keepShoppingLink = shadowRoot?.querySelector("#keepShopping");
    keepShoppingLink?.addEventListener("click", () => {
      this.dispatchEvent(new Event("removebackdrop"));
    });
  }

  connectedCallback() {
    window.addEventListener(eventNames.message, this.handleMessage.bind(this));
  }

  setRemainingTimeHandler() {
    const timer = this.shadowRoot?.querySelector("fast-timer") as HTMLElement;
    if (timer) {
      timer.style.display = "block";
      timer.setAttribute(attributeNames.time_remaining, (60).toString());
    }
  }

  disconnectedCallback() {
    window.removeEventListener(
      eventNames.message,
      this.handleMessage.bind(this)
    );
  }

  handleMessage(e: Event) {
    const event = (e as MessageEvent)?.data?.event;
    switch (event?.name) {
      case EventName.LOGIN_CHOOSE_INFO:
        this.setRemainingTimeHandler();
        break;
      default:
      // Do nothing
    }
  }

  get time_remaining() {
    return this.getAttribute(attributeNames.time_remaining) ?? "";
  }

  set time_remaining(val: string) {
    this.setAttribute(attributeNames.time_remaining, val);
  }
};
