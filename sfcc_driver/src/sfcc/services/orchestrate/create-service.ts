import { BasketToV1CreateResponseMap, V1CreateRequestToBasketMap } from "../../mapper/v1-fast-basket";
import { EcommObject, RequestObject } from "../../../core/object-definitions/v1/models/common-types";
import { V1CreateRequest } from "../../../core/object-definitions/v1/models/v1-create-request";
import BasketService from "../api/basket-service";
import BaseService from "./base-service";
import { V1EntityType } from "../../../core/object-definitions/v1/models/v1-entity-type";
import CommonService from "./common-service";
import { V1CreateRequestToV1CreateResponseMap } from "../../mapper/v1-fast-create";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectMapper = require("object-mapper");

/**
 * A service class to orchestrate the create flow
 * sequence from Fast -> Seller integration.
 */
export default class CreateService extends CommonService implements BaseService {
  /**
   * Method implementation from base.
   * 
   * @param request {V1CreateRequest} - the create request payload.
   * @param token {string} - SFCC OCAPI bearer token.
   */
  async orchestrate(request: V1CreateRequest, token: string): Promise<EcommObject> {
    // Throw an error for all the entity types
    // other than V1EntityType.ORDER.
    if (V1EntityType.ORDER !== request.type) {
      throw new Error("2011");
    };
    // Invalid order segment.
    if (!request.order || !request.order.order) {
      throw new Error("2012");
    };
    // Has to be a cart and expects isCart to be true always.
    if(!request.order.isCart) {
      throw new Error("2013");
    };
    // Object map RequestObject to Basket.
    const basketRequest = objectMapper(request, V1CreateRequestToBasketMap);
    // Call the Basket service's create method to create a SFCC basket.
    const basketService = new BasketService(token);
    const basket = await basketService.createBasket(basketRequest);

    return await this.getBasketWithImageUrls(basket, token);
  };

  /**
   * Method implementation from base.
   */
  responseMap(typesafeFastRequest: RequestObject, rawCommerceResponse: EcommObject, response: unknown): void {
    objectMapper.merge(rawCommerceResponse, response, { ...BasketToV1CreateResponseMap });
    objectMapper.merge(typesafeFastRequest, response, { ...V1CreateRequestToV1CreateResponseMap });
  };
};
