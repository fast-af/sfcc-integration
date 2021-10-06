import ApiService from "./api-service";
import { V1OrderLine } from "../../../core/object-definitions/v1/models/v1-order-line";

export default class ProductService extends ApiService {
  async productLookup(
    hostUrl: string,
    lines: any[]
  ): Promise<any[] | undefined> {
    if (lines) {
      const itemsFound = await Promise.all(
        lines.map(async (product: any): Promise<any> => {
          let id;
          
          if (product.externalVariantId) {
            id = product.externalVariantId;
          } else if (product.externalProductId) {
            id = product.externalProductId;
          } else if (product.product_id) {
            id = product.product_id;
          }

          const url = `/products?searchCriteria[filterGroups][0][filters][0][field]=entity_id&searchCriteria[filterGroups][0][filters][0][value]=${id}`;
          const http = await this.getHttp();

          return await http
            .get(url)
            .then((response) => {
              const { data } = response;
              const item = data.items[0];
              const sku = item.sku;
              const imageUrl =
                item.media_gallery_entries &&
                item.media_gallery_entries.length > 0
                  ? `${hostUrl}/media/catalog/product${item.media_gallery_entries[0].file}`
                  : "";
              product.externalOptions = product.externalOptions
                ? product.externalOptions
                : [];

              this.logger("product-service", "Item found", data);
              product.externalOptions.push({ key: "SKU", value: sku });
              product.imageUrl = imageUrl;
              return product;
            })
            .catch((error: unknown) => {
              this.logger("product-service", "Item not found", error);
              throw "Invalid product - data is invalid, or product SKU does not exist";
            });
        })
      );
      if (itemsFound) {
        return lines;
      }
    } else {
      return;
    }
  }
}
