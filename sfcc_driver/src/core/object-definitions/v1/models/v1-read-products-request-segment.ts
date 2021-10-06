import { V1SubResource } from "./v1-sub-resource";

/**
 *
 * @export
 * @interface V1ReadProductsRequestSegment
 */
export interface V1ReadProductsRequestSegment {
  /**
   *
   * @type {string}
   * @memberof V1ReadProductsRequestSegment
   */
  lastId?: string;
  /**
   *
   * @type {number}
   * @memberof V1ReadProductsRequestSegment
   */
  page?: number;
  /**
   *
   * @type {Array&lt;V1SubResource&gt;}
   * @memberof V1ReadProductsRequestSegment
   */
  subresourceIncludes?: V1SubResource[];
};
