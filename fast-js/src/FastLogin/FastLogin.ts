/* eslint-disable @typescript-eslint/naming-convention */
import { config } from "../config";
import { template } from "./template";

const attributeNames = {
  app_id: "app_id",
};

export class FastLogin extends HTMLElement {
  constructor() {
    super();

    if (!config.checkoutUrl) {
      throw new Error("config.checkoutUrl missing :/");
    }

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    try {
      await this.injectButton();
    } catch (error) {
      console.error(error);
    }
  }

  get app_id() {
    return this.getAttribute(attributeNames.app_id) ?? "";
  }

  set app_id(val: string) {
    this.setAttribute(attributeNames.app_id, val);
  }

  async injectButton() {
    const container = this.shadowRoot?.querySelector("#container");
    const fastLoginButton = document.createElement("fast-login-button");
    fastLoginButton.setAttribute("app_id", this.app_id);
    fastLoginButton.addEventListener("complete", async () => {
      try {
        await this.injectButton();
      } catch (error) {
        console.error(error);
      }
    });

    if (!container) {
      console.error("container not found");
      return;
    }
    container.innerHTML = "";
    container.appendChild(fastLoginButton);
  }
}
