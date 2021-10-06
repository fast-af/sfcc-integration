import { typesafeRequest, typesafeResponse, ActionType} from "../../util/type-util";
import { ReturnObject } from "../../core/object-definitions/v1/models/common-types";
import { handleFastRequest, handleCommerceResponse } from "../util/commerce-mapper";
import { printStackTrace } from "../../util/common-util";

/**
 * Handles all inbound requests from Fast and returns response.
 * 
 * @param payload {string | Record<string, unknown>} - Fast payload object.
 * @param action {ActionType} - Operation requested by Fast.
 * @param authParam {SFCCAuthModel} - OCAPI OAuth parameters.
 * @returns {Promise<ReturnObject>} - Success response object, or error.
 */
const sequenceHandler = async (
  payload: string | Record<string, unknown>,
  action: ActionType,
  authParam?: string
): Promise<ReturnObject> => {
  try {
    // Check and create type-safe payload object.
    const typesafeFastRequest = typesafeRequest(payload, action);

    // Get the token.
    // TODO: Since the authParam is optional, the below statement
    // will not be required once this is include in Magento as well.
    const token = authParam ? authParam : "";

    // Request to SFCC based on Fast request.
    const request = await handleFastRequest(typesafeFastRequest, action, token);
    // Convert SFCC response to Fast response.
    const response = handleCommerceResponse(typesafeFastRequest, action, request);
    // Check and convert to an appropriate response object.
    const fastResponse = typesafeResponse(response, action);

    return { data: fastResponse, code: 200 };
  } catch (error: any) {
    printStackTrace(error);
    return { data: error.message ? error.message : error, code: 400 };
  };
};

export default sequenceHandler;
