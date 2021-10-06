import { V1Category } from "./v1-category";

/**
 *
 * @export
 * @interface V1ReadCategoriesResponseSegment
 */
export interface V1ReadCategoriesResponseSegment {
  /**
   *
   * @type {string}
   * @memberof V1ReadCategoriesResponseSegment
   */
  appId?: string;
  /**
   *
   * @type {Array&lt;V1Category&gt;}
   * @memberof V1ReadCategoriesResponseSegment
   */
  categories?: V1Category[];
  /**
   *
   * @type {string}
   * @memberof V1ReadCategoriesResponseSegment
   */
  lastId?: string;
  /**
   *
   * @type {boolean}
   * @memberof V1ReadCategoriesResponseSegment
   */
  moreResults?: boolean;
};
