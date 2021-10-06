/* eslint-disable indent */
import { ResponseObject, EcommObject, RequestObject } from "../../core/object-definitions/v1/models/common-types";
import { V1CreateRequest } from "../../core/object-definitions/v1/models/v1-create-request";
import { V1ReadRequest } from "../../core/object-definitions/v1/models/v1-read-request";
import { V1UpdateRequest } from "../../core/object-definitions/v1/models/v1-update-request";
import { V1DeleteRequest } from "../../core/object-definitions/v1/models/v1-delete-request";
import { ActionType } from "../../util/type-util";
import CreateService from "../services/orchestrate/create-service";
import ReadService from "../services/orchestrate/read-service";
import DeleteService from "../services/orchestrate/delete-service";
import UpdateService from "../services/orchestrate/update-service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cleanDeep = require("clean-deep");

/**
 * TODO: Reassess necessity.
 * Accepts the type-safe transformed object from Fast.
 * Maps Fast object to necessary Commerce object request properties.
 * Handles all necessary requests to Commerce.
 * Returns Commerce response.
 * 
 * @param typesafeFastRequest {RequestObject} - type-safe transformed Fast request.
 * @param action {ActionType} - Action: determined by routing, used to access correct maps / API.
 * @param token {string} - API access token.
 * @returns {Promise<EcommObject>} Success response object, or error.
 */
const handleFastRequest = async (
  typesafeFastRequest: RequestObject,
  action: ActionType,
  token: string
): Promise<EcommObject> => {
  switch (action) {
    case ActionType.CREATE: {
      const createService = new CreateService();
      return await createService.orchestrate(typesafeFastRequest as V1CreateRequest, token);
    };
    case ActionType.READ: {
      const readService = new ReadService();
      return await readService.orchestrate(typesafeFastRequest as V1ReadRequest, token);
    };
    case ActionType.UPDATE: {
      const updateService = new UpdateService(token);
      return await updateService.orchestrate(typesafeFastRequest as V1UpdateRequest);
    };
    case ActionType.DELETE: {
      const deleteService = new DeleteService();
      return await deleteService.orchestrate(typesafeFastRequest as V1DeleteRequest, token);
    };
    default:
      return new Error("1005");
  };
};

/**
 * Create a Fast response object.
 * 
 * @param typesafeFastRequest {RequestObject} - type-safe transformed Fast request.
 * @param action {ActionType} - Action: determined by routing, used to access correct maps / API.
 * @param rawCommerceResponse {EcommObject} - Ecommerce object.
 * @returns {ResponseObject} - Success response object, or error.
 */
const handleCommerceResponse = (
  typesafeFastRequest: RequestObject,
  action: ActionType,
  rawCommerceResponse: EcommObject
): ResponseObject => {
  const response = {};
  switch (action) {
    case ActionType.CREATE: {
      const createService = new CreateService();
      createService.responseMap(typesafeFastRequest, rawCommerceResponse, response);
      break;
    };
    case ActionType.READ: {
      const readService = new ReadService();
      readService.responseMap(typesafeFastRequest, rawCommerceResponse, response);
      break;
    };
    case ActionType.UPDATE: {
      // No need for the token to be passed.
      const updateService = new UpdateService("");
      updateService.responseMap(typesafeFastRequest as V1UpdateRequest, rawCommerceResponse, response);
      break;
    };
    case ActionType.DELETE: {
      const deleteService = new DeleteService();
      deleteService.responseMap(typesafeFastRequest, rawCommerceResponse, response);
      break;
    };
    default:
      break;
  };
  return customObjectMapping(response);
};

/**
 * TODO: Look into object mapper mapping for
 * workaround.
 * 
 * Perform a custom object mapping not handled
 * properly by the object-mapper plugin.
 * 
 * @param response {any} - Fast response object.
 * @returns {ResponseObject} - modified response object.
 */
const customObjectMapping = (response: any): ResponseObject => {
  if (response) {
    if (response.order && response.order.order) {
      // A hack as Fast does not expect shipmentPlans to
      // exist, even though SFCC provides a default shipment
      // OOTB, if shipping address does not exist.
      if (response.order.order.shipmentPlans) {
        if (response.order.order.shipmentPlans[0].shipTo && response.order.order.shipmentPlans[0].shipTo.address1) {
          // Ideally the lineRefs and availableOptions should have been
          // mapped under response.order.order.shipmentPlans array.
          // But, the object-mapper's does not map it properly.
          if (response.order.order.lineRefs) {
            response.order.order.shipmentPlans[0].lines = response.order.order.lineRefs;
            delete response.order.order.lineRefs;
          };
          if (response.order.order.availableOptions) {
            // Check if any options are without an externalId.
            const externalIds: string[] = response.order.order.availableOptions.filter((option: any) => 
              option.externalId !== undefined
            );
            // Only copy if available.
            if (externalIds.length > 0) {
              response.order.order.shipmentPlans[0].availableOptions = response.order.order.availableOptions;
            };
            delete response.order.order.availableOptions;
          };
        } else {
          delete response.order.order.shipmentPlans;
          delete response.order.order.lineRefs;
          delete response.order.order.availableOptions;
        };
      };
    };
    // A hack as Fast expects the shippingZones property to
    // exist in the response for a V1EntityType.SHIPPINGZONES
    // read request, even though it is an empty array.
    if (response.shippingZones) {
      const shippingZones = response.shippingZones;
      const newResponse = cleanDeep(response);
      shippingZones.shippingZones = [];
      newResponse.shippingZones = shippingZones;
      return newResponse;
    };
  };

  return cleanDeep(response);
};

export { handleFastRequest, handleCommerceResponse };
