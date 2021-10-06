/* eslint-disable indent */
import { EcommObject, RequestObject } from "../../../core/object-definitions/v1/models/common-types";
import { V1EntityType } from "../../../core/object-definitions/v1/models/v1-entity-type";
import { V1ReadRequest } from "../../../core/object-definitions/v1/models/v1-read-request";
import BaseService from "./base-service";
import BasketService from "../api/basket-service";
import CustomerService from "../api/customer-service";
import OrderService from "../api/order-service";
import CommonService from "./common-service";
import { ShippingZonesToV1ReadResponseMap, V1ReadRequestToV1ReadResponseMap } from "../../mapper/v1-fast-read";
import { BasketToV1ReadResponseMap } from "../../mapper/v1-fast-basket";
import { OrderToV1ReadResponseMap } from "../../mapper/v1-fast-order";
import { CustomerToV1ReadResponseMap } from "../../mapper/v1-fast-customer";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectMapper = require("object-mapper");

/**
 * A service class to orchestrate the read flow
 * sequence from Fast -> Seller integration.
 */
export default class ReadService extends CommonService implements BaseService {
  /**
   * Method implementation from base.
   */
  async orchestrate(request: V1ReadRequest, token: string): Promise<EcommObject> {
    switch (request.type) {
      case V1EntityType.USER: {
        if (request.user) {
          if (request.user.externalUserId) {
            // Fetch user information.
            const customerService = new CustomerService(token);
            return await customerService.getCustomerById(request.user.externalUserId);
          };
          if (request.user.email) {
            // Based on the discussion with the Fast team on 01 Sep 2021,
            // it is decided to return a static user not found response
            // for the read user call if it is only associated with an
            // email address.
            throw new Error("3002");
          };
        };
        break;
      };
      case V1EntityType.ORDER: {
        // Fetch a single cart/order.
        if (request.order && request.order.externalId) {
          // Fetch cart information if isCart is true.
          if (request.order.isCart) {
            const basketService = new BasketService(token);
            const basket = await basketService.getBasket(request.order.externalId);
            return await this.getBasketWithImageUrls(basket, token);
          } else {
            // Fetch order information if isCart is false.
            const orderService = new OrderService(token);
            const order = await orderService.getOrder(request.order.externalId);
            return await this.getBasketWithImageUrls(order, token);
          }
        };
        break;
      };
      case V1EntityType.SHIPPINGZONES: {
        /**
         * As per the discussion with Fast<>BORN on
         * 07 Sep 2021, this entity type if received
         * should return an empty response, as there
         * is no appropriate endpoint in SFCC OCAPI
         * to retrieve information.
         * 
         * Any changes to this will affect the code in
         * sfcc/util/commerce-mapper.ts and will have
         * to be taken care of.
         */
        return null;
      };
      case V1EntityType.CATALOGCATEGORY:
      case V1EntityType.CATALOGPRODUCT:
      case V1EntityType.ORDERSYNC:
      case V1EntityType.SHIPPINGOPTION:
      case V1EntityType.WEBHOOK: {
        /**
         * This will be not supported in the scope of this integration.
         * Return a 501 not implemented error or similar.
         *
         * Note that Shipping Options and Shipping Zones should be
         * returned when Shipping Address is updated. Fast will send an
         * UPDATE request to Middleware with the address, and the response
         * should include available shipping options, and shipping zone
         * data.
         */
        throw new Error("1003");
      };
      case V1EntityType.UNSPECIFIED:
      default: {
        break;
      };
    };
    throw new Error("3005");
  };

  /**
   * Method implementation from base.
   */
  responseMap(typesafeFastRequest: RequestObject, rawCommerceResponse: EcommObject, response: unknown): void {
    objectMapper.merge(typesafeFastRequest, response, { ...V1ReadRequestToV1ReadResponseMap });
    switch (typesafeFastRequest.type) {
      case V1EntityType.ORDER:{
        // Fetch a single cart/order.
        if (typesafeFastRequest.order && typesafeFastRequest.order.isCart) {
          // Fetch cart information if isCart is true.
          objectMapper.merge(rawCommerceResponse, response, { ...BasketToV1ReadResponseMap });
        } else {
          // Fetch order information if isCart is false.
          objectMapper.merge(rawCommerceResponse, response, { ...OrderToV1ReadResponseMap });
        };
        break;
      };
      case V1EntityType.USER: {
        objectMapper.merge(rawCommerceResponse, response, CustomerToV1ReadResponseMap);
        break;
      };
      case V1EntityType.SHIPPINGZONES: {
        objectMapper.merge(typesafeFastRequest, response, ShippingZonesToV1ReadResponseMap);
        break;
      };
      case V1EntityType.SHIPPINGOPTION:
      case V1EntityType.CATALOGCATEGORY:
      case V1EntityType.CATALOGPRODUCT:
      default:
        break;
    };
  };
};
