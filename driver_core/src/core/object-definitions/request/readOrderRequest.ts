// To parse this data:
//
//   import { ConvertReadRequest, ReadOrderRequest } from "./file";
//
//   const readOrderRequest = ConvertReadRequest.toReadOrderRequest(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ReadOrderRequest {
  app_id?: string;
  request_id?: ID;
  type?: string;
  order?: Order;
  shipping_option?: Shipping;
  user?: User;
  shipping_zones?: Shipping;
  product?: Product;
  category?: Category;
  orders?: Orders;
  products?: Products;
  categories?: Categories;
}

export interface Categories {
  last_id?: string;
  page?: number;
}

export interface Category {
  category_id?: string;
}

export interface Order {
  is_cart?: boolean;
  order_id?: ID;
  external_order_id?: string;
  include?: string;
}

export interface ID {
  value?: string;
}

export interface Orders {
  after?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface Product {
  product_id?: string;
  subresource_includes?: string[];
}

export interface Products {
  last_id?: string;
  page?: number;
  subresource_includes?: string[];
}

export interface Shipping {}

export interface User {
  email?: string;
  external_user_id?: string;
}

// ConvertReadRequests JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertReadRequest {
  public static toReadOrderRequest(json: string): ReadOrderRequest {
    return cast(JSON.parse(json), r("ReadOrderRequest"));
  }

  public static readOrderRequestToJson(value: ReadOrderRequest): string {
    return JSON.stringify(uncast(value, r("ReadOrderRequest")), null, 2);
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
  ReadOrderRequest: o(
    [
      { json: "app_id", js: "app_id", typ: u(undefined, "") },
      { json: "request_id", js: "request_id", typ: u(undefined, r("ID")) },
      { json: "type", js: "type", typ: u(undefined, "") },
      { json: "order", js: "order", typ: u(undefined, r("Order")) },
      {
        json: "shipping_option",
        js: "shipping_option",
        typ: u(undefined, r("Shipping")),
      },
      { json: "user", js: "user", typ: u(undefined, r("User")) },
      {
        json: "shipping_zones",
        js: "shipping_zones",
        typ: u(undefined, r("Shipping")),
      },
      { json: "product", js: "product", typ: u(undefined, r("Product")) },
      { json: "category", js: "category", typ: u(undefined, r("Category")) },
      { json: "orders", js: "orders", typ: u(undefined, r("Orders")) },
      { json: "products", js: "products", typ: u(undefined, r("Products")) },
      {
        json: "categories",
        js: "categories",
        typ: u(undefined, r("Categories")),
      },
    ],
    false
  ),
  Categories: o(
    [
      { json: "last_id", js: "last_id", typ: u(undefined, "") },
      { json: "page", js: "page", typ: u(undefined, 0) },
    ],
    false
  ),
  Category: o(
    [{ json: "category_id", js: "category_id", typ: u(undefined, "") }],
    false
  ),
  Order: o(
    [
      { json: "is_cart", js: "is_cart", typ: u(undefined, true) },
      { json: "order_id", js: "order_id", typ: u(undefined, r("ID")) },
      {
        json: "external_order_id",
        js: "external_order_id",
        typ: u(undefined, ""),
      },
      { json: "include", js: "include", typ: u(undefined, "") },
    ],
    false
  ),
  ID: o([{ json: "value", js: "value", typ: u(undefined, "") }], false),
  Orders: o(
    [
      { json: "after", js: "after", typ: u(undefined, "") },
      { json: "status", js: "status", typ: u(undefined, "") },
      { json: "page", js: "page", typ: u(undefined, 0) },
      { json: "limit", js: "limit", typ: u(undefined, 0) },
    ],
    false
  ),
  Product: o(
    [
      { json: "product_id", js: "product_id", typ: u(undefined, "") },
      {
        json: "subresource_includes",
        js: "subresource_includes",
        typ: u(undefined, a("")),
      },
    ],
    false
  ),
  Products: o(
    [
      { json: "last_id", js: "last_id", typ: u(undefined, "") },
      { json: "page", js: "page", typ: u(undefined, 0) },
      {
        json: "subresource_includes",
        js: "subresource_includes",
        typ: u(undefined, a("")),
      },
    ],
    false
  ),
  Shipping: o([], false),
  User: o(
    [
      { json: "email", js: "email", typ: u(undefined, "") },
      {
        json: "external_user_id",
        js: "external_user_id",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
};
