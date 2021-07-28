import { loadBCProductDescriptionPage } from "./util";

const { Cypress, cy, before } = window;

// ENV variables
const origin = "https%3A%2F%2Filker-fast.mybigcommerce.com";
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

  describe("fast login", () => {
    loadBCProductDescriptionPage("fast-sample-product-1/");

    it("should have the correct attributes on the button", () => {
      cy.get("fast-login").should("have.css", "height", "50px");
      cy.get("fast-login")
        .shadow()
        .find("fast-login-button")
        .shadow()
        .find("button")
        .then(($el) => cy.wrap($el))
        .should("have.css", "height", "50px")
        .should("have.css", "border-radius", "6px")
        .should("have.css", "font-weight", "400")
        .should("have.css", "font-size", "18px")
        .should("have.css", "background-color", "rgb(0, 0, 0)")
        .should("have.css", "color", "rgb(255, 255, 255)");
    });

    it("should open a window for fast login", () => {
      cy.window().then((win) => {
        cy.stub(win, "open").as("open");
      });
      cy.get("fast-login")
        .shadow()
        .find("fast-login-button")
        .shadow()
        .find("button")
        .click();

      cy.get("@open").should((open) => {
        //https://checkout.dev.slow.dev/login?app_id=c2d1e6b0-fc15-4489-bb8a-ec1e8317663f&origin=https%3A%2F%2Filker-fast.mybigcommerce.com", "popupWindow", "\n resizeable=yes\n scrollbars,\n status,\n width=400,\n height=720,\n top=340.5,\n left=1222.5\n "
        expect(open).to.have.been.calledWithMatch("/login?");
        expect(open).to.have.been.calledWithMatch(`origin=${origin}`);

        //env specific
        expect(open).to.have.been.calledWithMatch(`app_id=${appId}`);
        // popup items
        expect(open).to.have.been.calledWithMatch("", "popupWindow");
        // window props
        expect(open).to.have.been.calledWithMatch("", "", "resizeable=yes");
        expect(open).to.have.been.calledWithMatch("", "", "scrollbars");
        expect(open).to.have.been.calledWithMatch("", "", "width=400");
        expect(open).to.have.been.calledWithMatch("", "", "height=720");
      });
    });
  });
});
