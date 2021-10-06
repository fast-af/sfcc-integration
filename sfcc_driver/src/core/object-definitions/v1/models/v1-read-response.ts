import { V1UUID } from "./v1-uuid";
import { V1EntityType } from "./v1-entity-type";
import { V1UserSegment } from "./v1-user-segment";
import { V1OrderResponseSegment } from "./v1-order-response-segment";
import { V1ReadShippingOptionSegment } from "./v1-read-shipping-option-segment";
import { V1ReadShippingZonesResponseSegment } from "./v1-read-shipping-zones-response-segment";
import { V1ReadProductResponseSegment } from "./v1-read-product-response-segment";
import { V1ReadCategoryResponseSegment } from "./v1-read-category-response-segment";
import { V1ReadOrdersResponseSegment } from "./v1-read-orders-response-segment";
import { V1ReadProductsResponseSegment } from "./v1-read-products-response-segment";
import { V1ReadCategoriesResponseSegment } from "./v1-read-categories-response-segment";

/**
 * -------------------------------- Start: Read Response -------------------------------- //
 * @export
 * @interface V1ReadResponse
 */
export interface V1ReadResponse {
  /**
   *
   * @type {V1UUID}
   * @memberof V1ReadResponse
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1EntityType}
   * @memberof V1ReadResponse
   */
  type?: V1EntityType;
  /**
   *
   * @type {V1OrderResponseSegment}
   * @memberof V1ReadResponse
   */
  order?: V1OrderResponseSegment;
  /**
   *
   * @type {V1ReadShippingOptionSegment}
   * @memberof V1ReadResponse
   */
  shippingOption?: V1ReadShippingOptionSegment;
  /**
   *
   * @type {V1UserSegment}
   * @memberof V1ReadResponse
   */
  user?: V1UserSegment;
  /**
   *
   * @type {V1ReadShippingZonesResponseSegment}
   * @memberof V1ReadResponse
   */
  shippingZones?: V1ReadShippingZonesResponseSegment;
  /**
   *
   * @type {V1ReadProductResponseSegment}
   * @memberof V1ReadResponse
   */
  product?: V1ReadProductResponseSegment;
  /**
   *
   * @type {V1ReadCategoryResponseSegment}
   * @memberof V1ReadResponse
   */
  category?: V1ReadCategoryResponseSegment;
  /**
   *
   * @type {Array&lt;V1ReadOrdersResponseSegment&gt;}
   * @memberof V1ReadResponse
   */
  orders?: V1ReadOrdersResponseSegment[];
  /**
   *
   * @type {Array&lt;V1ReadProductsResponseSegment&gt;}
   * @memberof V1ReadResponse
   */
  products?: V1ReadProductsResponseSegment[];
  /**
   *
   * @type {Array&lt;V1ReadCategoriesResponseSegment&gt;}
   * @memberof V1ReadResponse
   */
  categories?: V1ReadCategoriesResponseSegment[];
};
