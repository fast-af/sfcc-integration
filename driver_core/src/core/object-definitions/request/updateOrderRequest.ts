// To parse this data:
//
//   import { ConvertUpdateRequest, UpdateOrderRequest } from "./file";
//
//   const updateOrderRequest = ConvertUpdateRequest.toUpdateOrderRequest(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface UpdateOrderRequest {
  app_id?: string;
  request_id?: RequestID;
  type?: string;
  order?: Order;
}

export interface Order {
  order_id?: RequestID;
  is_cart?: boolean;
  convert_mode?: string;
  convert_cart_to_order?: boolean;
  status?: string;
  bill_to?: To;
  items?: Item[];
  coupon?: Coupon;
  shipping_option?: ShippingOption;
  shipments?: Shipment[];
  updated_segments?: string[];
  user_info?: UserInfo;
  external_id?: string;
  device_info?: DeviceInfo;
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
  remove?: boolean;
}

export interface DeviceInfo {
  ip_address?: string;
}

export interface Item {
  item_id?: RequestID;
  quantity?: number;
  external_product_id?: string;
  external_variant_id?: string;
  external_options?: Tion[];
  customizations?: Tion[];
}

export interface Tion {
  key?: string;
  value?: string;
}

export interface Shipment {
  plan_id?: RequestID;
  ship_to?: To;
  line_refs?: LineRef[];
}

export interface LineRef {
  id?: RequestID;
  quantity?: number;
  external_id?: string;
}

export interface ShippingOption {
  plan_id?: RequestID;
  option_id?: RequestID;
  external_option_id?: string;
}

export interface UserInfo {
  external_customer_id?: string;
}

// ConvertUpdateRequests JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertUpdateRequest {
  public static toUpdateOrderRequest(json: string): UpdateOrderRequest {
    return cast(JSON.parse(json), r("UpdateOrderRequest"));
  }

  public static updateOrderRequestToJson(value: UpdateOrderRequest): string {
    return JSON.stringify(uncast(value, r("UpdateOrderRequest")), null, 2);
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

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  UpdateOrderRequest: o(
    [
      { json: "app_id", js: "app_id", typ: u(undefined, "") },
      {
        json: "request_id",
        js: "request_id",
        typ: u(undefined, r("RequestID")),
      },
      { json: "type", js: "type", typ: u(undefined, "") },
      { json: "order", js: "order", typ: u(undefined, r("Order")) },
    ],
    false
  ),
  Order: o(
    [
      { json: "order_id", js: "order_id", typ: u(undefined, r("RequestID")) },
      { json: "is_cart", js: "is_cart", typ: u(undefined, true) },
      { json: "convert_mode", js: "convert_mode", typ: u(undefined, "") },
      {
        json: "convert_cart_to_order",
        js: "convert_cart_to_order",
        typ: u(undefined, true),
      },
      { json: "status", js: "status", typ: u(undefined, "") },
      { json: "bill_to", js: "bill_to", typ: u(undefined, r("To")) },
      { json: "items", js: "items", typ: u(undefined, a(r("Item"))) },
      { json: "coupon", js: "coupon", typ: u(undefined, r("Coupon")) },
      {
        json: "shipping_option",
        js: "shipping_option",
        typ: u(undefined, r("ShippingOption")),
      },
      {
        json: "shipments",
        js: "shipments",
        typ: u(undefined, a(r("Shipment"))),
      },
      {
        json: "updated_segments",
        js: "updated_segments",
        typ: u(undefined, a("")),
      },
      { json: "user_info", js: "user_info", typ: u(undefined, r("UserInfo")) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
      {
        json: "device_info",
        js: "device_info",
        typ: u(undefined, r("DeviceInfo")),
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
      { json: "city_locality", js: "city_locality", typ: u(undefined, "") },
      { json: "state_province", js: "state_province", typ: u(undefined, "") },
      {
        json: "state_province_code",
        js: "state_province_code",
        typ: u(undefined, ""),
      },
      { json: "country", js: "country", typ: u(undefined, "") },
      { json: "country_code", js: "country_code", typ: u(undefined, "") },
      { json: "postal_code", js: "postal_code", typ: u(undefined, "") },
    ],
    false
  ),
  RequestID: o([{ json: "value", js: "value", typ: u(undefined, "") }], false),
  Coupon: o(
    [
      { json: "code", js: "code", typ: u(undefined, "") },
      { json: "remove", js: "remove", typ: u(undefined, true) },
    ],
    false
  ),
  DeviceInfo: o(
    [{ json: "ip_address", js: "ip_address", typ: u(undefined, "") }],
    false
  ),
  Item: o(
    [
      { json: "item_id", js: "item_id", typ: u(undefined, r("RequestID")) },
      { json: "quantity", js: "quantity", typ: u(undefined, 0) },
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
        typ: u(undefined, a(r("Tion"))),
      },
      {
        json: "customizations",
        js: "customizations",
        typ: u(undefined, a(r("Tion"))),
      },
    ],
    false
  ),
  Tion: o(
    [
      { json: "key", js: "key", typ: u(undefined, "") },
      { json: "value", js: "value", typ: u(undefined, "") },
    ],
    false
  ),
  Shipment: o(
    [
      { json: "plan_id", js: "plan_id", typ: u(undefined, r("RequestID")) },
      { json: "ship_to", js: "ship_to", typ: u(undefined, r("To")) },
      {
        json: "line_refs",
        js: "line_refs",
        typ: u(undefined, a(r("LineRef"))),
      },
    ],
    false
  ),
  LineRef: o(
    [
      { json: "id", js: "id", typ: u(undefined, r("RequestID")) },
      { json: "quantity", js: "quantity", typ: u(undefined, 0) },
      { json: "external_id", js: "external_id", typ: u(undefined, "") },
    ],
    false
  ),
  ShippingOption: o(
    [
      { json: "plan_id", js: "plan_id", typ: u(undefined, r("RequestID")) },
      { json: "option_id", js: "option_id", typ: u(undefined, r("RequestID")) },
      {
        json: "external_option_id",
        js: "external_option_id",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
  UserInfo: o(
    [
      {
        json: "external_customer_id",
        js: "external_customer_id",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
};
