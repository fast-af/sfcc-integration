import { referenceEnclosing } from "./function-utils";
import { pinoProd, formattedLog } from "../../../../util/common-util";

/**
 * A common class to convert the incoming Fast request
 * object JSON to a typesafe object.
 */
export class ConvertObject {
  /**
   * Private members
   */
  baseType: any;

  /**
   * Constructor.
   * 
   * @param refBaseType
   */
  constructor(refBaseType: any) {
    this.baseType = refBaseType;
  };

  /**
   * Throw error for an invalid value.
   * 
   * @param typ
   * @param val
   * @param key {string} - the property name.
   */
  private invalidValue(typ: any, val: any, key = ""): never {
    if (key) {
      throw Error(
        `Invalid value for key "${key}". Expected type ${JSON.stringify(
          typ
        )} but got ${JSON.stringify(val)}`
      );
    };

    throw Error(
      `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
    );  
  };

  /**
   * JSON to JS.
   * 
   * @param typ
   * @returns {any}
   */
  private jsonToJSProps = (typ: any): any => {
    if (typ.jsonToJS === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
      typ.jsonToJS = map;
    }
    return typ.jsonToJS;
  };

  /**
   * JS to JSON.
   * 
   * @param typ
   * @returns {any}
   */
  private jsToJSONProps = (typ: any): any => {
    if (typ.jsToJSON === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
      typ.jsToJSON = map;
    }

    return typ.jsToJSON;
  };

  /**
   * Main transform function.
   * 
   * @param val
   * @param typ
   * @param getProps
   * @param key {string} - the property name.
   * @returns {any}
   */
  private transform = (
    val: any,
    typ: any,
    getProps: any,
    key = ""
  ): any => {
    /**
     * Transform primitive value.
     * 
     * @param typ
     * @param val
     * @returns {any}
     */
    const transformPrimitive = (typ: string, val: any): any => {
      if (typeof typ === typeof val) return val;
      return this.invalidValue(typ, val, key);
    };

    /**
     * Transform union.
     * 
     * @param typs
     * @param val
     * @returns {any}
     */
    const transformUnion = (typs: any[], val: any): any => {
      // val must validate against one typ in typs
      const l = typs.length;
      for (let i = 0; i < l; i++) {
        const typ = typs[i];
        try {
          return this.transform(val, typ, getProps);
        } catch (_) {
          //
        }
      }

      return this.invalidValue(typs, val);
    };

    /**
     * Transform Enum.
     * 
     * @param cases
     * @param val
     * @returns {any}
     */
    const transformEnum = (cases: string[], val: any): any => {
      if (cases.indexOf(val) !== -1) return val;
      return this.invalidValue(cases, val);
    };

    /**
     * Transform Array.
     * @param typ
     * @param val
     * @returns {any}
     */
    const transformArray = (typ: any, val: any): any => {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return this.invalidValue("array", val);
      return val.map((el) => this.transform(el, typ, getProps));
    };

    /**
     * Transform date value.
     * 
     * @param val
     * @returns {any}
     */
    const transformDate = (val: any): any => {
      if (val === null) {
        return null;
      }
      const d = new Date(val);
      if (isNaN(d.valueOf())) {
        return this.invalidValue("Date", val);
      }
      return d;
    };

    /**
     * Transform object.
     * 
     * @param props
     * @param additional
     * @param val
     * @returns {any}
     */
    const transformObject = (
      props: { [k: string]: any },
      additional: any,
      val: any
    ): any => {
      if (val === null || typeof val !== "object" || Array.isArray(val)) {
        return this.invalidValue("object", val);
      }

      const result: any = {};
      Object.getOwnPropertyNames(props).forEach((key) => {
        const prop = props[key];
        const v = Object.prototype.hasOwnProperty.call(val, key)
          ? val[key]
          : undefined;
        result[prop.key] = this.transform(v, prop.typ, getProps, prop.key);
      });

      Object.getOwnPropertyNames(val).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(props, key)) {
          result[key] = this.transform(val[key], additional, getProps, key);
        }
      });

      return result;
    };

    // Check for the type to be any.
    if (typ === "any") return val;
    // Check if type is null.
    if (typ === null) {
      if (val === null) return val;
      return this.invalidValue(typ, val);
    }
    if (typ === false) return this.invalidValue(typ, val);

    while (typeof typ === "object" && typ.ref !== undefined) {
      typ = this.baseType[typ.ref];
    }
    // Check for Enum.
    if (Array.isArray(typ)) return transformEnum(typ, val);
    // Check for object.
    if (typeof typ === "object") {
      return Object.prototype.hasOwnProperty.call(typ, "unionMembers")
        ? transformUnion(typ.unionMembers, val)
        : Object.prototype.hasOwnProperty.call(typ, "arrayItems")
          ? transformArray(typ.arrayItems, val)
          : Object.prototype.hasOwnProperty.call(typ, "props")
            ? transformObject(getProps(typ), typ.additional, val)
            : this.invalidValue(typ, val);
    }
    // Check for date.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
  };

  /**
   * Direct cast to the V1 request.
   * 
   * @param val {Type} - Serialized JSON object.
   * @param typ {Object} - V1 request object type.
   * @returns {Type} - Converted V1 object.
   */
  private cast<Type>(val: any, typ: any): Type {
    try {
      return this.transform(val, typ, this.jsonToJSProps, this.baseType);
    } catch (error) {
      pinoProd.error(formattedLog("Transformation Error!", error));
      throw new Error("1008");
    };
  };

  /**
   * Direct uncast to the respective JSON.
   * 
   * @param val {Type} - V1 response.
   * @param typ {Object} - V1 response object type.
   * @returns {Object} - The target Fast response object.
   */
  private uncast<Type>(val: Type, typ: any): any {
    try {
      return this.transform(val, typ, this.jsToJSONProps, this.baseType);
    } catch (error) {
      pinoProd.error(formattedLog("Transformation Error!", error));
      throw new Error("1008");
    };
  };

  /**
   * Convert from a Fast request to one of the V1 request type.
   * 
   * @param json {string} - Serialized Fast request object.
   * @param objectName {string} - Object name to convert to.
   * @returns {Type} - V1 request object.
   */
  public jsonToObject<Type>(json: string, objectName: string): Type {
    return this.cast(JSON.parse(json), referenceEnclosing(objectName));
  };

  /**
   * Convert from one of the V1 response type to Fast compatible reponse type.
   * 
   * @param value {Type} - One of the V1 response.
   * @param objectName {string} - Object name to convert to.
   * @returns {any} - Fast compatible response object.
   */
  public objectToJson<Type>(value: Type, objectName: string): string {
    return this.uncast(value, referenceEnclosing(objectName));
  };
};