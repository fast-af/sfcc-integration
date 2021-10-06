import { ProtobufAny } from "./protobuf-any";

/**
 *
 * @export
 * @interface RpcStatus
 */
export interface RpcStatus {
  /**
   *
   * @type {number}
   * @memberof RpcStatus
   */
  code?: number;
  /**
   *
   * @type {string}
   * @memberof RpcStatus
   */
  message?: string;
  /**
   *
   * @type {Array&lt;ProtobufAny&gt;}
   * @memberof RpcStatus
   */
  details?: ProtobufAny[];
}
