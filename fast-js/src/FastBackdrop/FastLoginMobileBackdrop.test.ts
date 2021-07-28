import { FastLoginMobileBackdrop } from "./FastLoginMobileBackdrop";

describe("<FastLoginMobileBackdrop/>", () => {
  customElements.define("fast-login-mobile-backdrop", FastLoginMobileBackdrop);
  const oldError = console.error;

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    console.error = oldError;
    jest.clearAllMocks();
  });

  it("renders a keep shopping link", () => {
    const element = document.createElement("fast-login-mobile-backdrop");
    document.body.appendChild(element);
    expect(element.shadowRoot?.querySelector("#keepShopping")).toBeTruthy();
  });

  it("dispatches removebackdrop event", () => {
    const listenerSpy = jest.fn();
    const element = document.createElement("fast-login-mobile-backdrop");
    document.body.appendChild(element);
    element.addEventListener("removebackdrop", listenerSpy);

    (element.shadowRoot?.querySelector("#keepShopping") as HTMLElement).click();
    expect(listenerSpy).toHaveBeenCalled();
  });
});
