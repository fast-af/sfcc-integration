import { V1OrderLine } from "../../core/object-definitions/v1/models";
import { V1ItemFulfillmentMode } from "../../core/object-definitions/v1/models/v1-item-fulfillment-mode";
import { ProductLinePriceAdjustmentToV1ResponseMap } from "./v1-fast-price-adjustment";

/**
 * Object mapping schema to map the SFCC Product Line object
 * to the Fast V1Response object.
 */
const ProductLineToV1ResponseMap = {  // lines
  "product_items[].c_fastProdLineId": [
    {
      key: "order.order.lines[].id.value",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.lineRefs[].id.value",
      transform: (value: string): string => value,
    },
  ],
  "product_items[].item_id": [
    {
      key: "order.order.lines[].externalId",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.lines[].fulfillmentMode",
      transform: (): string => V1ItemFulfillmentMode.PHYSICAL,
    },
    {
      key: "order.order.lineRefs[].externalId",
      transform: (value: string): string => value,
    },
  ],
  "product_items[].c_parentProductId": "order.order.lines[].externalProductId",
  "product_items[].product_id": [
    {
      key: "order.order.lines[].externalVariantId",
      transform: (value: string): string => value,
    },
    {
      key: "order.order.lines[].externalProductId",
      transform: (sourceValue: string, sourceObject: any, destinationObject: V1OrderLine): string => 
        (destinationObject && !Array.isArray(destinationObject))
          ? (destinationObject.externalProductId ? destinationObject.externalProductId : sourceValue)
          : sourceValue,
    },
  ],
  // TODO: externalOptions
  // TODO: customizations
  "product_items[].quantity": [
    {
      key: "order.order.lines[].quantity",
      transform: (value: number): number => value,
    },
    {
      key: "order.order.lines[].quantityFulfilled",
      transform: (value: number): number => value,
    },
    {
      key: "order.order.lineRefs[].quantity",
      transform: (value: number): number => value,
    },
  ],
  "product_items[].base_price": {
    key: "order.order.lines[].unitPrice",
    transform: (value: number): string | unknown => value ? value.toString() : "0",
  },
  // discountedUnitPrice - calculated value.
  "product_items[].c_discountedUnitPrice": {
    key: "order.order.lines[].discountedUnitPrice",
    transform: (value: number): string | unknown => value ? value.toString() : "0",
  },
  // lineDiscountAmount - calculated value.
  "product_items[].c_lineDiscountAmount": {
    key: "order.order.lines[].lineDiscountAmount",
    transform: (value: number): string | unknown => value ? value.toString() : "0",
  },
  "product_items[].tax": {
    key: "order.order.lines[].taxAmount",
    transform: (value: number): string | unknown => value ? value.toString() : "0",
  },
  // totalAmount and subtotalAmount.
  "product_items[].price_after_item_discount": [
    {
      key: "order.order.lines[].totalAmount",
      transform: (value: number): string | unknown => value ? value.toString() : "0",
    },
    {
      key: "order.order.lines[].subtotalAmount",
      transform: (value: number): string | unknown => value ? value.toString() : "0",
    },
  ],

  // discounts a.k.a. SFCC price adjustments
  // Call v1-fast-price-adjustment to merge the object.
  ...ProductLinePriceAdjustmentToV1ResponseMap,

  "product_items[].product_name": "order.order.lines[].name",
  "product_items[].item_text": "order.order.lines[].description",
  "product_items[].image_url": "order.order.lines[].imageUrl",
};

export { ProductLineToV1ResponseMap };