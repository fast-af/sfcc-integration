import fs from "fs";
import path from "path";
import pino from "pino";
import Stacktrace from "stacktrace-js";
import { ParameterizedContext } from "koa";
import { ReturnObject } from "../core/object-definitions/v1/models/common-types";
import { ActionType, LogObject } from "./type-util";

/**
 * Get a formatted object for Pino log.
 * 
 * @param customMessage {string} - any custom message.
 * @param logObject {unknown} - any log object.
 * @returns {unknown} - a custom object.
 */
export const formattedLog = (customMessage: string, logObject: unknown): LogObject => {
  return { message: customMessage, response: logObject};
};

/**
 * Use pino - for request logging.
 */
const pinoProd = pino({
  name: "Production Log",
});
export { pinoProd };

/**
 * Common function to read a JSON file.
 * 
 * @returns {Object} - JSON object
 */
const jsonReader = () => {
  try {
    const filePath = path.join(__dirname, "..", `/${process.env.PLATFORM_FLAG || ""}/util/messages.json`);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    pinoProd.error(formattedLog("Error reading file: %s", err));
    return {};
  };
};

/**
 * Error/Informational messages.
 */
const Messages = jsonReader();

/**
 * Retrieves the application error message from code.
 * 
 * @param {string} errCode - original error code.
 * @param action {ActionType} - Action: determined by routing, used to access correct maps / API.
 * @returns {string} - error message.
 */
const getMessage = ((errCode: string, action: ActionType): string => {
  return `${action}: ${(process.env.PLATFORM_FLAG || "").toUpperCase()} API: ${Messages[errCode]}`;
});

/**
 * Print stack trace in the console.
 * 
 * @param error {any} - an Error object.
 */
export const printStackTrace = (error?: Error): void => {
  if (process.env.NODE_ENV?.toLowerCase().startsWith("dev")) {
    const traceObject = error ? Stacktrace.fromError(error) : Stacktrace.get();
    traceObject
      .then(stackframes => {
        const stringifiedStack = stackframes.map(sf => sf.toString())
          .join('\n');
        pinoProd.warn(stringifiedStack);
      })
      .catch((err: Error) => pinoProd.error(err));
  };
}

/**
 * Function to handle route response.
 * 
 * @param ctx {ParameterizedContext} - Koa context.
 * @param response {ReturnObject} -  Object to be returned as response.
 * @param action {ActionType} - Action: determined by routing, used to access correct maps / API.
 */
export const handleRouteResponse = (ctx: ParameterizedContext, response: ReturnObject, action: ActionType): void => {
  if (response.code === 200) {
    ctx.body = response.data;
    ctx.status = response.code;
    pinoProd.info(formattedLog(`server: Fast -> Middleware: ${action}: success:`, ctx.body));
  } else {
    const errorCode = response.data as string;
    ctx.body = {
      code: errorCode,
      message: getMessage(errorCode, action),
    };
    ctx.status = 400;
    pinoProd.warn(formattedLog(`server: Fast -> Middleware: ${action}: error:`, ctx.body));
  };
};
