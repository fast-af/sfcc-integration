/**
 *
 * @export
 * @interface V1ProductImage
 */
export interface V1ProductImage {
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  productId?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  description?: string;
  /**
   *
   * @type {boolean}
   * @memberof V1ProductImage
   */
  isThumbnail?: boolean;
  /**
   *
   * @type {number}
   * @memberof V1ProductImage
   */
  sortOrder?: number;
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  imageFile?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  urlStandard?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  urlThumbnail?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  urlTiny?: string;
  /**
   *
   * @type {string}
   * @memberof V1ProductImage
   */
  urlZoom?: string;
  /**
   *
   * @type {Date}
   * @memberof V1ProductImage
   */
  dateModified?: Date;
};
