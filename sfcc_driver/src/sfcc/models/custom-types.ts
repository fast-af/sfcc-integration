/**
 * Custom types.
 */

// Type to extract image url from
// the OCAPI.Product payload.
type ReducedImage = {
  id: string,
  url: string,
  variant: boolean,
};
// Type to send payload to SFCC
// for customer association.
type BasketResourceCustomer = {
  _resource_state: string,
  c_fastEmailId: string,
};
// Type to send payload to SFCC
// to update product line item.
type BasketLineItem = {
  _resource_state?: string,
  product_id: string,
  quantity: number,
  c_fastProdLineId?: string,
};

export { ReducedImage, BasketResourceCustomer, BasketLineItem };