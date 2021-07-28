/* eslint-disable @typescript-eslint/naming-convention */
import {
  popupWindow,
  showFailureBackDrop,
  showMobileBackdrop,
} from "../../../fast-components/utils/popupWindow";
import { EventName, trackEvent } from "../analytics";
import { config, getCheckoutBaseUrl } from "../config";
import { generateUuid } from "../util";
import { buttonTemplate } from "./template";

const attributeNames = {
  app_id: "app_id",
};

export class FastLoginButton extends HTMLElement {
  popup?: Window | null;

  private uuid: string;

  constructor() {
    super();

    this.uuid = generateUuid();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));

    trackEvent({
      eventName: EventName.LOGIN_BUTTON_VIEWED,
      appId: this.app_id,
      details: {
        button_id: this.uuid,
      },
    });
  }

  connectedCallback() {
    this.addEventListener("click", this.handleClick);
    window.addEventListener("message", this.handleReceiveMessage.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("message", this.handleReceiveMessage.bind(this));
    window.removeEventListener("click", this.handleClick);
  }

  get app_id() {
    return this.getAttribute(attributeNames.app_id) ?? "";
  }

  set app_id(val: string) {
    this.setAttribute(attributeNames.app_id, val);
  }

  // When the button is clicked but it does not popup the window
  handleFailure() {
    trackEvent({
      eventName: EventName.LOGIN_BUTTON_FAILED,
      appId: this.app_id,
      details: {
        button_id: this.uuid,
      },
    });
    showFailureBackDrop();
  }

  handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    trackEvent({
      eventName: EventName.LOGIN_BUTTON_CLICKED,
      appId: this.app_id,
      details: {
        button_id: this.uuid,
      },
    });

    const url = new URL(
      `/login?app_id=${this.app_id}&origin=${encodeURIComponent(
        window.location.origin
      )}`,
      getCheckoutBaseUrl()
    );

    if (showMobileBackdrop() && this.popup) {
      this.popup?.postMessage("close", getCheckoutBaseUrl());

      // If there is no timeout, the new window is closed
      window.setTimeout(() => {
        this.popup = popupWindow({ url: url.toString(), isLogin: true });
        if (!this.popup) {
          console.error("could not open login window");
          this.handleFailure();
        }
      }, 100);
    } else {
      this.popup = popupWindow({ url: url.toString(), isLogin: true });
      if (!this.popup) {
        console.error("could not open checkout window");
        this.handleFailure();
      }
    }
  }

  handleReceiveMessage(event: MessageEvent) {
    if (event.origin !== config.checkoutUrl) {
      return;
    }

    if (event.data && event.data.type === "complete") {
      this.dispatchEvent(
        new CustomEvent("complete", {
          detail: {
            login_url: event.data.login_url,
            token: event.data.token,
          },
          bubbles: true,
          composed: true,
        })
      );

      if (event.data.login_url) {
        const fastHost = "www.fast.co";
        if (window.location.host === fastHost) {
          window.location.href = `/shop${event.data.login_url}`;
        } else {
          window.location.href = event.data.login_url;
        }
      }

      return;
    }

    const { type, ...rest } = event.data;
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: {
          ...rest,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}
