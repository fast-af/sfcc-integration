import { FastFailureBackdrop } from "./FastFailureBackdrop";

describe("<FastFailureBackdrop/>", () => {
  customElements.define("fast-failure-backdrop", FastFailureBackdrop);

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("renders a `Return to store` link", () => {
    const element = document.createElement("fast-failure-backdrop");
    document.body.appendChild(element);
    expect(element.shadowRoot?.querySelector(".cta")).toBeTruthy();
  });

  it("dispatches removebackdrop event", () => {
    const listenerSpy = jest.fn();
    const element = document.createElement("fast-failure-backdrop");
    document.body.appendChild(element);
    element.addEventListener("removebackdrop", listenerSpy);

    (element.shadowRoot?.querySelector(".cta") as HTMLElement).click();
    expect(listenerSpy).toHaveBeenCalled();
  });
});
