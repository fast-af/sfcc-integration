import { V1SubResource } from "./v1-sub-resource";

/**
 *
 * @export
 * @interface V1ReadProductRequestSegment
 */
export interface V1ReadProductRequestSegment {
  /**
   *
   * @type {string}
   * @memberof V1ReadProductRequestSegment
   */
  productId?: string;
  /**
   *
   * @type {Array&lt;V1SubResource&gt;}
   * @memberof V1ReadProductRequestSegment
   */
  subresourceIncludes?: V1SubResource[];
};
