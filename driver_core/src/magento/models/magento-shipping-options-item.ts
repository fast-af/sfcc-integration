export default interface MagentoShippingOptionsItem {
  amount?: number;
  available?: boolean;
  base_amount: number;
  carrier_code: string;
  carrier_title: string;
  error_message: string;
  extension_attributes: Record<string, unknown>;
  method_code: string;
  method_title: string;
  price_excl_tax: number;
  price_incl_tax: number;
}
