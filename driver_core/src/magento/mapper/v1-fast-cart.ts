import {
  V1OrderStatus,
  V1OrderType,
  V1ItemFulfillmentMode,
  V1DiscountOrigin,
  V1DiscountType,
} from "../../core/object-definitions/v1/models";

/**
 * Object mapping schema to map the Fast V1CreateRequest object
 * to the Magento Cart object
 */
const V1CreateRequestToCartMap = {
  "order.order.lines[]": [
    {
      key: "products[].extension_attributes.fast_order_item_uuid",
      transform: (value: any): string => {
        if (typeof value === "object") {
          return value.id.value;
        } else {
          return value;
        }
      },
    },
    {
      key: "products[].qty",
      transform: (value: any): number => {
        if (typeof value === "object") {
          return value.quantity;
        } else {
          return value;
        }
      },
    },
    {
      key: "products[].product_option.extension_attributes.configurable_item_options",
      transform: (value: any): Array<unknown> => {
        if (typeof value === "object" && !Array.isArray(value)) {
          const finalArray = [] as Array<unknown>;
          const options = value.externalOptions;
          options.map((option: any): unknown => {
            const { key } = option;
            const { value } = option;
            if (key.toLowerCase() !== "sku") {
              finalArray.push({
                option_id: parseInt(key),
                option_value: parseInt(value),
              });
            }
            return;
          });
          return finalArray;
        } else {
          return value;
        }
      },
    },
    {
      key: "products[].sku",
      transform: (value: any): string => {
        if (typeof value === "object") {
          const keyValue = value.externalOptions.filter((option: any) => {
            return option.key.toLowerCase() === "sku";
          });
          const sku = keyValue[0].value;
          return sku;
        } else {
          return value;
        }
      },
    },
  ],
};

const V1UpdateRequestToCartMap = {
  "order.lines[]": [
    {
      key: "products[].extension_attributes.fast_order_item_uuid",
      transform: (value: any): string => {
        if (typeof value === "object") {
          return value.itemId.value;
        } else {
          return value;
        }
      },
    },
    {
      key: "products[].qty",
      transform: (value: any): number => {
        if (typeof value === "object") {
          return value.quantity;
        } else {
          return value;
        }
      },
    },
    {
      key: "products[].product_option.extension_attributes.configurable_item_options",
      transform: (value: any): Array<unknown> => {
        if (typeof value === "object" && !Array.isArray(value)) {
          const finalArray = [] as Array<unknown>;
          const options = value.externalOptions;
          options.map((option: any): unknown => {
            const { key } = option;
            const { value } = option;
            if (key.toLowerCase() !== "sku") {
              finalArray.push({
                option_id: parseInt(key),
                option_value: parseInt(value),
              });
            }
            return;
          });
          return finalArray;
        } else {
          return value;
        }
      },
    },
    {
      key: "products[].sku",
      transform: (value: any): string => {
        if (typeof value === "object") {
          const keyValue = value.externalOptions.filter((option: any) => {
            return option.key.toLowerCase() === "sku";
          });
          const sku = keyValue[0].value;
          return sku;
        } else {
          return value;
        }
      },
    },
  ],
};

/**
 * Object mapping schema to map the Fast V1ReadRequest object
 * to the Magento Cart object
 */
const V1ReadRequestToCartMap = {
  "order.externalId": "cartId",
};

/**
 * Object mapping schema to map the available Shipping Options
 * to the Fast V1Response object
 */
const ShippingOptionsToV1ResponseMap = {
  "shippingOptions[].carrier_code":
    "order.order.shipmentPlans[].availableOptions[].carrier",
};

/**
 * Object mapping schema to map Magento Cart totals
 * to the Fast V1ReadResponse object
 */
const TotalsToV1ResponseMap = {
  "totals.base_currency_code": "order.order.currencyCode",
  "totals.base_subtotal": {
    key: "order.order.subTotal",
    transform: (value: number): string | null =>
      value ? value.toString() : null,
  },
  "totals.grand_total": {
    key: "order.order.totalAmount",
    transform: (value: number): string | null =>
      value ? value.toString() : null,
  },
  "totals.tax_amount": {
    key: "order.order.totalTax",
    transform: (value: number): string | null =>
      value ? value.toString() : null,
  },
  "totals.discount_amount": {
    key: "order.order.totalDiscounts",
    transform: (value: number): string | null =>
      value ? Math.abs(value).toString() : null,
  },
  "totals.shipping_amount": {
    key: "order.order.totalShipping",
    transform: (value: number): string | null =>
      value ? Math.abs(value).toString() : null,
  },

  "totals.items[]": [
    {
      key: "order.order.lines[].unitPrice",
      transform: (input: any): string | null => {
        if (!input) {
          return null;
        }

        if (typeof input === "string") {
          return input;
        } else {
          return input.price.toString();
        }
      },
    },
    {
      key: "order.order.lines[].discountedUnitPrice",
      transform: (input: any): string | null => {
        if (!input) {
          return null;
        }

        if (typeof input === "string") {
          return input;
        } else {
          let discountedPrice = 0;
          if (input && input.price && input.discount_amount && input.qty) {
            discountedPrice = input.price - input.discount_amount / input.qty;
            return discountedPrice.toString();
          } else {
            discountedPrice = input.price;
            return discountedPrice.toString();
          }
        }
      },
    },
    {
      key: "order.order.lines[].lineDiscountAmount",
      transform: (input: any): string | null => {
        if (!input) {
          return null;
        }

        if (typeof input === "string") {
          return input;
        } else {
          const discountAmount = input.discount_amount
            ? input.discount_amount
            : 0;
          return discountAmount.toString();
        }
      },
    },
    {
      key: "order.order.lines[].discounts[].applied",
      transform: (input: any): boolean | null => {
        if (!input) {
          return null;
        }

        if (typeof input === "boolean") {
          return input;
        } else {
          const discountAmount = input.discount_amount;
          return discountAmount && discountAmount > 0 ? true : false;
        }
      },
    },
    {
      key: "order.order.lines[].discounts[].totalAmount",
      transform: (input: any): string | null => {
        if (!input) {
          return null;
        }

        if (typeof input === "string") {
          return input;
        } else {
          const totalDiscount = input.discount_amount
            ? input.discount_amount
            : 0;
          return totalDiscount.toString();
        }
      },
    },
    {
      key: "order.order.lines[].subtotalAmount",
      transform: (input: any): string | null => {
        if (!input) {
          return null;
        }

        if (typeof input === "string") {
          return input;
        } else {
          let subtotal = 0;
          if (
            input.row_total_incl_tax &&
            input.tax_amount &&
            input.discount_amount
          ) {
            subtotal =
              input.row_total_incl_tax -
              input.tax_amount -
              input.discount_amount;
          } else {
            subtotal = input.row_total_incl_tax - input.tax_amount;
          }
          return subtotal.toString();
        }
      },
    },
    {
      key: "order.order.lines[].totalAmount",
      transform: (input: any): string | null => {
        if (!input) {
          return null;
        }

        if (typeof input === "string") {
          return input;
        } else if (typeof input === "number") {
          return input.toString()
        } else {
          return input.row_total.toString();
        }
      },
    },
  ],
};

/**
 * Object mapping schema to map the Magento Cart object
 * to the Fast V1ReadResponse object
 */
const CartToV1ResponseMap = {
  id: {
    key: "order.order.externalId",
    transform: (value: number): string | null => value ? value.toString() : null,
  },
  is_active: [
    {
      key: "order.order.status",
      transform: (value: boolean): string => {
        return value ? V1OrderStatus.CART : V1OrderStatus.UNSPECIFIED;
      },
    },
    {
      key: "order.order.orderType",
      transform: (): string => V1OrderType.CART,
    },
  ],
  "customer.id": "order.order.user_id",
  "items[].qty": "order.order.lines[].quantity",
  "billing_address.firstname": "order.order.billTo.firstName",
  "billing_address.lastname": "order.order.billTo.lastName",
  "billing_address.middlename": "order.order.billTo.middleName",
  "billing_address.company": "order.order.billTo.company",
  "billing_address.email": "order.order.billTo.email",
  "billing_address.telephone": "order.order.billTo.phone",
  "billing_address.street[0]": "order.order.billTo.address1",
  "billing_address.street[1]": "order.order.billTo.address2",
  "billing_address.city": "order.order.billTo.cityLocality",
  "billing_address.region": "order.order.billTo.stateProvince",
  "billing_address.region_code": "order.order.billTo.stateProvinceCode",
  "billing_address.country_id?": "order.order.billTo.country",
  "billing_address.postcode": "order.order.billTo.postalCode",
  "items[].item_id": [
    {
      key: "order.order.lines[].externalId",
      transform: (value: number): string | null => {
        return value ? value.toString() : null;
      },
    },
    {
      key: "order.order.lines[].fulfillmentMode",
      transform: (value: number): string | null => {
        if (!value) {
          return null;
        }
        return V1ItemFulfillmentMode.PHYSICAL;
      },
    },
  ],
  "items[].product_id": {
    key: "order.order.lines[].externalProductId",
    transform: (value: number): string | null => {
      return value ? value.toString() : null;
    },
  },
  "items[].variant_id": {
    key: "order.order.lines[].externalVariantId",
    transform: (value: number): string | null => {
      return value ? value.toString() : null;
    },
  },
  "items[].name": "order.order.lines[].name",
  "items[].image_url": "order.order.lines[].imageUrl",
  "items[].imageUrl": "order.order.lines[].imageUrl",
  "items[].extension_attributes.fast_order_item_uuid": [
    {
      key: "order.order.lines[].id.value",
      transform: (value: string): string => value,
    },
  ],
  customer_note: "order.order.userNote",
  ...TotalsToV1ResponseMap,
};

const selectedOptionMap = {
  "extension_attributes.shipping_assignments[].shipping.method":
    "order.order.shipmentPlans[].selectedOption.externalId",
  "extension_attributes.shipping_assignments[]": [
    {
      key: "order.order.shipmentPlans[].selectedOption.name",
      transform: (input: any): string | null => {
        if (
          input &&
          typeof input === "object" &&
          input.magentoShippingOptions &&
          input.shipping.method
        ) {
          let name = "";
          const selectedMethod = input.shipping.method.split("_");
          const carrierCode = selectedMethod[0];
          const methodCode = selectedMethod[1];

          if (carrierCode && methodCode) {
            name = input.magentoShippingOptions.filter(
              (option: any) =>
                option.carrier_code === carrierCode &&
                option.method_code === methodCode
            )[0].method_title;
          }
          return name;
        } else if (
          input &&
          typeof input === "object" &&
          (!input.magentoShippingOptions || !input.shipping.method)
        ) {
          // If update that is non-shipping related like billing
          return null;
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].selectedOption.cost",
      transform: (input: any): string | null => {
        if (
          input &&
          typeof input === "object" &&
          input.magentoShippingOptions &&
          input.shipping.method
        ) {
          let cost = 0;
          const selectedMethod = input.shipping.method.split("_");
          const carrierCode = selectedMethod[0];
          const methodCode = selectedMethod[1];
          if (carrierCode && methodCode) {
            cost = input.magentoShippingOptions.filter(
              (option: any) =>
                option.carrier_code === carrierCode &&
                option.method_code === methodCode
            )[0].price_excl_tax;
          }
          return cost.toString();
        } else if (
          input &&
          typeof input === "object" &&
          (!input.magentoShippingOptions || !input.shipping.method)
        ) {
          // If update that is non-shipping related like billing
          return null;
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].selectedOption.tax",
      transform: (input: any): string | null => {
        if (
          input &&
          typeof input === "object" &&
          input.magentoShippingOptions &&
          input.shipping.method
        ) {
          let cost = 0;
          let costPlusTax = 0;
          let tax = 0;
          const selectedMethod = input.shipping.method.split("_");
          const carrierCode = selectedMethod[0];
          const methodCode = selectedMethod[1];
          if (carrierCode && methodCode) {
            cost = input.magentoShippingOptions.filter(
              (option: any) =>
                option.carrier_code === carrierCode &&
                option.method_code === methodCode
            )[0].price_excl_tax;
            costPlusTax = input.magentoShippingOptions.filter(
              (option: any) =>
                option.carrier_code === carrierCode &&
                option.method_code === methodCode
            )[0].price_incl_tax;
            tax = costPlusTax - cost;
          }
          return tax.toString();
        } else if (
          input &&
          typeof input === "object" &&
          (!input.magentoShippingOptions || !input.shipping.method)
        ) {
          // If update that is non-shipping related like billing
          return null;
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].selectedOption.total",
      transform: (input: any): string | null => {
        if (
          input &&
          typeof input === "object" &&
          input.magentoShippingOptions &&
          input.shipping.method
        ) {
          let cost = 0;
          const selectedMethod = input.shipping.method.split("_");
          const carrierCode = selectedMethod[0];
          const methodCode = selectedMethod[1];
          if (carrierCode && methodCode) {
            cost = input.magentoShippingOptions.filter(
              (option: any) =>
                option.carrier_code === carrierCode &&
                option.method_code === methodCode
            )[0].price_incl_tax;
          }
          return cost.toString();
        } else if (
          input &&
          typeof input === "object" &&
          (!input.magentoShippingOptions || !input.shipping.method)
        ) {
          // If update that is non-shipping related like billing
          return null;
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].selectedOption.serviceLevel",
      transform: (input: any): string | null => {
        if (
          input &&
          typeof input === "object" &&
          input.magentoShippingOptions &&
          input.shipping.method
        ) {
          let serviceLevel = "";
          const selectedMethod = input.shipping.method.split("_");
          const carrierCode = selectedMethod[0];
          const methodCode = selectedMethod[1];
          if (carrierCode && methodCode) {
            const carrierTitle = input.magentoShippingOptions.filter(
              (option: any) =>
                option.carrier_code === carrierCode &&
                option.method_code === methodCode
            )[0].carrier_title;
            const methodTitle = input.magentoShippingOptions.filter(
              (option: any) =>
                option.carrier_code === carrierCode &&
                option.method_code === methodCode
            )[0].method_title;

            serviceLevel = `${carrierTitle} ${methodTitle}`;
          }
          return serviceLevel.toString();
        } else if (
          input &&
          typeof input === "object" &&
          (!input.magentoShippingOptions || !input.shipping.method)
        ) {
          // If update that is non-shipping related like billing
          return null;
        } else {
          return input;
        }
      },
    },
  ],
};

const shippingAddressMap = {
  "extension_attributes.shipping_assignments[].shipping.address.firstname":
    "order.order.shipmentPlans[].shipTo.firstName",
  "extension_attributes.shipping_assignments[].shipping.address.lastname":
    "order.order.shipmentPlans[].shipTo.lastName",
  "extension_attributes.shipping_assignments[].shipping.address.middlename":
    "order.order.shipmentPlans[].shipTo.middleName",
  "extension_attributes.shipping_assignments[].shipping.address.company":
    "order.order.shipmentPlans[].shipTo.company",
  "extension_attributes.shipping_assignments[].shipping.address.email":
    "order.order.shipmentPlans[].shipTo.email",
  "extension_attributes.shipping_assignments[].shipping.address.telephone":
    "order.order.shipmentPlans[].shipTo.phone",
  "extension_attributes.shipping_assignments[].shipping.address.street[0]": {
    key: "order.order.shipmentPlans[].shipTo.address1",
    transform: (value: string): string | null => {
      if (value === "") {
        return null;
      } else {
        return value;
      }
    },
  },
  "extension_attributes.shipping_assignments[].shipping.address.street[1]":
    "order.order.shipmentPlans[].shipTo.address2",
  "extension_attributes.shipping_assignments[].shipping.address.city":
    "order.order.shipmentPlans[].shipTo.cityLocality",
  "extension_attributes.shipping_assignments[].shipping.address.region":
    "order.order.shipmentPlans[].shipTo.stateProvince",
  "extension_attributes.shipping_assignments[].shipping.address.region_code":
    "order.order.shipmentPlans[].shipTo.stateProvinceCode",
  "extension_attributes.shipping_assignments[].shipping.address.country_id":
    "order.order.shipmentPlans[].shipTo.country",
  "extension_attributes.shipping_assignments[].shipping.address.postcode":
    "order.order.shipmentPlans[].shipTo.postalCode",
};

const availableOptionsMap = {
  "extension_attributes.shipping_assignments[].magentoShippingOptions[]": [
    {
      key: "order.order.shipmentPlans[].availableOptions[].externalId",
      transform: (input: any): unknown => {
        if (Array.isArray(input)) {
          return input.map((option) => {
            return `${option.carrier_code}_${option.method_code}`;
          });
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].availableOptions[].name",
      transform: (input: any): unknown => {
        if (Array.isArray(input)) {
          return input.map((option) => {
            return option.method_title;
          });
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].availableOptions[].cost",
      transform: (input: any): unknown => {
        if (Array.isArray(input)) {
          return input.map((option) => {
            return option.price_excl_tax.toString();
          });
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].availableOptions[].tax",
      transform: (input: any): unknown => {
        if (Array.isArray(input)) {
          return input.map((option) => {
            const cost = option.price_excl_tax;
            const costPlusTax = option.price_incl_tax;
            const tax = costPlusTax - cost;
            return tax.toString();
          });
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].availableOptions[].total",
      transform: (input: any): unknown => {
        if (Array.isArray(input)) {
          return input.map((option) => {
            return option.price_incl_tax.toString();
          });
        } else {
          return input;
        }
      },
    },
    {
      key: "order.order.shipmentPlans[].availableOptions[].serviceLevel",
      transform: (input: any): unknown => {
        if (Array.isArray(input)) {
          return input.map((option) => {
            return `${option.carrier_title} ${option.method_title}`;
          });
        } else {
          return input;
        }
      },
    },
  ],
  "extension_attributes.shipping_assignments[].items[]": {
    key: "order.order.shipmentPlans[].lines[]",
    transform: (input: any[]): unknown => {
      if (input && Array.isArray(input)) {
        return input.map((item) => {
          const qty = item.qty ? item.qty : item.qty_ordered

          if (item.item_id) {
            return {
              externalId: item.item_id.toString(),
              quantity: qty,
            };
          }
        });
      } else if (input) {
        return input;
      }
    },
  },
};

const couponMap = {
  "totals.discount_amount": [
    {
      key: "order.order.coupons[].totalAmount",
      transform: (value: number): string | null => {
        const total = Math.abs(value);
        return total > 0 ? Math.abs(value).toString() : null;
      },
    },
    {
      key: "order.order.coupons[].applied",
      transform: (value: number): boolean | null => {
        const total = Math.abs(value);
        return total > 0 ? true : null;
      },
    },
    {
      key: "order.order.coupons[].type",
      transform: (value: number): string | null => {
        const total = Math.abs(value);
        return total > 0 ? V1DiscountType.REGULAR : null;
      },
    },
    {
      key: "order.order.coupons[].origin",
      transform: (value: number): string | null => {
        const total = Math.abs(value);
        return total > 0 ? V1DiscountOrigin.USER : null;
      },
    },
  ],
  "totals.coupon_code": "order.order.coupons[].code",
};

const readShippingPlanMap = {
  ...shippingAddressMap,
  ...couponMap,
  ...selectedOptionMap,
  ...availableOptionsMap,
};

const updateShippingPlanMap = {
  ...shippingAddressMap,
  ...selectedOptionMap,
  ...availableOptionsMap,
  ...couponMap,
};

export {
  V1CreateRequestToCartMap,
  V1ReadRequestToCartMap,
  CartToV1ResponseMap,
  ShippingOptionsToV1ResponseMap,
  readShippingPlanMap,
  updateShippingPlanMap,
  V1UpdateRequestToCartMap,
};
