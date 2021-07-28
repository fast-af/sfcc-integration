import { popupWindow } from "../../fast-components/utils/popupWindow";
import { getCheckoutBaseUrl } from "./config";

export const launchCheckout = (
  params: string,
  buttonId?: string,
  reloadOnClose?: boolean
) => {
  const url = new URL(`/checkout?${params}`, getCheckoutBaseUrl());
  return popupWindow({ url: url.toString(), buttonId, reloadOnClose });
};
