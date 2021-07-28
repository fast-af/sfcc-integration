import { loadBCProductDescriptionPage } from "./util";

const { Cypress, cy, before } = window;

// ENV variables
const appId = "c2d1e6b0-fc15-4489-bb8a-ec1e8317663f";

describe("BigCommerce Fast Checkout", () => {
  // Handle CustomElementRegistry Error
  Cypress.on("uncaught:exception", () => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  before(() => {
    cy.clearCookies();
  });

  describe("direct checkout", () => {
    loadBCProductDescriptionPage("fast-sample-product-1/");

    it("should have the correct attributes on the button", () => {
      cy.get("fast-checkout-button").should("have.css", "height", "50px");
      cy.get("fast-checkout-button")
        .shadow()
        .find("button")
        .then(($el) => cy.wrap($el))
        .should("have.css", "height", "50px")
        .should("have.css", "border-radius", "8px")
        .should("have.css", "font-weight", "700")
        .should("have.css", "font-size", "18px")
        .should("have.css", "background-color", "rgb(0, 0, 0)")
        .should("have.css", "color", "rgb(255, 255, 255)");
    });

    it("should alert when required fields are not selected", () => {
      cy.window().then((win) => {
        cy.stub(win, "open").as("open");
      });
      cy.get("fast-checkout-button").shadow().find("button").click();
      cy.get("fast-checkout-button")
        .shadow()
        .find(".tooltip")
        .then(($el) => cy.wrap($el))
        .contains("Please fill out the missing fields");
      cy.get("@open").should("not.have.been.called");
    });

    it("should open a window for fast checkout", () => {
      cy.window().then((win) => {
        cy.stub(win, "open").as("open");
      });
      cy.get("[data-product-option-change] .form-option-variant")
        .contains("M")
        .click({ force: true }); // Mobile menu covers this for some reason
      cy.get("fast-checkout-button").shadow().find("button").click();

      cy.get("@open").should((open) => {
        expect(open).to.have.been.calledWithMatch("/checkout?");
        expect(open).to.have.been.calledWithMatch("quantity=1");
        expect(open).to.have.been.calledWithMatch("platform=bigcommerce");

        //env specific
        expect(open).to.have.been.calledWithMatch("product_id=112");
        expect(open).to.have.been.calledWithMatch("option_values=113%2C99");
        expect(open).to.have.been.calledWithMatch(`app_id=${appId}`);
        expect(open).to.have.been.calledWithMatch("button_id=");
        // popup items
        expect(open).to.have.been.calledWithMatch(
          "",
          "popupWindow",
          "resizeable=yes"
        );
        expect(open).to.have.been.calledWithMatch(
          "",
          "popupWindow",
          "scrollbars"
        );
        expect(open).to.have.been.calledWithMatch(
          "",
          "popupWindow",
          "width=400"
        );
        expect(open).to.have.been.calledWithMatch(
          "",
          "popupWindow",
          "height=720"
        );
      });
    });
  });
  // This often gets a forbidden error during the add to cart
  describe.skip("cart checkout @flaky", () => {
    loadBCProductDescriptionPage("fast-sample-product-1/");

    it("should load up store and add socks", () => {
      cy.get("[data-product-option-change] .form-option-variant")
        .contains("M")
        .click({ force: true }); // Mobile menu covers this for some reason
      cy.get("button").contains("Increase Quantity:").click({ force: true });
      cy.get("input").contains("Add to Cart").click({ force: true });
      cy.get(".modal-content").should("be.visible");
      cy.get("a").contains("Continue Shopping").click();
    });

    it("should add fast hoodie and head to checkout", () => {
      cy.get("a").contains("Fast Hoodie").click();
      cy.get("[data-product-option-change] .form-option-variant")
        .contains("Black")
        .click({ force: true }); // Mobile menu covers this for some reason
      cy.get("input").contains("Add to Cart").click({ force: true });
      cy.get(".modal-content").should("be.visible");
      cy.get("a").contains("Proceed to checkout").click();
    });

    it("should have the correct attributes on the button", () => {
      cy.get("fast-checkout-cart-button").should("have.css", "height", "50px");
      cy.get("fast-checkout-cart-button")
        .shadow()
        .find("button")
        .then(($el) => cy.wrap($el))
        .should("have.css", "height", "50px")
        .should("have.css", "border-radius", "6px")
        .should("have.css", "font-weight", "700")
        .should("have.css", "font-size", "18px")
        .should("have.css", "background-color", "rgb(0, 0, 0)")
        .should("have.css", "color", "rgb(255, 255, 255)");
    });

    it("should open a window for fast checkout", () => {
      cy.window().then((win) => {
        cy.stub(win, "open").as("open");
      });
      cy.get("fast-checkout-cart-button").shadow().find("button").click();

      cy.get("@open").should((open) => {
        expect(open).to.have.been.calledWithMatch("/checkout?");
        expect(open).to.have.been.calledWithMatch("platform=bigcommerce");
        expect(open).to.have.been.calledWithMatch("platform_cart_id=");
        //env specific
        expect(open).to.have.been.calledWithMatch(`app_id=${appId}`);
        // popup items
        expect(open).to.have.been.calledWithMatch("", "popupWindow");
        // window properties
        expect(open).to.have.been.calledWithMatch("", "", "resizeable=yes");
        expect(open).to.have.been.calledWithMatch("", "", "scrollbars");
        expect(open).to.have.been.calledWithMatch("", "", "width=400");
        expect(open).to.have.been.calledWithMatch("", "", "height=720");
      });
    });
  });
});
