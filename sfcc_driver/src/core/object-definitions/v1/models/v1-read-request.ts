import { V1UUID } from "./v1-uuid";
import { V1EntityType } from "./v1-entity-type";
import { V1ReadOrderRequestSegment } from "./v1-read-order-request-segment";
import { V1ReadShippingOptionSegment } from "./v1-read-shipping-option-segment";
import { V1ReadUserRequestSegment } from "./v1-read-user-request-segment";
import { V1ReadShippingZonesRequestSegment } from "./v1-read-shipping-zones-request-segment";
import { V1ReadProductRequestSegment } from "./v1-read-product-request-segment";
import { V1ReadCategoryRequestSegment } from "./v1-read-category-request-segment";
import { V1ReadOrdersRequestSegment } from "./v1-read-orders-request-segment";
import { V1ReadProductsRequestSegment } from "./v1-read-products-request-segment";
import { V1ReadCategoriesRequestSegment } from "./v1-read-categories-request-segment";
/**
 * -------------------------------- Start: Read Request -------------------------------- //
 * @export
 * @interface V1ReadRequest
 */
export interface V1ReadRequest {
  /**
   *
   * @type {string}
   * @memberof V1ReadRequest
   */
  appId?: string;
  /**
   *
   * @type {V1UUID}
   * @memberof V1ReadRequest
   */
  requestId?: V1UUID;
  /**
   *
   * @type {V1EntityType}
   * @memberof V1ReadRequest
   */
  type?: V1EntityType;
  /**
   *
   * @type {V1ReadOrderRequestSegment}
   * @memberof V1ReadRequest
   */
  order?: V1ReadOrderRequestSegment;
  /**
   *
   * @type {V1ReadShippingOptionSegment}
   * @memberof V1ReadRequest
   */
  shippingOption?: V1ReadShippingOptionSegment;
  /**
   *
   * @type {V1ReadUserRequestSegment}
   * @memberof V1ReadRequest
   */
  user?: V1ReadUserRequestSegment;
  /**
   *
   * @type {V1ReadShippingZonesRequestSegment}
   * @memberof V1ReadRequest
   */
  shippingZones?: V1ReadShippingZonesRequestSegment;
  /**
   *
   * @type {V1ReadProductRequestSegment}
   * @memberof V1ReadRequest
   */
  product?: V1ReadProductRequestSegment;
  /**
   *
   * @type {V1ReadCategoryRequestSegment}
   * @memberof V1ReadRequest
   */
  category?: V1ReadCategoryRequestSegment;
  /**
   *
   * @type {V1ReadOrdersRequestSegment}
   * @memberof V1ReadRequest
   */
  orders?: V1ReadOrdersRequestSegment;
  /**
   *
   * @type {V1ReadProductsRequestSegment}
   * @memberof V1ReadRequest
   */
  products?: V1ReadProductsRequestSegment;
  /**
   *
   * @type {V1ReadCategoriesRequestSegment}
   * @memberof V1ReadRequest
   */
  categories?: V1ReadCategoriesRequestSegment;
}
