import { EventName } from "./events";

export type FastJsEvent = {
  name: EventName;
  buttonId?: string;
  properties?: Record<string, any>;
};

export class FastJS {
  static dispatchFastJSCallback(app: any, event: FastJsEvent) {
    // noop funciton for now
  }
}
