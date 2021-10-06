import { V1DeleteRequest, V1EntityType } from "../../../core/object-definitions/v1/models";
import { EcommObject, RequestObject } from "../../../core/object-definitions/v1/models/common-types";
import { V1DeleteRequestToV1DeleteResponseMap } from "../../mapper/v1-fast-delete";
import BasketService from "../api/basket-service";
import BaseService from "./base-service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectMapper = require("object-mapper");

/**
 * A service class to orchestrate the delete flow
 * sequence from Fast -> Seller integration.
 */
export default class DeleteService implements BaseService {
  /**
   * Method implementation from base.
   */
  async orchestrate(request: V1DeleteRequest, token: string): Promise<void> {
    // Throw an error for all the entity types
    // other than V1EntityType.ORDER.
    if (V1EntityType.ORDER !== request.type) {
      throw new Error("5003");
    };
    // Invalid order segment.
    if (!request.order) {
      throw new Error("5002");
    };
    // Call the Basket service's delete method to delete a SFCC basket.
    const basketService = new BasketService(token);
    if (request.order.externalId) {
      await basketService.deleteBasket(request.order.externalId);
    } else {
      throw new Error("5001");
    };
  };

  /**
   * Method implementation from base.
   */
  responseMap(typesafeFastRequest: RequestObject, rawCommerceResponse: EcommObject, response: unknown): void {
    objectMapper.merge(typesafeFastRequest, response, { ...V1DeleteRequestToV1DeleteResponseMap });
  };
};