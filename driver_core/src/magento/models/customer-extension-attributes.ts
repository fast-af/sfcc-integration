import CompanyAttributes from "./company-attributes";

export default interface CustomerExtensionAttributes {
  /**
   * @interface {CompanyAttributes}
   * @memberof CustomerExtensionAttributes
   */
  company_attributes?: CompanyAttributes;

  /**
   * @interface {number}
   * @memberof CustomerExtensionAttributes
   */
  assistance_allowed?: number;

  /**
   * @interface {boolean}
   * @memberof CustomerExtensionAttributes
   */
  is_subscribed?: boolean;

  /**
   * @interface {string}
   * @memberof CustomerExtensionAttributes
   */
  amazon_id?: string;

  /**
   * @interface {string}
   * @memberof CustomerExtensionAttributes
   */
  vertex_customer_code?: string;

  /**
   * @interface {string}
   * @memberof CustomerExtensionAttributes
   */
  vertex_customer_country?: string;
}
