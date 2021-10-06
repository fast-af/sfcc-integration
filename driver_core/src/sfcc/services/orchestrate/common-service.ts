import OCAPI from "sfcc-ocapi-documents";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import ProductService from "../api/product-service";

/**
 * Common implementation class for Create and
 * Update Services.
 */
export default class CommonService {
  /**
   * Get modified basket with product image urls.
   * 
   * @param basket {OCAPI.Basket} - SFCC Basket document.
   * @param token {string} - SFCC bearer token.
   * @returns {Promise<EcommObject>} - a modified basket object.
   */
  protected async getBasketWithImageUrls(basket: OCAPI.Basket | OCAPI.Order, token: string): Promise<EcommObject> {
    // Need the imageUrl to be included.
    if (basket.product_items) {
      const productService = new ProductService(token);
      // Get product ids.
      const productIds = basket.product_items.flatMap(item => item.product_id);
      // Get new product items with product image url.
      const productItems = await productService.getModifiedProductItems(productIds as string[], basket.product_items);
      // Since new line item objects need to be initialized,
      // original value to be reset.
      basket.product_items = undefined;

      // Return the new Basket object along with line items.
      return { ...basket, product_items: productItems };
    };

    return basket;
  };
};