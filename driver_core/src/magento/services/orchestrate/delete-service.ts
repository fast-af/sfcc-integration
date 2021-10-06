import BaseService from "./base-service";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
// import { V1DeleteRequest } from "../../../core/object-definitions/v1/models/v1-delete-request";

export default class DeleteService implements BaseService {
  async orchestrate(): Promise<EcommObject> {
    return { type: "ENTITY_TYPE_ORDER", order: {} };
  }
}
