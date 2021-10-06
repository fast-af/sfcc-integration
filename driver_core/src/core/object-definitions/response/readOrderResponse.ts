// To parse this data:
//
//   import { ConvertReadResponse, ReadOrderResponse } from "./file";
//
//   const readOrderResponse = ConvertReadResponse.toReadOrderResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ReadOrderResponse {
  request_id?: RequestID;
  type?: string;
  order?: PurpleOrder;
  shipping_option?: ShippingOption;
  user?: ReadOrderResponseUser;
  shipping_zones?: ShippingZones;
  product?: PurpleProduct;
  category?: FluffyCategory;
  orders?: TentacledOrder[];
  products?: TentacledProduct[];
  categories?: PurpleCategory[];
}

export interface PurpleCategory {
  app_id?: string;
  categories?: CategoryCategory[];
  last_id?: string;
  more_results?: boolean;
}

export interface CategoryCategory {
  id?: string;
  description?: string;
  name?: string;
  meta_keywords?: string[];
  default_product_sort?: string;
  image_url?: string;
  is_visible?: boolean;
  layout_file?: string;
  meta_description?: string;
  page_title?: string;
  parent_id?: string;
  search_keywords?: string;
  sort_order?: number;
  views?: number;
  custom_url?: CustomURL;
}

export interface CustomURL {
  is_customized?: boolean;
  url?: string;
}

export interface FluffyCategory {
  category?: CategoryCategory;
}

export interface PurpleOrder {
  order?: FluffyOrder;
}

export interface FluffyOrder {
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

export interface TentacledOrder {
  orders?: PurpleOrder[];
}

export interface PurpleProduct {
  app_id?: string;
  product?: FluffyProduct;
  rate_limit?: RateLimit;
}

export interface FluffyProduct {
  id?: string;
  sku?: string;
  availability?: string;
  availability_description?: string;
  is_visible?: boolean;
  bin_picking_number?: string;
  brand_id?: string;
  categories?: number[];
  condition?: string;
  custom_url?: CustomURL;
  display_price?: DisplayPrice;
  fixed_cost_shipping_price?: DisplayPrice;
  is_free_shipping?: boolean;
  name?: string;
  description?: string;
  type?: string;
  dimension?: Dimension;
  inventory_level?: number;
  meta_keywords?: string[];
  search_keywords?: string[];
  related_products?: number[];
  reviews_count?: number;
  reviews_rating_sum?: number;
  total_sold?: string;
  view_count?: string;
  primary_image?: Image;
  variants?: Variant[];
  images?: Image[];
  modifiers?: Modifier[];
  date_created?: string;
  date_modified?: string;
  inventory_tracking?: string;
  price_range?: PriceRange;
}

export interface Dimension {
  height?: number;
  width?: number;
  weight?: number;
}

export interface DisplayPrice {
  currency_code?: string;
  units?: string;
  nanos?: number;
}

export interface Image {
  id?: string;
  product_id?: string;
  description?: string;
  is_thumbnail?: boolean;
  sort_order?: number;
  image_file?: string;
  url_standard?: string;
  url_thumbnail?: string;
  url_tiny?: string;
  url_zoom?: string;
  date_modified?: string;
}

export interface Modifier {
  id?: string;
  product_id?: string;
  name?: string;
  display_name?: string;
  sort_order?: number;
  required?: boolean;
  type?: string;
  option_values?: OptionValue[];
}

export interface OptionValue {
  id?: string;
  option_id?: string;
  label?: string;
  is_default?: boolean;
  sort_order?: number;
  adjusters?: Adjusters;
  value_data?: ValueData;
}

export interface Adjusters {
  price?: Price;
  weight?: Price;
  image_url?: string;
  purchasing_disabled?: PurchasingDisabled;
}

export interface Price {
  adjuster?: string;
  adjuster_value?: number;
}

export interface PurchasingDisabled {
  status?: boolean;
  message?: string;
}

export interface ValueData {
  colors?: string[];
  image_url?: string;
  product_id?: string;
  checked_value?: boolean;
}

export interface PriceRange {
  additionalProperties?: DisplayPrice;
}

export interface Variant {
  id?: string;
  sku?: string;
  display_price?: DisplayPrice;
  fixed_cost_shipping_price?: DisplayPrice;
  is_free_shipping?: boolean;
  purchasing_disabled?: boolean;
  dimension?: Dimension;
  option_values?: AdditionalProperties[];
  inventory_level?: number;
  image_url?: string;
  option_value_map?: OptionValueMap;
}

export interface OptionValueMap {
  additionalProperties?: AdditionalProperties;
}

export interface AdditionalProperties {
  id?: string;
  option_id?: string;
  label?: string;
  option_display_name?: string;
  value_data?: ValueData;
}

export interface RateLimit {
  request_left?: number;
  request_quota?: number;
  time_reset_ms?: number;
  time_window_ms?: number;
}

export interface TentacledProduct {
  app_id?: string;
  products?: PurpleProduct[];
  rate_limit?: RateLimit;
  last_id?: string;
  more_results?: boolean;
}

export interface ShippingOption {}

export interface ShippingZones {
  shipping_zones?: ShippingZone[];
}

export interface ShippingZone {
  country_iso2?: string;
  subdivision_iso2?: string;
}

export interface ReadOrderResponseUser {
  user?: UserUser;
}

export interface UserUser {
  external_user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  store_credit?: DisplayPrice;
}

// ConvertReadResponses JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertReadResponse {
  public static toReadOrderResponse(json: string): ReadOrderResponse {
    return cast(JSON.parse(json), r("ReadOrderResponse"));
  }

  public static readOrderResponseToJson(value: ReadOrderResponse): string {
    return JSON.stringify(uncast(value, r("ReadOrderResponse")), null, 2);
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
  ReadOrderResponse: o(
    [
      {
        json: "request_id",
        js: "request_id",
        typ: u(undefined, r("RequestID")),
      },
      { json: "type", js: "type", typ: u(undefined, "") },
      { json: "order", js: "order", typ: u(undefined, r("PurpleOrder")) },
      {
        json: "shipping_option",
        js: "shipping_option",
        typ: u(undefined, r("ShippingOption")),
      },
      {
        json: "user",
        js: "user",
        typ: u(undefined, r("ReadOrderResponseUser")),
      },
      {
        json: "shipping_zones",
        js: "shipping_zones",
        typ: u(undefined, r("ShippingZones")),
      },
      { json: "product", js: "product", typ: u(undefined, r("PurpleProduct")) },
      {
        json: "category",
        js: "category",
        typ: u(undefined, r("FluffyCategory")),
      },
      {
        json: "orders",
        js: "orders",
        typ: u(undefined, a(r("TentacledOrder"))),
      },
      {
        json: "products",
        js: "products",
        typ: u(undefined, a(r("TentacledProduct"))),
      },
      {
        json: "categories",
        js: "categories",
        typ: u(undefined, a(r("PurpleCategory"))),
      },
    ],
    false
  ),
  PurpleCategory: o(
    [
      { json: "app_id", js: "app_id", typ: u(undefined, "") },
      {
        json: "categories",
        js: "categories",
        typ: u(undefined, a(r("CategoryCategory"))),
      },
      { json: "last_id", js: "last_id", typ: u(undefined, "") },
      { json: "more_results", js: "more_results", typ: u(undefined, true) },
    ],
    false
  ),
  CategoryCategory: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "description", js: "description", typ: u(undefined, "") },
      { json: "name", js: "name", typ: u(undefined, "") },
      { json: "meta_keywords", js: "meta_keywords", typ: u(undefined, a("")) },
      {
        json: "default_product_sort",
        js: "default_product_sort",
        typ: u(undefined, ""),
      },
      { json: "image_url", js: "image_url", typ: u(undefined, "") },
      { json: "is_visible", js: "is_visible", typ: u(undefined, true) },
      { json: "layout_file", js: "layout_file", typ: u(undefined, "") },
      {
        json: "meta_description",
        js: "meta_description",
        typ: u(undefined, ""),
      },
      { json: "page_title", js: "page_title", typ: u(undefined, "") },
      { json: "parent_id", js: "parent_id", typ: u(undefined, "") },
      {
        json: "search_keywords",
        js: "search_keywords",
        typ: u(undefined, ""),
      },
      { json: "sort_order", js: "sort_order", typ: u(undefined, 0) },
      { json: "views", js: "views", typ: u(undefined, 0) },
      {
        json: "custom_url",
        js: "custom_url",
        typ: u(undefined, r("CustomURL")),
      },
    ],
    false
  ),
  CustomURL: o(
    [
      { json: "is_customized", js: "is_customized", typ: u(undefined, true) },
      { json: "url", js: "url", typ: u(undefined, "") },
    ],
    false
  ),
  FluffyCategory: o(
    [
      {
        json: "category",
        js: "category",
        typ: u(undefined, r("CategoryCategory")),
      },
    ],
    false
  ),
  PurpleOrder: o(
    [{ json: "order", js: "order", typ: u(undefined, r("FluffyOrder")) }],
    false
  ),
  FluffyOrder: o(
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
  TentacledOrder: o(
    [{ json: "orders", js: "orders", typ: u(undefined, a(r("PurpleOrder"))) }],
    false
  ),
  PurpleProduct: o(
    [
      { json: "app_id", js: "app_id", typ: u(undefined, "") },
      { json: "product", js: "product", typ: u(undefined, r("FluffyProduct")) },
      {
        json: "rate_limit",
        js: "rate_limit",
        typ: u(undefined, r("RateLimit")),
      },
    ],
    false
  ),
  FluffyProduct: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "sku", js: "sku", typ: u(undefined, "") },
      { json: "availability", js: "availability", typ: u(undefined, "") },
      {
        json: "availability_description",
        js: "availability_description",
        typ: u(undefined, ""),
      },
      { json: "is_visible", js: "is_visible", typ: u(undefined, true) },
      {
        json: "bin_picking_number",
        js: "bin_picking_number",
        typ: u(undefined, ""),
      },
      { json: "brand_id", js: "brand_id", typ: u(undefined, "") },
      { json: "categories", js: "categories", typ: u(undefined, a(0)) },
      { json: "condition", js: "condition", typ: u(undefined, "") },
      {
        json: "custom_url",
        js: "custom_url",
        typ: u(undefined, r("CustomURL")),
      },
      {
        json: "display_price",
        js: "display_price",
        typ: u(undefined, r("DisplayPrice")),
      },
      {
        json: "fixed_cost_shipping_price",
        js: "fixed_cost_shipping_price",
        typ: u(undefined, r("DisplayPrice")),
      },
      {
        json: "is_free_shipping",
        js: "is_free_shipping",
        typ: u(undefined, true),
      },
      { json: "name", js: "name", typ: u(undefined, "") },
      { json: "description", js: "description", typ: u(undefined, "") },
      { json: "type", js: "type", typ: u(undefined, "") },
      { json: "dimension", js: "dimension", typ: u(undefined, r("Dimension")) },
      { json: "inventory_level", js: "inventory_level", typ: u(undefined, 0) },
      { json: "meta_keywords", js: "meta_keywords", typ: u(undefined, a("")) },
      {
        json: "search_keywords",
        js: "search_keywords",
        typ: u(undefined, a("")),
      },
      {
        json: "related_products",
        js: "related_products",
        typ: u(undefined, a(0)),
      },
      { json: "reviews_count", js: "reviews_count", typ: u(undefined, 0) },
      {
        json: "reviews_rating_sum",
        js: "reviews_rating_sum",
        typ: u(undefined, 0),
      },
      { json: "total_sold", js: "total_sold", typ: u(undefined, "") },
      { json: "view_count", js: "view_count", typ: u(undefined, "") },
      {
        json: "primary_image",
        js: "primary_image",
        typ: u(undefined, r("Image")),
      },
      { json: "variants", js: "variants", typ: u(undefined, a(r("Variant"))) },
      { json: "images", js: "images", typ: u(undefined, a(r("Image"))) },
      {
        json: "modifiers",
        js: "modifiers",
        typ: u(undefined, a(r("Modifier"))),
      },
      {
        json: "date_created",
        js: "date_created",
        typ: u(undefined, ""),
      },
      {
        json: "date_modified",
        js: "date_modified",
        typ: u(undefined, ""),
      },
      {
        json: "inventory_tracking",
        js: "inventory_tracking",
        typ: u(undefined, ""),
      },
      {
        json: "price_range",
        js: "price_range",
        typ: u(undefined, r("PriceRange")),
      },
    ],
    false
  ),
  Dimension: o(
    [
      { json: "height", js: "height", typ: u(undefined, 0) },
      { json: "width", js: "width", typ: u(undefined, 0) },
      { json: "weight", js: "weight", typ: u(undefined, 0) },
    ],
    false
  ),
  DisplayPrice: o(
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
  Image: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "product_id", js: "product_id", typ: u(undefined, "") },
      { json: "description", js: "description", typ: u(undefined, "") },
      { json: "is_thumbnail", js: "is_thumbnail", typ: u(undefined, true) },
      { json: "sort_order", js: "sort_order", typ: u(undefined, 0) },
      { json: "image_file", js: "image_file", typ: u(undefined, "") },
      {
        json: "url_standard",
        js: "url_standard",
        typ: u(undefined, ""),
      },
      {
        json: "url_thumbnail",
        js: "url_thumbnail",
        typ: u(undefined, ""),
      },
      { json: "url_tiny", js: "url_tiny", typ: u(undefined, "") },
      { json: "url_zoom", js: "url_zoom", typ: u(undefined, "") },
      {
        json: "date_modified",
        js: "date_modified",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
  Modifier: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "product_id", js: "product_id", typ: u(undefined, "") },
      { json: "name", js: "name", typ: u(undefined, "") },
      {
        json: "display_name",
        js: "display_name",
        typ: u(undefined, ""),
      },
      { json: "sort_order", js: "sort_order", typ: u(undefined, 0) },
      { json: "required", js: "required", typ: u(undefined, true) },
      { json: "type", js: "type", typ: u(undefined, "") },
      {
        json: "option_values",
        js: "option_values",
        typ: u(undefined, a(r("OptionValue"))),
      },
    ],
    false
  ),
  OptionValue: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "option_id", js: "option_id", typ: u(undefined, "") },
      { json: "label", js: "label", typ: u(undefined, "") },
      { json: "is_default", js: "is_default", typ: u(undefined, true) },
      { json: "sort_order", js: "sort_order", typ: u(undefined, 0) },
      { json: "adjusters", js: "adjusters", typ: u(undefined, r("Adjusters")) },
      {
        json: "value_data",
        js: "value_data",
        typ: u(undefined, r("ValueData")),
      },
    ],
    false
  ),
  Adjusters: o(
    [
      { json: "price", js: "price", typ: u(undefined, r("Price")) },
      { json: "weight", js: "weight", typ: u(undefined, r("Price")) },
      { json: "image_url", js: "image_url", typ: u(undefined, "") },
      {
        json: "purchasing_disabled",
        js: "purchasing_disabled",
        typ: u(undefined, r("PurchasingDisabled")),
      },
    ],
    false
  ),
  Price: o(
    [
      { json: "adjuster", js: "adjuster", typ: u(undefined, "") },
      { json: "adjuster_value", js: "adjuster_value", typ: u(undefined, 0) },
    ],
    false
  ),
  PurchasingDisabled: o(
    [
      { json: "status", js: "status", typ: u(undefined, true) },
      { json: "message", js: "message", typ: u(undefined, "") },
    ],
    false
  ),
  ValueData: o(
    [
      { json: "colors", js: "colors", typ: u(undefined, a("")) },
      { json: "image_url", js: "image_url", typ: u(undefined, "") },
      { json: "product_id", js: "product_id", typ: u(undefined, "") },
      { json: "checked_value", js: "checked_value", typ: u(undefined, true) },
    ],
    false
  ),
  PriceRange: o(
    [
      {
        json: "additionalProperties",
        js: "additionalProperties",
        typ: u(undefined, r("DisplayPrice")),
      },
    ],
    false
  ),
  Variant: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "sku", js: "sku", typ: u(undefined, "") },
      {
        json: "display_price",
        js: "display_price",
        typ: u(undefined, r("DisplayPrice")),
      },
      {
        json: "fixed_cost_shipping_price",
        js: "fixed_cost_shipping_price",
        typ: u(undefined, r("DisplayPrice")),
      },
      {
        json: "is_free_shipping",
        js: "is_free_shipping",
        typ: u(undefined, true),
      },
      {
        json: "purchasing_disabled",
        js: "purchasing_disabled",
        typ: u(undefined, true),
      },
      { json: "dimension", js: "dimension", typ: u(undefined, r("Dimension")) },
      {
        json: "option_values",
        js: "option_values",
        typ: u(undefined, a(r("AdditionalProperties"))),
      },
      { json: "inventory_level", js: "inventory_level", typ: u(undefined, 0) },
      { json: "image_url", js: "image_url", typ: u(undefined, "") },
      {
        json: "option_value_map",
        js: "option_value_map",
        typ: u(undefined, r("OptionValueMap")),
      },
    ],
    false
  ),
  OptionValueMap: o(
    [
      {
        json: "additionalProperties",
        js: "additionalProperties",
        typ: u(undefined, r("AdditionalProperties")),
      },
    ],
    false
  ),
  AdditionalProperties: o(
    [
      { json: "id", js: "id", typ: u(undefined, "") },
      { json: "option_id", js: "option_id", typ: u(undefined, "") },
      { json: "label", js: "label", typ: u(undefined, "") },
      {
        json: "option_display_name",
        js: "option_display_name",
        typ: u(undefined, ""),
      },
      {
        json: "value_data",
        js: "value_data",
        typ: u(undefined, r("ValueData")),
      },
    ],
    false
  ),
  RateLimit: o(
    [
      { json: "request_left", js: "request_left", typ: u(undefined, 0) },
      { json: "request_quota", js: "request_quota", typ: u(undefined, 0) },
      { json: "time_reset_ms", js: "time_reset_ms", typ: u(undefined, 0) },
      { json: "time_window_ms", js: "time_window_ms", typ: u(undefined, 0) },
    ],
    false
  ),
  TentacledProduct: o(
    [
      { json: "app_id", js: "app_id", typ: u(undefined, "") },
      {
        json: "products",
        js: "products",
        typ: u(undefined, a(r("PurpleProduct"))),
      },
      {
        json: "rate_limit",
        js: "rate_limit",
        typ: u(undefined, r("RateLimit")),
      },
      { json: "last_id", js: "last_id", typ: u(undefined, "") },
      { json: "more_results", js: "more_results", typ: u(undefined, true) },
    ],
    false
  ),
  ShippingOption: o([], false),
  ShippingZones: o(
    [
      {
        json: "shipping_zones",
        js: "shipping_zones",
        typ: u(undefined, a(r("ShippingZone"))),
      },
    ],
    false
  ),
  ShippingZone: o(
    [
      {
        json: "country_iso2",
        js: "country_iso2",
        typ: u(undefined, ""),
      },
      {
        json: "subdivision_iso2",
        js: "subdivision_iso2",
        typ: u(undefined, ""),
      },
    ],
    false
  ),
  ReadOrderResponseUser: o(
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
        typ: u(undefined, r("DisplayPrice")),
      },
    ],
    false
  ),
  string: ["string"],
};
