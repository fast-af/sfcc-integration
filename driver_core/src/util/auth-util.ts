import { ParameterizedContext } from "koa";

/**
 * Read the header to extract commerce
 * to extract the oauth parameters.
 * 
 * @param ctx {ParameterizedContext} - Koa context.
 * @returns {string} - Fast platform credential.
 */
const readAuthParam = (ctx: ParameterizedContext): string => {
  // Get the fast credential from the header.
  const fastCredential = ctx.request.headers[process.env.FAST_PLATFORM_CREDENTIAL_KEY || "x-fast-platform-credentials"];
  if (fastCredential === undefined || fastCredential === null) {
    return "";
  } else {
    return fastCredential as string;
  };
};

export { readAuthParam };