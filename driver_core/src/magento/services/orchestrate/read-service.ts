/* eslint-disable indent */
import { EcommObject } from "../../../core/object-definitions/v1/models/common-types";
import { V1EntityType } from "../../../core/object-definitions/v1/models/v1-entity-type";
import { V1ReadRequest } from "../../../core/object-definitions/v1/models/v1-read-request";
import BaseService from "./base-service";
import CartService from "../api/cart-service";
import ProductService from "../api/product-service";
import CustomerService from "../api/customer-service";
import OrderService from "../api/order-service";
import ShippingService from "../api/shipping-service";
import ShippingAssignment from "../../models/shipping-assignment";
import Address from "../../models/address";

export default class ReadService implements BaseService {
  async orchestrate(
    request: V1ReadRequest,
    token: string
  ): Promise<EcommObject> {
    switch (request.type) {
      case V1EntityType.USER: {
        const customerService = new CustomerService(token);
        if (request.user && request.user.externalUserId) {
          // User ID passed by Fast
          return await customerService.getCustomer(request.user.externalUserId);
        } else if (request.user && request.user.email) {
          // Only email address passed by Fast
          return await customerService.getCustomerByEmail(request.user.email);
        }
        break;
      }

      case V1EntityType.ORDER: {
        if (request.order?.externalId && request.order?.isCart) {
          const cartService = new CartService(token);
          const productService = new ProductService(token);
          const cartId = request.order.externalId;
          const cart = await cartService.getCart(cartId);
          const shipping_assignments = cart.extension_attributes
            ?.shipping_assignments as ShippingAssignment[];

          if (shipping_assignments && shipping_assignments.length > 0) {
            const address = shipping_assignments[0]?.shipping?.address as Address;
            const streetAddress = address.street as Array<unknown>;

            if (streetAddress) {
              // Get estimated shipping information
              const shippingService = new ShippingService(token);
              const shippingOptions = await shippingService.getEstimatedShipping(
                [{ shipping_address: address }],
                cartId
              );

              if (!cart.extension_attributes) {
                cart.extension_attributes = {};
              }
              if (!cart.extension_attributes.shipping_assignments) {
                cart.extension_attributes.shipping_assignments = [];
              }

              // This line assumes a single shipping_assignment only
              cart.extension_attributes.shipping_assignments[0].magentoShippingOptions =
                shippingOptions.flat();
            }
          }

          const hostUrl = JSON.parse(token).merchant_api_url;
          const lines = cart.items as any[]
          const productLookups = await productService.productLookup(hostUrl, lines);
          cart.items = productLookups;

          return cart;
        } else if (request.order?.externalId && !request.order?.isCart) {
          // Order lookup
          const orderService = new OrderService(token);
          return await orderService.getOrder(request.order.externalId);
        }
        break;
      }

      // TODO: need to add getter for all shipping zones on read request
      // https://www.fast.co/docs/merchant/merchant/#operation/MerchantService_Read
      case V1EntityType.SHIPPINGZONES: {
        const shippingService = new ShippingService(token);
        const returnObject = await shippingService.getZones();
        return { zones: returnObject };
        break;
      }

      /**
       * Various errors
       */
      case V1EntityType.SHIPPINGOPTION:
      case V1EntityType.CATALOGCATEGORY:
      case V1EntityType.CATALOGPRODUCT:
      case V1EntityType.ORDERSYNC:
      case V1EntityType.WEBHOOK:
        /**
         * This will be not supported in the scope of this integration.
         * Return a 501 not implemented error or similar.
         *
         * Note that Shipping Options and Shipping Zones should be
         * returned when Shipping Address is updated. Fast will send an
         * UPDATE request to Middleware with the address, and the response
         * should include available shipping options, and shipping zone
         * data.
         */
        break;
      case V1EntityType.UNSPECIFIED:
      default:
        /**
         * Return Error that illegal argument was passed
         */
        break;
    }
    throw "Not implemented";
  }
}
