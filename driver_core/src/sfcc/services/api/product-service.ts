import ApiService from "./api-service";
import OCAPI from "sfcc-ocapi-documents";
import { AxiosError } from "axios";
import { ReducedImage } from "../../models/custom-types";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import { pinoProd } from "../../../util/common-util";

/**
 * A service class for OCAPI product operations.
 */
export default class ProductService extends ApiService {
  /**
   * Get Product images by product id.
   * 
   * @param productId {string} - SFCC Product id.
   * @returns {Promise<OCAPI.Product>} - SFCC Product document.
   */
  async getProductImagesById(productId: string): Promise<OCAPI.Product> {
    try {
      const uri = process.env.SFCC_OCAPI_PRODUCT_IMAGE || `/products/${productId}/images`;
      const http = await this.getHttp();
      const { data } = await http.get(uri.replace(this.getReplaceString(), productId));
      return data;
    } catch(error: unknown) {
      pinoProd.error(`Error when getting product and image details for "${productId}".`);
      throw new Error(this.handleError(error as AxiosError));
    };
  };

  /**
   * Get Modified product line items.
   * 
   * @param productIds {string[]} - Product ids to fetch image urls.
   * @param responseLines {OCAPI.ProductItem[]} - SFCC basket lines items.
   * @returns {Promise<EcommObject>} - Custom product items.
   */
  async getModifiedProductItems(productIds: string[], responseLines?: OCAPI.ProductItem[]): Promise<EcommObject> {
    // Get the product images
    const productImageLinks = await this.getProductImages(productIds);
    // Get new product items with product image url.
    return responseLines?.map(item => {
      let productItem = {};
      productImageLinks.forEach(productImageLink => {
        if (item.product_id === productImageLink.id) {
          productItem = { ...item, image_url: productImageLink.url, variant: productImageLink.variant };
        };
      });
      return productItem;
    });
  };

  /**
   * Get the product image links.
   * 
   * @param productIds {string[]} - Product ids to fetch image urls.
   * @returns {Promise<unknown[]>} - reduced/flattened product image array.
   */
  private async getProductImages(productIds: string []): Promise<ReducedImage[]> {
    const productPromises = productIds.flatMap<Promise<OCAPI.Product>>(id => 
      this.getProductImagesById(id)
    );
    const products = await Promise.all(productPromises);
    return products.flatMap(product => {
      const reducedImage = this.extractImageLink(product.id, product.image_groups);
      // Determine variant.
      reducedImage.variant = product.type.variant ? true : false;

      return reducedImage;
    });
  };

  /**
   * Extract the image url from the product image groups.
   * 
   * @param productId {string} - the product id.
   * @param imageGroups {OCAPI.ImageGroup[]} - the product image groups.
   * @returns {string} - the image url.
   */
  private extractImageLink(productId: string, imageGroups: OCAPI.ImageGroup[]): ReducedImage {
    // Instantiate a new object type.
    const productImage: ReducedImage = {
      id: productId,
      url: "",
      variant: false,
    };
    // Get the medium image view type.
    const imageLinks = imageGroups.filter(imageGroup => imageGroup.view_type == this.getImageViewType());
    // If the medium view type does not exist,
    // get the first view type's link.
    productImage.url = imageLinks.length > 0 
      ? imageLinks[0].images[0].dis_base_link
      : (imageGroups.length > 0
        ? imageGroups[0].images[0].dis_base_link
        : "");

    return productImage;
  };
};