import { OrderAddressExtensionAttributes } from "./order-address-extension-attributes";

export interface OrderAddress {
  address_type?: string;
  city?: string;
  company?: string;
  country_id?: string;
  customer_address_id?: number;
  customer_id?: number;
  email?: string;
  entity_id?: number;
  fax?: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  parent_id?: number;
  postcode?: string;
  prefix?: string;
  region?: string;
  region_code?: string;
  region_id?: number;
  street?: string[];
  suffix?: string;
  telephone?: string;
  vat_id?: string;
  vat_is_valid?: number;
  vat_request_date?: string;
  vat_request_id?: string;
  vat_request_success?: number;
  extension_attributes?: OrderAddressExtensionAttributes;
}
