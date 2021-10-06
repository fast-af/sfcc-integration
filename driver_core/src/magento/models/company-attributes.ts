import { ExtensionAttributesElement } from "./extension-attributes-element";

export default interface CompanyAttributes {
  /**
   * @interface {number}
   * @memberof CustomerExtensionAttributes
   */
  customer_id?: number;

  /**
   * @interface {number}
   * @memberof CustomerExtensionAttributes
   */
  company_id?: number;

  /**
   * @interface {string}
   * @memberof CustomerExtensionAttributes
   */
  job_title?: string;

  /**
   * @interface {number}
   * @memberof CustomerExtensionAttributes
   */
  status?: number;

  /**
   * @interface {string}
   * @memberof CustomerExtensionAttributes
   */
  telephone?: string;

  /**
   * @interface {ExtensionAttributesElement}
   * @memberof CustomerExtensionAttributes
   */
  extension_attributes?: ExtensionAttributesElement;
}
