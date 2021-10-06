import BundleOption from "./bundle-option";
import ConfigurableItemOption from "./configurable-item-option";
import CustomOption from "./custom-option";
import DownloadableOption from "./downloadable-option";
import GiftcardItemOption from "./giftcard-item-option";

export interface OrderItemProductOptionExtensionAttributes {
  custom_options?: CustomOption[];
  bundle_options?: BundleOption[];
  downloadable_option?: DownloadableOption;
  giftcard_item_option?: GiftcardItemOption;
  configurable_item_options?: ConfigurableItemOption[];
}
