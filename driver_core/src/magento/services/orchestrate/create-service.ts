import { V1CreateRequest } from "../../../core/object-definitions/v1/models/v1-create-request";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import { V1CreateRequestToCartMap } from "../../mapper/v1-fast-cart";
import BaseService from "./base-service";
import CartService from "../api/cart-service";
import CartItem from "../../models/cart-item";
import ProductService from "../api/product-service";
import { ImageLookupToCommerceResponse } from "../../mapper/v1-fast-create";
import { V1OrderLine } from "../../../core/object-definitions/v1/models/v1-order-line";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectMapper = require("object-mapper");

/**
 * Service class to create a new cart and add passed
 * product IDs to the cart.
 *
 * @param request {V1CreateRequest} typesafe request object
 * @param token {string}
 * @returns {EcommObject} Cart object with products
 */
export default class CreateService implements BaseService {
  async orchestrate(
    request: V1CreateRequest,
    token: string
  ): Promise<EcommObject> {
    const fastOrderId = request.order?.order?.id?.value as string;
    const cartService = new CartService(token);
    const productService = new ProductService(token);
    const cartId = await cartService.createCart(fastOrderId);
    const hostUrl = JSON.parse(token).merchant_api_url;
    const requestLines = request.order?.order?.lines as V1OrderLine[];
    const linesWithSkus = await productService.productLookup(
      hostUrl,
      requestLines
    );
    const mapperData = request as any;
    mapperData.order.order.lines = linesWithSkus;
    const lines = objectMapper(mapperData, V1CreateRequestToCartMap);

    // Append quote ID to each line
    lines.products.map((line: CartItem) => (line.quote_id = cartId));

    // Add lines to cart
    await cartService.addToCart(lines.products, cartId);

    // Fetch result
    const cart = await cartService.getCart(cartId);

    // Overwrite to hasehd ID for future updates
    cart.id = cartId;

    // Map images to response object
    objectMapper.merge(mapperData, cart, ImageLookupToCommerceResponse);

    return cart;
  }
}
