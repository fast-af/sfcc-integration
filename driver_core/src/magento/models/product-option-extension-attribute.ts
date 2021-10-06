import BundleOption from "./bundle-option";
import ConfigurableItemOption from "./configurable-item-option";
import CustomOption from "./custom-option";
import DownloadableOption from "./downloadable-option";
import GiftcardItemOption from "./giftcard-item-option";

export default interface ProductOptionExtensionAttributes {
  /**
   * @interface {CustomOption[]}
   * @memberof ProductOptionExtensionAttributes
   */
  custom_options?: CustomOption[];

  /**
   * @interface {BundleOption[]}
   * @memberof ProductOptionExtensionAttributes
   */
  bundle_options?: BundleOption[];

  /**
   * @interface {DownloadableOption}
   * @memberof ProductOptionExtensionAttributes
   */
  downloadable_option?: DownloadableOption;

  /**
   * @interface {GiftcardItemOption}
   * @memberof ProductOptionExtensionAttributes
   */
  giftcard_item_option?: GiftcardItemOption;

  /**
   * @interface {ConfigurableItemOption[]}
   * @memberof ProductOptionExtensionAttributes
   */
  configurable_item_options?: ConfigurableItemOption[];
}
