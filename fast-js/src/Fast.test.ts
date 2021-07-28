import {
  CartCheckoutParams,
  Fast,
  ProductCheckoutParams,
  VERSION,
} from "./Fast";
import * as LaunchCheckout from "./launchCheckout";
import { validateCheckoutParams } from "./util";

const TEST_APP_ID = "app_id-test-123";

// some healthy product parameters. we'll modify these per-test to make them invalid so we aren't copying so much
// intentionally using `any` here because we are going to make these parameters not match the actual type
const happyProductParams = (): any => {
  // enforce type safety on this line still so that these params are truly happy
  const params: ProductCheckoutParams = {
    appId: TEST_APP_ID,
    buttonId: "my-button",
    products: [
      {
        id: "socks",
        variantId: "plaid-socks",
        options: [
          {
            id: "color",
            value: "red",
          },
        ],
        quantity: 2,
      },
    ],
    couponCode: "10OFF",
    affiliateInfo: {
      affiliates: [
        {
          id: "brik",
        },
      ],
    },
  };
  return params;
};

describe("Fast class", () => {
  describe("button creation", () => {
    let fast: Fast;
    beforeEach(() => {
      fast = new Fast();
    });

    describe("createButton", () => {
      it("should create fast-checkout-button with app_id attribute", () => {
        const button = fast.createButton(TEST_APP_ID);

        expect(button.tagName).toBe("FAST-CHECKOUT-BUTTON");
        expect(button.getAttribute("app_id")).toBe(TEST_APP_ID);
      });
    });

    describe("createCheckoutCartButton", () => {
      it("should create fast-checkout-cart-button with app_id and cart_id attributes", () => {
        const button = fast.createCheckoutCartButton({
          app_id: TEST_APP_ID,
          cart_id: "cartIdxxxyyyzzz",
        });

        expect(button.tagName).toBe("FAST-CHECKOUT-CART-BUTTON");
        expect(button.getAttribute("app_id")).toBe(TEST_APP_ID);
        expect(button.getAttribute("cart_id")).toBe("cartIdxxxyyyzzz");
      });
    });
  });

  describe("checkout", () => {
    const launchCheckout = jest
      .spyOn(LaunchCheckout, "launchCheckout")
      .mockImplementation(() => ({} as Window));

    it("should support product checkout happy path", () => {
      const params: ProductCheckoutParams = happyProductParams();
      Fast.checkout(params);

      const expectedUrlParams = new URLSearchParams();
      expectedUrlParams.append("app_id", TEST_APP_ID);
      expectedUrlParams.append("button_id", params.buttonId);
      expectedUrlParams.append("version", VERSION);
      const expectedProductJson =
        '[{"product_id":"socks","variant_id":"plaid-socks","option_values":[{"option_id":"color","option_value":"red"}],"quantity":2}]';
      expectedUrlParams.append("products", expectedProductJson);
      expectedUrlParams.append("coupon_code", params.couponCode ?? "");
      const expectedAffiliateInfoJson = '{"entities":[{"id":"brik"}]}';
      expectedUrlParams.append("affiliate_info", expectedAffiliateInfoJson);

      expect(launchCheckout).toHaveBeenCalledWith(
        expectedUrlParams.toString(),
        params.buttonId
      );
    });

    it("should support cart checkout happy path", () => {
      const params: CartCheckoutParams = {
        appId: TEST_APP_ID,
        buttonId: "my-button",
        cartId: "cart-id-123",
      };
      Fast.checkout(params);

      const expectedUrlParams = new URLSearchParams();
      expectedUrlParams.append("app_id", TEST_APP_ID);
      expectedUrlParams.append("button_id", params.buttonId);
      expectedUrlParams.append("version", VERSION);
      expectedUrlParams.append("platform_cart_id", params.cartId);

      expect(launchCheckout).toHaveBeenCalledWith(
        expectedUrlParams.toString(),
        params.buttonId
      );
    });
  });

  describe("validateCheckoutParams", () => {
    let params = happyProductParams();
    beforeEach(() => {
      params = happyProductParams();
    });

    it("should contain an error if appId is not defined or not a string", () => {
      params.appId = 420;
      expect(validateCheckoutParams(params)).toContain(
        "appId must be a string."
      );

      delete params.appId;
      expect(validateCheckoutParams(params)).toContain("appId is required.");
    });

    it("should contain an error if buttonId is not defined or not a string", () => {
      params.buttonId = 420;
      expect(validateCheckoutParams(params)).toContain(
        "buttonId must be a string."
      );

      delete params.buttonId;
      expect(validateCheckoutParams(params)).toContain("buttonId is required.");
    });

    it("should contain an error if cartId and products are defined, or neither are defined", () => {
      params.cartId = "cart-id-123";
      expect(validateCheckoutParams(params)).toContain(
        "Either cartId or products must be defined, but not both."
      );

      delete params.products;
      delete params.cartId;
      expect(validateCheckoutParams(params)).toContain(
        "Either cartId or products must be defined, but not both."
      );
    });

    it("should contain an error if cartId is not a string", () => {
      const cartParams: any = {
        buttonId: "my-button",
        cartId: 420,
      };
      expect(validateCheckoutParams(cartParams)).toContain(
        "cartId must be a string."
      );
    });

    it("should contain an error if products is not a non-empty array", () => {
      params.products = [];
      expect(validateCheckoutParams(params)).toContain(
        "products cannot be empty."
      );

      params.products = "im buying socks";
      expect(validateCheckoutParams(params)).toContain(
        "products must be an array."
      );
    });

    it("should contain an error if products[x].id is not defined or not a string", () => {
      delete params.products[0].id;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].id is required."
      );
      params.products[0].id = 420;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].id must be a string."
      );
    });

    it("should NOT contain an error if products[x].variantId is not defined", () => {
      delete params.products[0].variantId;
      expect(validateCheckoutParams(params)).toHaveLength(0);
    });

    it("should contain an error if products[x].variantId is not a string", () => {
      params.products[0].variantId = 420;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].variantId must be a string if it is defined."
      );
    });

    it("should NOT contain an error if products[x].options is not defined", () => {
      delete params.products[0].options;
      expect(validateCheckoutParams(params)).toHaveLength(0);
    });

    it("should contain an error if products[x].options is not an array", () => {
      params.products[0].options = "color=blue";
      expect(validateCheckoutParams(params)).toContain(
        "products[0].options must be an array if it is defined."
      );
    });

    it("should contain an error if products[x].options[y].id is not defined or not a string", () => {
      delete params.products[0].options[0].id;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].options[0].id is required."
      );

      params.products[0].options[0].id = 420;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].options[0].id must be a string."
      );
    });

    it("should contain an error if products[x].options[y].value is not defined or not a string", () => {
      delete params.products[0].options[0].value;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].options[0].value is required."
      );

      params.products[0].options[0].value = 420;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].options[0].value must be a string."
      );
    });

    it("should NOT contain an error if products[x].options[y].value is an empty string", () => {
      params.products[0].options[0].value = "";
      expect(validateCheckoutParams(params)).not.toContain(
        "products[0].options[0].value is required."
      );
    });

    it("should contain an error if products[x].quantity is not a number greater than zero", () => {
      delete params.products[0].quantity;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].quantity is required."
      );

      params.products[0].quantity = "four";
      expect(validateCheckoutParams(params)).toContain(
        "products[0].quantity must be a whole number."
      );

      params.products[0].quantity = 4.2;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].quantity must be a whole number."
      );

      params.products[0].quantity = -420;
      expect(validateCheckoutParams(params)).toContain(
        "products[0].quantity must be greater than zero."
      );
    });

    it("should NOT contain an error if couponCode is not defined", () => {
      delete params.couponCode;
      expect(validateCheckoutParams(params)).toHaveLength(0);
    });

    it("should contain an error if couponCode is not a string", () => {
      params.couponCode = ["10OFF", "20OFF"];
      expect(validateCheckoutParams(params)).toContain(
        "couponCode must be a string if it is defined."
      );
    });

    it("should NOT contain an error if affiliateInfo is not defined", () => {
      delete params.affiliateInfo;
      expect(validateCheckoutParams(params)).toHaveLength(0);
    });

    it("should contain an error if affiliateInfo.affiliates is not a non-empty array", () => {
      delete params.affiliateInfo.affiliates;
      expect(validateCheckoutParams(params)).toContain(
        "affiliateInfo.affiliates is required if affiliateInfo is defined."
      );
      params.affiliateInfo.affiliates = "brik";
      expect(validateCheckoutParams(params)).toContain(
        "affiliateInfo.affiliates must be an array."
      );
      params.affiliateInfo.affiliates = [];
      expect(validateCheckoutParams(params)).toContain(
        "affiliateInfo.affiliates cannot be empty."
      );
    });

    it("should contain an error if affiliateInfo.affiliates[y].id is not defined or not a string", () => {
      delete params.affiliateInfo.affiliates[0].id;
      expect(validateCheckoutParams(params)).toContain(
        "affiliateInfo.affiliates[0].id is required."
      );
      params.affiliateInfo.affiliates[0].id = 6e9;
      expect(validateCheckoutParams(params)).toContain(
        "affiliateInfo.affiliates[0].id must be a string."
      );
    });

    it("should NOT contain an error if currency is not defined", () => {
      delete params.currency;
      expect(validateCheckoutParams(params)).toHaveLength(0);
    });

    it("should contain an error if currency is not a string", () => {
      params.currency = {
        code: "AUD",
        name: "Australian Dollary Doos",
      };
      expect(validateCheckoutParams(params)).toContain(
        "currency must be a string if it is defined."
      );
    });

    it("should contain an error if currency is not a 3-letter string", () => {
      params.currency = "Australian Dollary Doos";
      expect(validateCheckoutParams(params)).toContain(
        "currency must be a 3-letter currency code."
      );
    });
  });
});
