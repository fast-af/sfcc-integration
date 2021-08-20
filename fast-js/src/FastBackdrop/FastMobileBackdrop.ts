import { EventName } from "../../../fast-components/FastJS/events";
import { eventNames } from "../FastCheckoutButton/FastCheckoutButton";
import { attributeNames } from "./Timer";

export const createBaseTemplate = (
  initialTime: string,
  message: string,
  buttonText: string
) => {
  const tmpl = document.createElement("template");
  tmpl.innerHTML = `
  <style>
    :host {
      display: block;
    }

    :host div.backdrop {
      z-index: 999;
      position: fixed; 
      top: -1000px; 
      bottom: -1000px; 
      left: -1000px; 
      right: -1000px;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    :host div.message {
      font-family: SF Pro Display, Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 20px;
      text-align: center;
      color: #FFFFFF;
      margin: auto;
      max-width: 99vw;
    }

    :host div.message .logo {
      margin-bottom: 32px;
    }

    :host div.message #keepShopping {
      color: #0286ff;
      text-decoration: underline;
      cursor: pointer;
      clear: both;
    }

    :host fast-timer {
        display: none;
    }
  </style>
  <div class="backdrop">
    <fast-timer initial_time="${initialTime}" ></fast-timer>
    <div class="message">
      <div class="logo">
        <img alt="Fast" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyIiBoZWlnaHQ9IjQzIiB2aWV3Qm94PSIwIDAgMTEyIDQzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMjcuMzcxOSA3LjE2NjY3SDguNTg3MjVWMTcuMTc2M0gyNC44NjczVjI0LjM0M0g4LjU4NzI1VjQyLjI4OTNIMFYzLjQzNTI2QzAgMi40MDg2MyAwLjM1NzgwMiAxLjU3OTQzIDEuMDczNDEgMC45NDc2NjFDMS43ODkwMSAwLjMxNTg4NyAyLjY0Mzc2IDAgMy42Mzc2NiAwSDI3LjM3MTlWNy4xNjY2N1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00Mi4xODk5IDExLjkwNUM0Ni4yMDUyIDExLjkwNSA0OS40MDU2IDEyLjk5MDggNTEuNzkwOSAxNS4xNjI1QzU0LjE3NjMgMTcuMjk0OCA1NS4zNjkgMjAuMzE1NCA1NS4zNjkgMjQuMjI0NVY0Mi4yODkzSDQ4LjIxMjlWMzguNDM5NEM0NS45NDY4IDQxLjQ3OTggNDIuNzI2NiA0MyAzOC41NTIzIDQzQzM1LjQ5MTEgNDMgMzMuMDA2MyA0Mi4xNzA4IDMxLjA5OCA0MC41MTI0QzI5LjIyOTUgMzguODE0NSAyOC4yOTUzIDM2LjU4MzYgMjguMjk1MyAzMy44MTk2QzI4LjI5NTMgMzAuNDIzOCAyOS42NjY4IDI3Ljk1NTkgMzIuNDEgMjYuNDE2QzM1LjE1MzEgMjQuODM2NSAzOC42MzE4IDI0LjA0NjggNDIuODQ1OSAyNC4wNDY4QzQ0LjYzNDkgMjQuMDQ2OCA0Ni4zMjQ1IDI0LjE2NTMgNDcuOTE0NyAyNC40MDIyVjIzLjk4NzZDNDcuOTE0NyAyMi4xMzE4IDQ3LjMzODMgMjAuNzMgNDYuMTg1NCAxOS43ODI0QzQ1LjAzMjQgMTguNzk1MiA0My41MDE5IDE4LjMwMTcgNDEuNTkzNiAxOC4zMDE3QzM4LjQ5MjYgMTguMzAxNyAzNS40NzEyIDE5LjQyNyAzMi41MjkzIDIxLjY3NzdMMjkuMDcwNSAxNi42NDMzQzMyLjQ0OTcgMTMuNDg0NCAzNi44MjI5IDExLjkwNSA0Mi4xODk5IDExLjkwNVpNNDAuNTIwMiAzNy4wMTc5QzQyLjY2NyAzNy4wMTc5IDQ0LjM5NjQgMzYuMjg3NCA0NS43MDgzIDM0LjgyNjRDNDcuMDIwMiAzMy4zNjU1IDQ3Ljc1NTcgMzEuNDcwMiA0Ny45MTQ3IDI5LjE0MDVDNDYuMzY0MyAyOS4wMjIgNDQuODczNCAyOC45NjI4IDQzLjQ0MjIgMjguOTYyOEMzOC43MTEzIDI4Ljk2MjggMzYuMzQ1OCAzMC40MDQgMzYuMzQ1OCAzMy4yODY1QzM2LjM0NTggMzQuMzkyMSAzNi43MjM1IDM1LjMwMDMgMzcuNDc4OCAzNi4wMTFDMzguMjM0MiAzNi42ODIzIDM5LjI0OCAzNy4wMTc5IDQwLjUyMDIgMzcuMDE3OVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik03Mi4zMDczIDQyLjk0MDhDNjcuMTM5IDQyLjk0MDggNjIuOTg0NSA0MS40NDAzIDU5Ljg0MzggMzguNDM5NEw2My4wNjQgMzMuMzQ1N0M2NS45NjYyIDM1LjY3NTQgNjguOTI4IDM2Ljg0MDIgNzEuOTQ5NSAzNi44NDAyQzczLjI2MTQgMzYuODQwMiA3NC4zNTQ3IDM2LjU4MzYgNzUuMjI5MyAzNi4wNzAyQzc2LjE0MzcgMzUuNTU2OSA3Ni42MDA5IDM0Ljg0NjIgNzYuNjAwOSAzMy45MzhDNzYuNjAwOSAzMy42MjIxIDc2LjU0MTIgMzMuMzI2IDc2LjQyMiAzMy4wNDk2Qzc2LjMwMjcgMzIuNzczMiA3Ni4xMDM5IDMyLjUxNjUgNzUuODI1NiAzMi4yNzk2Qzc1LjU4NzEgMzIuMDQyNyA3NS4zNDg2IDMxLjg0NTMgNzUuMTEgMzEuNjg3M0M3NC44NzE1IDMxLjUyOTQgNzQuNTEzNyAzMS4zNTE3IDc0LjAzNjYgMzEuMTU0M0M3My41NTk2IDMwLjk1NjggNzMuMTYyIDMwLjgxODYgNzIuODQ0IDMwLjczOTdDNzIuNTY1NyAzMC42MjEyIDcyLjEwODUgMzAuNDYzMyA3MS40NzI0IDMwLjI2NThDNzAuODc2IDMwLjA2ODQgNzAuNDM4NyAyOS45MzAyIDcwLjE2MDQgMjkuODUxMkM2Ny4zNzc1IDI4LjkwMzYgNjUuMjMwNyAyNy43OTggNjMuNzIgMjYuNTM0NEM2Mi4yNDkgMjUuMjcwOSA2MS41MTM2IDIzLjQ5NCA2MS41MTM2IDIxLjIwMzlDNjEuNTEzNiAxOC4yODE5IDYyLjYyNjcgMTYuMDExNSA2NC44NTMgMTQuMzkyNkM2Ny4xMTkxIDEyLjczNDIgNzAuMDIxMyAxMS45MDUgNzMuNTU5NiAxMS45MDVDNzcuODUzMiAxMS45MDUgODEuNTkwMiAxMy4wNSA4NC43NzA3IDE1LjM0MDJMODEuNjY5NyAyMC4zNzQ3Qzc4LjkyNjYgMTguNzE2MyA3Ni4zNDI1IDE3Ljg4NzEgNzMuOTE3NCAxNy44ODcxQzcyLjYwNTQgMTcuODg3MSA3MS41NTE5IDE4LjE0MzcgNzAuNzU2OCAxOC42NTdDNjkuOTYxNyAxOS4xMzA5IDY5LjU2NDEgMTkuNzYyNiA2OS41NjQxIDIwLjU1MjNDNjkuNTY0MSAyMS4xODQxIDY5Ljg2MjMgMjEuNzU2NyA3MC40NTg2IDIyLjI3QzcxLjA1NDkgMjIuNzQzOCA3MS41OTE3IDIzLjA3OTQgNzIuMDY4NyAyMy4yNzY5QzcyLjU4NTUgMjMuNDM0OCA3My40OTk5IDIzLjczMDkgNzQuODExOSAyNC4xNjUzQzc2LjE2MzYgMjQuNTk5NiA3Ny4xNTc1IDI0LjkzNTMgNzcuNzkzNiAyNS4xNzIyQzc4LjQ2OTQgMjUuNDA5MSA3OS4zNjM5IDI1LjgyMzcgODAuNDc3MSAyNi40MTZDODEuNTkwMiAyNi45Njg4IDgyLjQwNTIgMjcuNTQxMyA4Mi45MjIxIDI4LjEzMzZDODMuNDc4NiAyOC42ODY0IDgzLjk3NTYgMjkuNDM2NiA4NC40MTI5IDMwLjM4NDNDODQuODUwMiAzMS4yOTI1IDg1LjA2ODkgMzIuMzE5MSA4NS4wNjg5IDMzLjQ2NDJDODUuMDY4OSAzNi40MjU2IDgzLjgzNjQgMzguNzU1MyA4MS4zNzE2IDQwLjQ1MzJDNzguOTA2NyA0Mi4xMTE2IDc1Ljg4NTMgNDIuOTQwOCA3Mi4zMDczIDQyLjk0MDhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTA5LjQzNiAzNC4xNzQ5TDExMiAzOS45MjAxQzEwOS4zMzYgNDEuOTMzOSAxMDYuMjE2IDQyLjk0MDggMTAyLjYzOCA0Mi45NDA4Qzk5LjQxNzMgNDIuOTQwOCA5Ni45MTI3IDQxLjk5MzEgOTUuMTIzNyA0MC4wOTc4QzkzLjMzNDYgMzguMjAyNSA5Mi40NDAxIDM1LjUzNzIgOTIuNDQwMSAzMi4xMDE5VjE4LjI0MjRIODcuOTY3NlYxMi42NzQ5SDkyLjQ0MDFWMy40OTQ0OUgxMDAuNTVWMTIuNjc0OUgxMTAuMjExVjE4LjI0MjRIMTAwLjU1VjMxLjM5MTJDMTAwLjU1IDMyLjk3MDYgMTAwLjk0OCAzNC4wOTYgMTAxLjc0MyAzNC43NjcyQzEwMi41NzggMzUuNDM4NSAxMDMuNTUyIDM1Ljc3NDEgMTA0LjY2NSAzNS43NzQxQzEwNi4yMTYgMzUuNzc0MSAxMDcuODA2IDM1LjI0MSAxMDkuNDM2IDM0LjE3NDlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" />
      </div>
      <div>
        <p>${message}</p>
        <p>
          <a
            id="keepShopping"
          >
            ${buttonText}
          </a>
        </p>
      </div>
    </div>
  </div>
`;

  return tmpl;
};

/**
 * Backdrop to show on the seller's page when the checkout popup is active.
 * Shows a countdown timer and a button to hide the backdrop.
 */
export const FastMobileBackdrop = class extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    const tmpl = createBaseTemplate(
      "300",
      "Open the checkout window to modify or review your order, or ",
      "keep shopping"
    );
    shadowRoot.appendChild(tmpl.content.cloneNode(true));

    const keepShoppingLink = shadowRoot.querySelector("#keepShopping");
    keepShoppingLink?.addEventListener("click", () => {
      this.dispatchEvent(new Event("removebackdrop"));
    });
  }

  connectedCallback() {
    window.addEventListener(eventNames.message, this.handleMessage.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener(
      eventNames.message,
      this.handleMessage.bind(this)
    );
  }

  setRemainingTimeHandler(checkout_time: string) {
    const time_remaining =
      new Date(checkout_time).getTime() - new Date().getTime();
    const timer = this.shadowRoot?.querySelector("fast-timer") as HTMLElement;
    timer.style.display = "block";
    timer.setAttribute(
      attributeNames.time_remaining,
      (time_remaining / 1000).toString()
    );
  }

  handleMessage(e: Event) {
    const event = (e as MessageEvent)?.data?.event;
    switch (event?.name) {
      case EventName.CHECKOUT_ORDER_CREATED:
      case EventName.CHECKOUT_ORDER_UPDATED:
        this.setRemainingTimeHandler(event?.properties?.checkout_time);
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