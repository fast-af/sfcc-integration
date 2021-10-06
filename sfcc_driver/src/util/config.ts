import Koa from "koa";
import requestId from "koa-requestid";
import bodyParser = require("koa-bodyparser");
import Router from "koa-router";
import responseTime from "koa-response-time";
import onFinished from "on-finished";
import { RpcStatus } from "../core/object-definitions/v1/models/rpc-status";
import { pinoProd } from "../util/common-util";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const clfDate = require("clf-date");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requestReceived = require("request-received");

// Node Js server details.
const SERVER = {
  // host name - defaulted to localhost if run locally.
  hostName: process.env.SERVER_HOSTNAME || "localhost",
  // port - defaulted to 8081 if not provided.
  port: process.env.SERVER_PORT || 8081,
};
// Instantiate Koa.
const app = new Koa();
// Use request-received - to be used at the top before all other Koa middleware usage.
app.use(requestReceived);
// Use response-time - to be used at the top before all other Koa middleware usage.
// hrtime - to provide in nano time.
app.use(responseTime({ hrtime: true }));
// User Koa body-parser.
app.use(bodyParser());
// Instantiate Router.
const router = new Router();
// Use koa-request-id.
app.use(requestId());

// Use custom middleware - for request/response logging.
app.use((ctx, next) => {
  const req = ctx.request;
  const res = ctx.res;
  const parseHeaderValue = (value: any) => {
    try {
      return JSON.parse(value);
    } catch(_) {
      return value;
    };
  };

  onFinished(res, () => {
    const reqStartTime = Symbol.for("request-received.startTime");
    const startTime = new Date(req.ctx[reqStartTime as any]);
    const requestHeaders = req.headers;
    const log = {
      prefix: `${ctx ? ctx.ip : req.ip} - ${clfDate(startTime)} '${req.method} ${req.url}
        HTTP/${req.req.httpVersionMajor}.${req.req.httpVersionMinor}' ${res.statusCode}
        ${res.getHeader('content-length') || '-'}`.replace(/\n\s*/g, " "),
      request_method: req.method,
      request_body: req.body,
      response_headers: res.getHeaders(),
    };
    const otherHeaders = {};
    // To have all the header keys that starts with x-
    // to be at the root level.
    Object.keys(requestHeaders).forEach(key => {
      Object.defineProperty(key.toLowerCase().startsWith("x-") 
        ? log : otherHeaders, key, {
        value: parseHeaderValue(requestHeaders[key]),
        writable: true,
        enumerable: true,
      });
    });
    Object.defineProperty(log, "request_headers", {
      value: otherHeaders,
      writable: true,
      enumerable: true,
    });
    pinoProd.info(log);
  });

  return next();
});

// TODO: Common error handling.
// https://github.com/koajs/examples/blob/master/errors/app.js
app.use(async function(ctx, next) {
  try {
    await next();
  } catch (err: any) {
    // some errors will have .status
    // however this is not a guarantee
    ctx.status = err.status || 500;
    ctx.type = 'json';
    const errorBody: RpcStatus = {
      code: err.code || err.status || ctx.status,
      message: err.message || "Internal Server Error",
    }
    ctx.body = errorBody;

    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    ctx.app.emit('error', err, ctx);
  }
});

// Content-negotiation handling.
// Ref: https://github.com/koajs/examples/blob/master/negotiation/app.js
// Accept only JSON body, and throw error or anything else.
app.use(async (ctx, next) => {
  await next();

  const body = ctx.request.body;

  // Throw Not acceptable if no body present
  // or an empty JSON is sent.
  if (Object.keys(body).length === 0) ctx.throw(406);
  else return;
});

const config = {
  server: SERVER,
  router,
  // TODO: Include auth function
  app: app,
};

export default config;
