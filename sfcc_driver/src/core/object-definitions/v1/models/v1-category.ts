import { V1CustomURL } from "./v1-custom-url";

/**
 *
 * @export
 * @interface V1Category
 */
export interface V1Category {
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  description?: string;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  name?: string;
  /**
   *
   * @type {Array&lt;string&gt;}
   * @memberof V1Category
   */
  metaKeywords?: string[];
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  defaultProductSort?: string;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  imageUrl?: string;
  /**
   *
   * @type {boolean}
   * @memberof V1Category
   */
  isVisible?: boolean;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  layoutFile?: string;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  metaDescription?: string;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  pageTitle?: string;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  parentId?: string;
  /**
   *
   * @type {string}
   * @memberof V1Category
   */
  searchKeywords?: string;
  /**
   *
   * @type {number}
   * @memberof V1Category
   */
  sortOrder?: number;
  /**
   *
   * @type {number}
   * @memberof V1Category
   */
  views?: number;
  /**
   *
   * @type {V1CustomURL}
   * @memberof V1Category
   */
  customUrl?: V1CustomURL;
};
