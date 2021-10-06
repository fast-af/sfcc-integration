/* eslint-disable indent */
import ApiService from "./api-service";
import CartItem from "../../models/cart-item";
import { CartResponse } from "../../models/cart";
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import { AxiosResponse } from "axios";

export default class CartService extends ApiService {
  /**
   * Create new guest user cart
   *
   * @returns {object} New guest cart
   */
  async createCart(fastOrderId: string): Promise<string> {
    try {
      const payload = {
        extension_attributes: {
          fast_order_id: fastOrderId,
        },
      };
      const http = await this.getHttp();
      const { data } = await http.post(`/guest-carts`, payload);
      this.logger("cart-service", "Cart Created", data);
      return data;
    } catch (error: unknown) {
      this.logger("cart-service", "Cart Create Error", error);
      throw new Error("2002");
    }
  }

  /**
   * Add product (SKU-level) to cart
   *
   * @param products {array} Objects containing product detail
   * @param cartId {string} Cart ID string
   *
   * @returns {boolean} signals process complete
   */
  async addToCart(products: CartItem[], cartId: string): Promise<CartItem[]> {
    try {
      const http = await this.getHttp();
      const itemsAddedPromises = products.map(
        (product): Promise<AxiosResponse> => {
          return http.post(`/guest-carts/${cartId}/items`, {
            cartItem: product,
          });
        }
      );
      const responses = await Promise.all(itemsAddedPromises);

      return responses.map((response) => {
        const { data } = response;
        this.logger("cart-service", "Item Added", data);
        return data;
      });
    } catch (error: unknown) {
      this.logger("cart-service", "Item Add Error", error);
      throw new Error("2003");
    }
  }

  /**
   * Retreive Magento cart
   *
   * @param cartId {string} Cart ID string
   *
   * @returns {object} Cart object
   */
  async getCart(cartId: string): Promise<CartResponse> {
    try {
      const http = await this.getHttp();
      const { data } = await http.get(`/guest-carts/${cartId}`);
      this.logger("cart-service", "Cart Fetched", data);

      return await this.getCartTotals(data, cartId);
    } catch (error: unknown) {
      this.logger("cart-service", "Cart Fetch Error", error);
      throw `Magento API: ${error} - could not retreive cart`;
    }
  }

  /**
   * Retrieve Cart totals and update Cart
   * with detailed information
   *
   * @param {CartResponse} cart cart object
   * @param {string} cartId cart ID string
   *
   * @returns {any} Magento cart object with custom Totals property object
   */
  private async getCartTotals(
    cart: CartResponse,
    cartId: string
  ): Promise<CartResponse> {
    try {
      const http = await this.getHttp();
      const { data } = await http.get(`/guest-carts/${cartId}/totals`);
      cart.totals = data;
      this.logger("cart-service", "Cart Totals Fetched", data);

      return await this.productLookupBySku(cart, cartId);
    } catch (error: unknown) {
      this.logger("cart-service", "Cart Totals Error", error);
      throw `Magento API: ${error} - could not retreive cart totals`;
    }
  }

  private async productLookupBySku(
    cart: CartResponse,
    cartId: string
  ): Promise<CartResponse> {
    try {
      const http = await this.getHttp();
      const items = cart.items as CartItem[];

      const addedId = await Promise.all(
        items.map(async (item): Promise<CartItem> => {
          const sku = item.sku;
          const { data } = await http.get(`/products/${sku}`);
          const { id } = data;
          item.product_id = id;
          return item;
        })
      );

      this.logger("cart-service", "Product(s) fetched", addedId);
      return this.getItemIds(cart, cartId);
    } catch (error: unknown) {
      this.logger("cart-service", "Product Fetch Error", error);
      throw `Magento API: ${error} - could not retreive product`;
    }
  }

  private async getItemIds(
    cart: CartResponse,
    cartId: string
  ): Promise<CartResponse> {
    try {
      const http = await this.getHttp();
      const items = cart.items as CartItem[];
      const { data } = await http.get(`/guest-carts/${cartId}/items/`);

      items.map((item) => {
        const { sku, item_id } = item;
        const filteredLookup = data.filter(
          (datapoint: any) =>
            datapoint.item_id === item_id && datapoint.sku === sku
        )[0];
        const fastID = filteredLookup.extension_attributes ? filteredLookup.extension_attributes.fast_order_item_uuid : "";

        if (!item.extension_attributes) {
          item.extension_attributes = {};
        }

        item.extension_attributes.fast_order_item_uuid = fastID;
        return item;
      });

      return cart;
    } catch (error: unknown) {
      this.logger("cart-service", "ID fetch error", error);
      throw `Magento API: ${error} - could not retreive product Fast UUID`;
    }
  }

  /**
   * Update Cart with Coupon information
   *
   * @param remove {boolean} Flag for remove vs. add
   * @param coupon {string} Coupon code to add if !remove
   * @param cartId {string} Cart ID string
   *
   * @returns {boolean} success / failure indicated by boolean
   */
  async updateCoupon(
    remove: boolean,
    code: string,
    cartId: string
  ): Promise<boolean> {
    if (remove) {
      const http = await this.getHttp();
      return await http
        .delete(`/guest-carts/${cartId}/coupons`)
        .then((response) => {
          const { data } = response;
          this.logger("cart-service", `Coupon Code ${code} Removed`, data);
          return data;
        })
        .catch((error: unknown) => {
          this.logger("cart-service", `Coupon Code Removal Error`, error);
          throw `Magento API: ${error} - code ${code} was not removed`;
        });
    } else {
      const http = await this.getHttp();
      return await http
        .put(`/guest-carts/${cartId}/coupons/${code}`)
        .then((response) => {
          const { data } = response;
          this.logger("cart-service", `Coupon Code ${code} Added`, data);
          return data;
        })
        .catch((error: unknown) => {
          this.logger("cart-service", `Coupon Code Addition Error`, error);
          throw `Magento API: ${error} - code ${code} was not added`;
        });
    }
  }

  /**
   * Update Cart with Shipping Address information
   *
   * @param address {AddressElement[]} Group of address objects
   * @param cartId {string} Cart ID string
   *
   * @returns {boolean} signals process complete
   */
  async updateShippingAddresses(
    addresses: EcommObject[] | any[],
    cartId: string
  ): Promise<boolean[]> {
    const url = `/guest-carts/${cartId}/shipping-information`;

    const addressesAdded = await Promise.all(
      addresses.map(async (address): Promise<boolean> => {
        const data = { addressInformation: address };
        const addressType = "Shipping address";
        const http = await this.getHttp();

        return await http
          .post(url, data)
          .then((response) => {
            this.logger(
              "cart-service",
              `${addressType} updated`,
              response.data
            );
            return true;
          })
          .catch((error: unknown) => {
            this.logger("cart-service", `${addressType} not updated`, error);
            throw `Magento API: ${error} - ${addressType} not updated`;
          });
      })
    );
    return addressesAdded;
  }

  /**
   * Update Cart with Billing Address information
   *
   * @param address {AddressElement} Billing address
   * @param cartId {string} Cart ID string
   *
   * @returns {boolean} signals process complete
   */
  async updateBillingAddress(
    address: EcommObject,
    cartId: string
  ): Promise<boolean> {
    const url = `/guest-carts/${cartId}/billing-address`;
    const addressType = "Billing address";
    const http = await this.getHttp();

    return await http
      .post(url, address)
      .then((response) => {
        this.logger("cart-service", `${addressType} updated`, response.data);
        return true;
      })
      .catch((error: unknown) => {
        this.logger("cart-service", `${addressType} not updated`, error);
        throw `Magento API: ${error} - ${addressType} not updated`;
      });
  }

  /**
   * Update Cart with updated Items data
   *
   * @param items {array} Product items
   * @param cartId {string} Cart ID string
   *
   * @returns {boolean} signals process complete
   */
  async updateItems(items: any[], cartId: string): Promise<boolean[]> {
    const cart = await this.getCart(cartId);
    const cartItems = cart.items;

    const itemsUpdated = await Promise.all(
      items.map(async (item) => {
        const isDelete = !item.qty || item.qty === 0;
        const data = {
          cartItem: item,
        };
        const url = `/guest-carts/${cartId}/items/${item.item_id}`;

        if (isDelete) {
          const http = await this.getHttp();
          return await http
            .delete(url)
            .then((response) => {
              this.logger("cart-service", "item deleted", response.data);
              return true;
            })
            .catch((error: unknown) => {
              this.logger("cart-service", "item not deleted", error);
              throw `Magento API: ${error}`;
            });
        } else {
          const http = await this.getHttp();
          return await http
            .put(url, data)
            .then((response) => {
              this.logger("cart-service", "item updated", response.data);
              return true;
            })
            .catch((error: unknown) => {
              this.logger("cart-service", "item not updated", error);
              throw `Magento API: ${error}`;
            });
        }
      })
    );
    return itemsUpdated;
  }

  async updateShippingMethod(
    filteredOption: any,
    address: EcommObject,
    cartId: string
  ): Promise<boolean> {
    const http = await this.getHttp();
    const url = `/guest-carts/${cartId}/shipping-information`;
    const data = {
      addressInformation: {
        shipping_address: address,
        shipping_carrier_code: filteredOption.carrier_code,
        shipping_method_code: filteredOption.method_code,
      },
    };

    return await http
      .post(url, data)
      .then((response) => {
        this.logger("cart-service", "Shipping method updated", response.data);
        return true;
      })
      .catch((error: unknown) => {
        this.logger("cart-service", "Shipping method not updated", error);
        throw `Magento API: ${error} - Shiping method not updated`;
      });
  }

  async addCustomerToCart(): // customerId: string,
  // cartId: string
  Promise<boolean> {
    return true;
  }

  async createOrder(cartId: string): Promise<string> {
    try {
      const payload = { paymentMethod: { method: "fast" } };
      const http = await this.getHttp();
      const { data } = await http.put(`guest-carts/${cartId}/order`, payload);
      this.logger("cart-service", "Cart converted to order", data);

      return data.toString();
    } catch (error: unknown) {
      this.logger("cart-service", "Order create error", error);
      throw `Magento API: ${error} - Order create error`;
    }
  }
}
