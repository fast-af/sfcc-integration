/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable indent */
import {
  ResponseObject,
  EcommObject,
  RequestObject,
} from "../../core/object-definitions/v1/models/common-types";
import { V1CreateRequest } from "../../core/object-definitions/v1/models/v1-create-request";
import { V1ReadRequest } from "../../core/object-definitions/v1/models/v1-read-request";
import { V1UpdateRequest } from "../../core/object-definitions/v1/models/v1-update-request";
import { V1EntityType } from "../../core/object-definitions/v1/models/v1-entity-type";
import { V1CreateRequestToV1CreateResponseMap } from "../mapper/v1-fast-create";
import { V1ReadRequestToV1ReadResponseMap } from "../mapper/v1-fast-read";
import { UserToV1ReadResponseMap } from "../mapper/v1-fast-user";
import {
  CartToV1ResponseMap,
  readShippingPlanMap,
  updateShippingPlanMap,
} from "../mapper/v1-fast-cart";
import {
  OrderToV1ResponseMap,
  OrderToV1ReadResponseMap,
  OrderToV1UpdateResponseMap,
} from "../mapper/v1-fast-order";
import CreateService from "../services/orchestrate/create-service";
import ReadService from "../services/orchestrate/read-service";
import UpdateService from "../services/orchestrate/update-service";
import DeleteService from "../services/orchestrate/delete-service";
import {
  V1UpdateRequestToV1UpdateResponseMap,
  ShippingOptionsUpdateToV1ResponseMap,
} from "../mapper/v1-fast-update";
import { ZonesToV1ReadResponseMap } from "../mapper/v1-fast-shipping";
import { ActionType } from "../../util/type-util";
import { DeleteToV1Request } from "../mapper/v1-fast-delete";
import { V1OrderShipmentPlan } from "../../core/object-definitions/v1/models/v1-order-shipment-plan";
import { V1OrderLine } from "../../core/object-definitions/v1/models/v1-order-line";
import { V1OrderLineReference } from "../../core/object-definitions/v1/models/v1-order-line-reference";
import { V1OrderType, V1UUID } from "../../core/object-definitions/v1/models";
const objectMapper = require("object-mapper");

/**
 * Accepts the type-safe transformed object from Fast.
 * Maps Fast object to necessary Magento object request properties.
 * Handles all necessary requests to Magento.
 * Returns Magento response, typically cart.
 *
 * @param RequestObject {object} - type-safe transformed Fast request
 * @param action {string} - determined by routing, used to access correct maps / API
 * @param token {string} - API access token
 * @returns {object | string} Success response object, or error
 *
 **/
const handleFastRequest = async (
  typesafeFastRequest: RequestObject,
  action: ActionType,
  token: string
): Promise<EcommObject> => {
  switch (action) {
    case ActionType.CREATE: {
      const createService = new CreateService();
      return await createService.orchestrate(
        typesafeFastRequest as V1CreateRequest,
        token
      );
    }
    case ActionType.READ: {
      const readService = new ReadService();
      return (await readService.orchestrate(
        typesafeFastRequest as V1ReadRequest,
        token
      )) as V1ReadRequest;
    }
    case ActionType.UPDATE: {
      const updateService = new UpdateService();
      return await updateService.orchestrate(
        typesafeFastRequest as V1UpdateRequest,
        token
      );
    }
    case ActionType.DELETE: {
      const deleteService = new DeleteService();
      return await deleteService.orchestrate();
    }
    default:
      return "Error";
  }
};

/**
 * Accepts Magento response.
 * Maps Magento object to Fast.
 *
 * @param {object} EcommObject - Magento response object after all calls made successfully
 * @returns {object | string} - Success response object, or error
 *
 **/
const handleCommerceResponse = (
  typesafeFastRequest: RequestObject,
  action: ActionType,
  rawCommerceResponse: EcommObject
): ResponseObject => {
  const response = {};
  switch (action) {
    case ActionType.CREATE: {
      objectMapper.merge(rawCommerceResponse, response, CartToV1ResponseMap);
      objectMapper.merge(
        typesafeFastRequest,
        response,
        V1CreateRequestToV1CreateResponseMap
      );
      break;
    }

    case ActionType.READ: {
      switch (typesafeFastRequest.type) {
        case V1EntityType.ORDER:
          if (typesafeFastRequest.order?.isCart) {
            objectMapper.merge(
              rawCommerceResponse,
              response,
              CartToV1ResponseMap
            );
          } else {
            objectMapper.merge(
              rawCommerceResponse,
              response,
              OrderToV1ResponseMap
            );
            objectMapper.merge(
              rawCommerceResponse,
              response,
              OrderToV1ReadResponseMap
            );
          }
          break;

        case V1EntityType.USER:
          objectMapper.merge(
            rawCommerceResponse,
            response,
            UserToV1ReadResponseMap
          );
          break;

        case V1EntityType.SHIPPINGZONES:
          objectMapper.merge(
            rawCommerceResponse,
            response,
            ZonesToV1ReadResponseMap
          );
          break;

        case V1EntityType.SHIPPINGOPTION:
        case V1EntityType.CATALOGCATEGORY:
        case V1EntityType.CATALOGPRODUCT:
        case V1EntityType.ORDERSYNC:
        case V1EntityType.WEBHOOK:
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
          break;
        case V1EntityType.UNSPECIFIED:
        default:
          /**
           * Return 400 error that illegal argument was passed
           */
          break;
      }

      /**
       * Call READ specific merges here to prevent
       * generic cart merge from removing / overwriting
       * any necessary READ action data
       */
      objectMapper.merge(rawCommerceResponse, response, readShippingPlanMap);
      objectMapper.merge(
        typesafeFastRequest,
        response,
        V1ReadRequestToV1ReadResponseMap
      );
      break;
    }

    case ActionType.UPDATE: {
      switch (typesafeFastRequest.type) {
        case V1EntityType.ORDER: {
          if (typesafeFastRequest.order?.isCart) {
            objectMapper.merge(
              rawCommerceResponse,
              response,
              CartToV1ResponseMap
            );
            objectMapper.merge(
              rawCommerceResponse,
              response,
              ShippingOptionsUpdateToV1ResponseMap
            );
          } else {
            objectMapper.merge(
              rawCommerceResponse,
              response,
              OrderToV1ResponseMap
            );
            objectMapper.merge(
              rawCommerceResponse,
              response,
              OrderToV1UpdateResponseMap
            );
          }

          break;
        }
        case V1EntityType.USER:
          objectMapper.merge(
            rawCommerceResponse,
            response,
            CartToV1ResponseMap
          );
          objectMapper.merge(
            rawCommerceResponse,
            response,
            ShippingOptionsUpdateToV1ResponseMap
          );
          break;
        case V1EntityType.SHIPPINGOPTION: {
          break;
        }
        case V1EntityType.SHIPPINGZONES:
        case V1EntityType.CATALOGCATEGORY:
        case V1EntityType.CATALOGPRODUCT:
        case V1EntityType.ORDERSYNC:
        case V1EntityType.WEBHOOK:
          /**
           * This will be not supported in the scope of this integration.
           * Return a 501 not implemented error or similar.
           */
          break;
        case V1EntityType.UNSPECIFIED:
        default:
          /**
           * Return 400 error that illegal argument was passed
           */
          break;
      }

      /**
       * Call UPDATE specific merges here to prevent
       * generic cart merge from removing / overwriting
       * any necessary UPDATE action data
       */
      objectMapper.merge(rawCommerceResponse, response, updateShippingPlanMap);
      objectMapper.merge(
        typesafeFastRequest,
        response,
        V1UpdateRequestToV1UpdateResponseMap
      );
      break;
    }
    case ActionType.DELETE: {
      objectMapper.merge(rawCommerceResponse, response, DeleteToV1Request);
      break;
    }
    default:
      break;
  }

  return objectCleanup(response);
};

const objectCleanup = (response: any): ResponseObject => {
  if (response && response.order && response.order.order) {
    // Remove empty shipment_plans and coupons, if there is no meaninful detail
    const isCart = response.order.order.orderType === V1OrderType.CART;
    const isOrder = response.order.order.orderType === V1OrderType.ORDER;
    const shipmentPlans =
      response.order.order.shipmentPlans &&
      response.order.order.shipmentPlans.length > 0
        ? response.order.order.shipmentPlans[0]
        : {};
    const coupon =
      response.order.order.coupons && response.order.order.coupons.length > 0
        ? response.order.order.coupons[0]
        : {};
    const lines = response.order.order.lines as V1OrderLine[];

    if (shipmentPlans.shipTo && !shipmentPlans.shipTo.address1) {
      delete response.order.order.shipmentPlans;
    }
    if (!coupon.code) {
      delete response.order.order.coupons;
    }
    if (lines && lines.length > 0 && isCart) {
      lines.map((line: V1OrderLine) => {
        let hasDiscounts = true;
        const discounts = line.discounts;

        if (line.id && !line.id.value) {
          delete line.id;
        }
        if (discounts && discounts.length > 0) {
          discounts.map((discount: any) => {
            if (!discount.applied) {
              hasDiscounts = false;
            }
          });
        }
        if (!hasDiscounts) {
          delete line.discounts;
        }
      });
    }
    if (isCart && !lines[0].id && !lines[0].externalId) {
      delete response.order.order.lines;
    }

    if (isOrder) {
      delete shipmentPlans.availableOptions;
      shipmentPlans.availableOptions = []
    }

    // If shipping address, ensure UUIDs are manually mapped
    const orderLines = response.order.order.lines as Array<V1OrderLine>;
    const shippingPlans = response.order.order
      .shipmentPlans as Array<V1OrderShipmentPlan>;

    if (shippingPlans && shippingPlans.length > 0 && isCart) {
      shippingPlans.map((plan: V1OrderShipmentPlan): V1OrderShipmentPlan => {
        const planLines = plan.lines as Array<V1OrderLineReference>;

        if (planLines.length > 0) {
          planLines.map((line) => {
            const lineMatch = orderLines.filter((orderLine) => {
              return orderLine.externalId === line.externalId;
            })[0];
            if (lineMatch.id) {
              if (!line.id || !line.id.value) {
                line.id = { value: "" };
              }
              line.id.value = lineMatch.id.value;
            }
            return line;
          });
        }

        return plan;
      });
    }
  }

  return response;
};

export { handleFastRequest, handleCommerceResponse };
