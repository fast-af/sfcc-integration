import config from "./util/config";
import { readAuthParam } from "./util/auth-util";
import { ParameterizedContext } from "koa";
import { ActionType } from "./util/type-util";
import { pinoProd, handleRouteResponse } from "./util/common-util";
import platformHandler from "./sfcc/util/sequence-handler";

// Create route.
config.router.post("/fast/v1/create", async (ctx: ParameterizedContext) => {
  const payload = ctx.request.body;
  const action = ActionType.CREATE;
  const fastResponse = await platformHandler(payload, action, readAuthParam(ctx));
  handleRouteResponse(ctx, fastResponse, action);
});
// Delete route.
config.router.post("/fast/v1/delete", async (ctx: ParameterizedContext) => {
  const payload = ctx.request.body;
  const action = ActionType.DELETE;
  const fastResponse = await platformHandler(payload, action, readAuthParam(ctx));
  handleRouteResponse(ctx, fastResponse, action);
});
// Read route.
config.router.post("/fast/v1/read", async (ctx: ParameterizedContext) => {
  const payload = ctx.request.body;
  const action = ActionType.READ;
  const fastResponse = await platformHandler(payload, action, readAuthParam(ctx));
  handleRouteResponse(ctx, fastResponse, action);
});
// Update route.
config.router.post("/fast/v1/update", async (ctx: ParameterizedContext) => {
  const payload = ctx.request.body;
  const action = ActionType.UPDATE;
  const fastResponse = await platformHandler(payload, action, readAuthParam(ctx));
  handleRouteResponse(ctx, fastResponse, action);
});

config.app.use(config.router.routes());
config.app.use(config.router.allowedMethods());
config.app.listen(config.server.port, () => {
  pinoProd.info(`> Ready on http://localhost:${config.server.port}`);
});
