import { popupWindow } from "../../fast-components/utils/popupWindow";
import { mocked } from "ts-jest/utils";
import { launchCheckout } from "./launchCheckout";

jest.mock("fast-components/utils/popupWindow");
const mockedPopupWindow = mocked(popupWindow);

describe("launchCheckout", () => {
  it("should call popupWindow with checkout url and params", () => {
    const params =
      "app_id=app_id-test-123&productKey=productKey111&options[size]=XXL&options[text]=Awesome%20Dad&quantity=3";

    launchCheckout(params);

    expect(mockedPopupWindow).toHaveBeenCalledTimes(1);
    expect(mockedPopupWindow).toHaveBeenCalledWith({
      url: "https://example.local/checkout?app_id=app_id-test-123&productKey=productKey111&options[size]=XXL&options[text]=Awesome%20Dad&quantity=3",
    });
  });
});
