import { FastCheckoutCartButton } from "../../fast-js";

// INCIDENT - 146 Popup blocker was firing on ios
// Types for the BC Cart response

// interface Option {
//   nameId: string;
//   valueId: string;
// }
// interface Item {
//   productId: string;
//   variantId: string;
//   quantity: number;
//   options?: Option[];
// }

// interface Cart {
//   lineItems?: CartItems;
// }
// interface CartItems {
//   customItems: Item[];
//   digitalItems: Item[];
//   physicalItems: Item[];
// }

export class BCFastCheckoutCartButton extends FastCheckoutCartButton {
  get platform() {
    return "bigcommerce";
  }

  // INCIDENT - 146 Popup blocker was firing on ios
  // fetchCartData = async () => {
  //   const res = await (
  //     await fetch(
  //       location.origin +
  //         "/api/storefront/cart?include=lineItems.physicalItems.options,lineItems.digitalItems.options"
  //     )
  //   ).json();

  //   const products: PlatformProduct[] = [];

  //   // Get the products from the BC cart response
  //   res.forEach((a: Cart) => {
  //     const lineItems = a.lineItems;
  //     const items = [
  //       lineItems?.customItems,
  //       lineItems?.digitalItems,
  //       lineItems?.physicalItems,
  //     ];
  //     items?.forEach((itemType) =>
  //       itemType?.forEach((item: Item) => {
  //         const option_values = item.options?.map((option) => ({
  //           option_id: option.nameId?.toString(),
  //           option_value: option.valueId?.toString(),
  //         }));

  //         products.push({
  //           product_id: item.productId?.toString(),
  //           variant_id: item.variantId?.toString(),
  //           quantity: item.quantity,
  //           option_values,
  //         });
  //       })
  //     );
  //   });

  //   this.cart_data = JSON.stringify(products);
  //   this.cart_id = res[0].id;

  //   return this.cart_data;
  // };

  // handleCompletedOrder() {
  //   super.handleCompletedOrder();

  //   // Clear the cart
  //   fetch(location.origin + `/api/storefront/carts/${this.cart_id}`, {
  //     method: "DELETE",
  //   });
  // }
}
