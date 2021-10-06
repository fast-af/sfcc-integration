// To parse this data:
//
//   import { ConvertCreateRequest, CreateOrderRequest } from "./file";
//
//   const createOrderRequest = ConvertCreateRequest.toCreateOrderRequest(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CreateOrderRequest {
  type?: string;
  app_id?: string;
  order?: CreateOrderRequestOrder;
  request_id?: RequestID;
  user?: CreateOrderRequestUser;
  webhook?: CreateOrderRequestWebhook;
}

export interface CreateOrderRequestOrder {
  is_cart?: boolean;
  order?: OrderOrder;
}

export interface OrderOrder {
  id?: RequestID;
  external_id?: string;
  user_id?: string;
  order_type?: string;
  currency_code?: string;
  status?: string;
  bill_to?: To;
  lines?: OrderLine[];
  shipment_plans?: ShipmentPlan[];
  coupons?: Coupon[];
  total_amount?: string;
  sub_total?: string;
  total_discounts?: string;
  total_tax?: string;
  total_shipping?: string;
  refunds?: Refund[];
  custom_values?: CustomValue[];
  user_note?: string;
  store_note?: string;
  fast_note?: string;
  device_info?: DeviceInfo;
  short_order_id?: string;
}

export interface To {
  id?: RequestID;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address_1?: string;
  address_2?: string;
  city_locality?: string;
  state_province?: string;
  state_province_code?: string;
  country?: string;
  country_code?: string;
  postal_code?: string;
}

export interface RequestID {
  value?: string;
}

export interface Coupon {
  code?: string;
  description?: string;
  origin?: string;
  type?: string;
  applied?: boolean;
  total_amount?: string;
}

export interface CustomValue {
  key?: string;
  value?: string;
}

export interface DeviceInfo {
  ip_address?: string;
}

export interface OrderLine {
  id?: RequestID;
  external_id?: string;
  external_product_id?: string;
  external_variant_id?: string;
  external_options?: CustomValue[];
  customizations?: CustomValue[];
  quantity?: number;
  quantity_fulfilled?: number;
  unit_price?: string;
  discounted_unit_price?: string;
  line_discount_amount?: string;
  subtotal_amount?: string;
  tax_amount?: string;
  total_amount?: string;
  discounts?: Coupon[];
  name?: string;
  description?: string;
  image_url?: string;
  fulfillment_mode?: string;
}

export interface Refund {
  id?: RequestID;
  external_id?: string;
  reason?: string;
  use_original_method?: boolean;
  lines?: RefundLine[];
  refund_date?: string;
  amount?: string;
  tax?: string;
  shipping?: string;
}

export interface RefundLine {
  id?: RequestID;
  quantity?: number;
  external_id?: string;
}

export interface ShipmentPlan {
  id?: RequestID;
  external_id?: string;
  ship_to?: To;
  lines?: RefundLine[];
  selected_option?: Option;
  available_options?: Option[];
  shipments?: Shipment[];
}

export interface Option {
  id?: RequestID;
  external_id?: string;
  name?: string;
  shipment_type?: string;
  cost?: string;
  tax?: string;
  total?: string;
  carrier?: string;
  service_level?: string;
}

export interface Shipment {
  carrier?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  lines?: RefundLine[];
}

export interface CreateOrderRequestUser {
  user?: UserUser;
}

export interface UserUser {
  external_user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  store_credit?: StoreCredit;
}

export interface StoreCredit {
  currency_code?: string;
  units?: string;
  nanos?: number;
}

export interface CreateOrderRequestWebhook {
  webhooks?: WebhookElement[];
}

export interface WebhookElement {
  id?: string;
  scope?: Scope;
}

export interface Scope {
  type?: string;
}

// ConvertCreateRequests JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertCreateRequest {
  public static toCreateOrderRequest(json: string): CreateOrderRequest {
    return cast(JSON.parse(json), r("CreateOrderRequest"));
  }

  public static createOrderRequestToJson(value: CreateOrderRequest): string {
    return JSON.stringify(uncast(value, r("CreateOrderRequest")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  CreateOrderRequest: o(
    [
      { json: "type", js: "type", typ: u(undefined, "") },
      { json: "app_id", js: "app_id", typ: u(undefined, "") },
      {
        json: "order",
        js: "order",
        typ: u(undefined, r("CreateOrderRequestOrder")),
      },
      {
        json: "request_id",
        js: "request_id",
        typ: u(undefined, r("RequestID")),
      },
      {
        json: "user",
        js: "user",
        typ: u(undefined, r("CreateOrderRequestUser")),
      },
      {
        json: "webhook",
        js: "webhook",
        typ: u(undefined, r("CreateOrderRequestWebhook")),
      },
    ],
    false
  ),
  CreateOrderRequestOrder: o(
    [
      { json: "is_cart", js: "is_cart", typ: u(undefined, true) },
      { json: "order", js: "order", typ: u(undefined, r("OrderOrder")) },
    ],
    false
  ),
  OrderOrder: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
      { json: "user_id", js: "user_id", typ: u(undefined, "") },
      { json: "order_type", js: "order_type", typ: u(undefined, "") },
      {
        json: "currency_code",
        js: "currency_code",
        typ: u(undefined, ""),
      },
      { json: "status", js: "status", typ: u(undefined, "") },
      { json: "bill_to", js: "bill_to", typ: u(undefined, r("To")) },
      { json: "lines", js: "lines", typ: u(undefined, a(r("OrderLine"))) },
      {
        json: "shipment_plans",
        js: "shipment_plans",
        typ: u(undefined, a(r("ShipmentPlan"))),
      },
      { json: "coupons", js: "coupons", typ: u(undefined, a(r("Coupon"))) },
      {
        json: "total_amount",
        js: "total_amount",
        typ: u(undefined, ""),
      },
      { json: "sub_total", js: "sub_total", typ: u(undefined, "") },
      {
        json: "total_discounts",
        js: "total_discounts",
        typ: u(undefined, ""),
      },
      { json: "total_tax", js: "total_tax", typ: u(undefined, "") },
      {
        json: "total_shipping",
        js: "total_shipping",
        typ: u(undefined, ""),
      },
      { json: "refunds", js: "refunds", typ: u(undefined, a(r("Refund"))) },
      {
        json: "custom_values",
        js: "custom_values",
        typ: u(undefined, a(r("CustomValue"))),
      },
      { json: "user_note", js: "user_note", typ: u(undefined, "") },
      { json: "store_note", js: "store_note", typ: u(undefined, "") },
      { json: "fast_note", js: "fast_note", typ: u(undefined, "") },
      {
        json: "device_info",
        js: "device_info",
        typ: u(undefined, r("DeviceInfo")),
      },
      {
        json: "short_order_id",
        js: "short_order_id",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
  To: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "first_name", js: "first_name", typ: u(undefined, "") },
      { json: "last_name", js: "last_name", typ: u(undefined, "") },
      { json: "middle_name", js: "middle_name", typ: u(undefined, "") },
      { json: "company", js: "company", typ: u(undefined, "") },
      { json: "email", js: "email", typ: u(undefined, "") },
      { json: "phone", js: "phone", typ: u(undefined, "") },
      { json: "address_1", js: "address_1", typ: u(undefined, "") },
      { json: "address_2", js: "address_2", typ: u(undefined, "") },
      {
        json: "city_locality",
        js: "city_locality",
        typ: u(undefined, ""),
      },
      {
        json: "state_province",
        js: "state_province",
        typ: u(undefined, ""),
      },
      {
        json: "state_province_code",
        js: "state_province_code",
        typ: u(undefined, ""),
      },
      { json: "country", js: "country", typ: u(undefined, "") },
      {
        json: "country_code",
        js: "country_code",
        typ: u(undefined, ""),
      },
      { json: "postal_code", js: "postal_code", typ: u(undefined, "") },
    ],
    false
  ),
  RequestID: o([{ json: "value", js: "value", typ: u(undefined, "") }], false),
  Coupon: o(
    [
      { json: "code", js: "code", typ: u(undefined, "") },
      { json: "description", js: "description", typ: u(undefined, "") },
      { json: "origin", js: "origin", typ: u(undefined, "") },
      { json: "type", js: "type", typ: u(undefined, "") },
      { json: "applied", js: "applied", typ: u(undefined, true) },
      {
        json: "total_amount",
        js: "total_amount",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
  CustomValue: o(
    [
      { json: "key", js: "key", typ: u(undefined, "") },
      { json: "value", js: "value", typ: u(undefined, "") },
    ],
    false
  ),
  DeviceInfo: o(
    [{ json: "ip_address", js: "ip_address", typ: u(undefined, "") }],
    false
  ),
  OrderLine: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
      {
        json: "external_product_id",
        js: "external_product_id",
        typ: u(undefined, ""),
      },
      {
        json: "external_variant_id",
        js: "external_variant_id",
        typ: u(undefined, ""),
      },
      {
        json: "external_options",
        js: "external_options",
        typ: u(undefined, a(r("CustomValue"))),
      },
      {
        json: "customizations",
        js: "customizations",
        typ: u(undefined, a(r("CustomValue"))),
      },
      { json: "quantity", js: "quantity", typ: u(undefined, 0) },
      {
        json: "quantity_fulfilled",
        js: "quantity_fulfilled",
        typ: u(undefined, 0),
      },
      { json: "unit_price", js: "unit_price", typ: u(undefined, "") },
      {
        json: "discounted_unit_price",
        js: "discounted_unit_price",
        typ: u(undefined, ""),
      },
      {
        json: "line_discount_amount",
        js: "line_discount_amount",
        typ: u(undefined, ""),
      },
      {
        json: "subtotal_amount",
        js: "subtotal_amount",
        typ: u(undefined, ""),
      },
      { json: "tax_amount", js: "tax_amount", typ: u(undefined, "") },
      {
        json: "total_amount",
        js: "total_amount",
        typ: u(undefined, ""),
      },
      { json: "discounts", js: "discounts", typ: u(undefined, a(r("Coupon"))) },
      { json: "name", js: "name", typ: u(undefined, "") },
      { json: "description", js: "description", typ: u(undefined, "") },
      { json: "image_url", js: "image_url", typ: u(undefined, "") },
      {
        json: "fulfillment_mode",
        js: "fulfillment_mode",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
  Refund: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
      { json: "reason", js: "reason", typ: u(undefined, "") },
      {
        json: "use_original_method",
        js: "use_original_method",
        typ: u(undefined, true),
      },
      { json: "lines", js: "lines", typ: u(undefined, a(r("RefundLine"))) },
      { json: "refund_date", js: "refund_date", typ: u(undefined, "") },
      { json: "amount", js: "amount", typ: u(undefined, "") },
      { json: "tax", js: "tax", typ: u(undefined, "") },
      { json: "shipping", js: "shipping", typ: u(undefined, "") },
    ],
    false
  ),
  RefundLine: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "quantity", js: "quantity", typ: u(undefined, 0) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
    ],
    false
  ),
  ShipmentPlan: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
      { json: "ship_to", js: "ship_to", typ: u(undefined, r("To")) },
      { json: "lines", js: "lines", typ: u(undefined, a(r("RefundLine"))) },
      {
        json: "selected_option",
        js: "selected_option",
        typ: u(undefined, r("Option")),
      },
      {
        json: "available_options",
        js: "available_options",
        typ: u(undefined, a(r("Option"))),
      },
      {
        json: "shipments",
        js: "shipments",
        typ: u(undefined, a(r("Shipment"))),
      },
    ],
    false
  ),
  Option: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
      { json: "name", js: "name", typ: u(undefined, "") },
      { json: "shipment_type", js: "shipment_type", typ: u(undefined, "") },
      { json: "cost", js: "cost", typ: u(undefined, "") },
      { json: "tax", js: "tax", typ: u(undefined, "") },
      { json: "total", js: "total", typ: u(undefined, "") },
      { json: "carrier", js: "carrier", typ: u(undefined, "") },
      {
        json: "service_level",
        js: "service_level",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
  Shipment: o(
    [
      { json: "carrier", js: "carrier", typ: u(undefined, "") },
      {
        json: "tracking_number",
        js: "tracking_number",
        typ: u(undefined, ""),
      },
      {
        json: "estimated_delivery_date",
        js: "estimated_delivery_date",
        typ: u(undefined, ""),
      },
      { json: "lines", js: "lines", typ: u(undefined, a(r("RefundLine"))) },
    ],
    false
  ),
  CreateOrderRequestUser: o(
    [{ json: "user", js: "user", typ: u(undefined, r("UserUser")) }],
    false
  ),
  UserUser: o(
    [
      {
        json: "external_user_id",
        js: "external_user_id",
        typ: u(undefined, ""),
      },
      { json: "email", js: "email", typ: u(undefined, "") },
      { json: "first_name", js: "first_name", typ: u(undefined, "") },
      { json: "last_name", js: "last_name", typ: u(undefined, "") },
      { json: "phone", js: "phone", typ: u(undefined, "") },
      {
        json: "store_credit",
        js: "store_credit",
        typ: u(undefined, r("StoreCredit")),
      },
    ],
    false
  ),
  StoreCredit: o(
    [
      {
        json: "currency_code",
        js: "currency_code",
        typ: u(undefined, ""),
      },
      { json: "units", js: "units", typ: u(undefined, "") },
      { json: "nanos", js: "nanos", typ: u(undefined, 0) },
    ],
    false
  ),
  CreateOrderRequestWebhook: o(
    [
      {
        json: "webhooks",
        js: "webhooks",
        typ: u(undefined, a(r("WebhookElement"))),
      },
    ],
    false
  ),
  WebhookElement: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "scope", js: "scope", typ: u(undefined, r("Scope")) },
    ],
    false
  ),
  Scope: o([{ json: "type", js: "type", typ: u(undefined, "") }], false),
  string: ["string"],
};
