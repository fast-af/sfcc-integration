import * as PopupWindow from "../../../fast-components/utils/popupWindow";
import * as Analytics from "../analytics";
import { FastLoginButton } from "./FastLoginButton";

describe("<FastLoginButton />", () => {
  customElements.define("fast-login-button", FastLoginButton);
  const oldError = console.error;

  const popupWindowSpy = jest
    .spyOn(PopupWindow, "popupWindow")
    .mockImplementation(() => ({} as Window));

  const trackEventSpy = jest.spyOn(Analytics, "trackEvent").mockResolvedValue();

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    console.error = oldError;
    jest.clearAllMocks();
  });

  it("renders a button", () => {
    const element = document.createElement("fast-login-button");
    document.body.appendChild(element);
    expect(element.shadowRoot?.querySelector("button")).toBeTruthy();
  });

  it("opens login on click", () => {
    const app_id = "23r2df23f";

    console.error = jest.fn();

    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-login-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).not.toHaveBeenCalled();

    expect(popupWindowSpy).toHaveBeenCalledWith({
      isLogin: true,
      url: expect.stringContaining(`/login?app_id=${app_id}&origin=`),
    });
  });

  it("handles error when popup fails to open", () => {
    const app_id = "23r2df23f";
    popupWindowSpy.mockImplementation(() => null);

    console.error = jest.fn();

    const form = document.createElement("form");
    document.body.appendChild(form);
    const element = document.createElement("fast-login-button");
    form.appendChild(element);
    element.setAttribute("app_id", app_id);
    element.shadowRoot?.querySelector("button")?.click();
    expect(console.error).toHaveBeenCalled();

    expect(popupWindowSpy).toHaveBeenCalledWith({
      isLogin: true,
      url: expect.stringContaining(`/login?app_id=${app_id}&origin=`),
    });

    expect(trackEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "Login Button Failed",
      })
    );
    expect(document.querySelector("fast-failure-backdrop")).toBeTruthy();
  });
});
