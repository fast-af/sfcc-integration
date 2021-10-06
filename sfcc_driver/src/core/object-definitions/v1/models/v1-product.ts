import { TypeMoney } from "./type-money";
import { V1Availability } from "./v1-availability";
import { V1Condition } from "./v1-condition";
import { V1CustomURL } from "./v1-custom-url";
import { V1ProductType } from "./v1-product-type";
import { V1Dimension } from "./v1-dimension";
import { V1ProductImage } from "./v1-product-image";
import { V1Variant } from "./v1-variant";
import { V1PriceRangeMap } from "./v1-price-range-map";
import { V1ProductModifier } from "./v1-product-modifier";

/**
 * Product is a portable representation of a product from any of our vendors
 * @export
 * @interface V1Product
 */
export interface V1Product {
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  sku?: string;
  /**
   *
   * @type {V1Availability}
   * @memberof V1Product
   */
  availability?: V1Availability;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  availabilityDescription?: string;
  /**
   *
   * @type {boolean}
   * @memberof V1Product
   */
  isVisible?: boolean;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  binPickingNumber?: string;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  brandId?: string;
  /**
   *
   * @type {Array&lt;number&gt;}
   * @memberof V1Product
   */
  categories?: number[];
  /**
   *
   * @type {V1Condition}
   * @memberof V1Product
   */
  condition?: V1Condition;
  /**
   *
   * @type {V1CustomURL}
   * @memberof V1Product
   */
  customUrl?: V1CustomURL;
  /**
   *
   * @type {TypeMoney}
   * @memberof V1Product
   */
  displayPrice?: TypeMoney;
  /**
   *
   * @type {TypeMoney}
   * @memberof V1Product
   */
  fixedCostShippingPrice?: TypeMoney;
  /**
   *
   * @type {boolean}
   * @memberof V1Product
   */
  isFreeShipping?: boolean;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  description?: string;
  /**
   *
   * @type {V1ProductType}
   * @memberof V1Product
   */
  type?: V1ProductType;
  /**
   *
   * @type {V1Dimension}
   * @memberof V1Product
   */
  dimension?: V1Dimension;
  /**
   *
   * @type {number}
   * @memberof V1Product
   */
  inventoryLevel?: number;
  /**
   *
   * @type {Array&lt;string&gt;}
   * @memberof V1Product
   */
  metaKeywords?: string[];
  /**
   *
   * @type {Array&lt;string&gt;}
   * @memberof V1Product
   */
  searchKeywords?: string[];
  /**
   *
   * @type {Array&lt;number&gt;}
   * @memberof V1Product
   */
  relatedProducts?: number[];
  /**
   *
   * @type {number}
   * @memberof V1Product
   */
  reviewsCount?: number;
  /**
   *
   * @type {number}
   * @memberof V1Product
   */
  reviewsRatingSum?: number;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  totalSold?: string;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  viewCount?: string;
  /**
   *
   * @type {V1ProductImage}
   * @memberof V1Product
   */
  primaryImage?: V1ProductImage;
  /**
   *
   * @type {Array&lt;V1Variant&gt;}
   * @memberof V1Product
   */
  variants?: V1Variant[];
  /**
   *
   * @type {Array&lt;V1ProductImage&gt;}
   * @memberof V1Product
   */
  images?: V1ProductImage[];
  /**
   *
   * @type {Array&lt;V1ProductModifier&gt;}
   * @memberof V1Product
   */
  modifiers?: V1ProductModifier[];
  /**
   *
   * @type {Date}
   * @memberof V1Product
   */
  dateCreated?: Date;
  /**
   *
   * @type {Date}
   * @memberof V1Product
   */
  dateModified?: Date;
  /**
   *
   * @type {string}
   * @memberof V1Product
   */
  inventoryTracking?: string;
  /**
   *
   * @type {{ [key, string]: TypeMoney;}}
   * @memberof V1Product
   */
  priceRange?: V1PriceRangeMap;
};
