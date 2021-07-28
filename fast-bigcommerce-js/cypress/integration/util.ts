const { Cypress, cy } = window;
const bcURL = "https://ilker-fast.mybigcommerce.com/";

const verifyLocalLoadedScript = () => {
  if (Cypress.env("env") === "local") {
    cy.get("script").should(($scripts) => {
      let found = false;
      $scripts.toArray().forEach((script) => {
        if (
          script.src ===
          "https://local.dev.slow.dev:5000/dist/fast-bigcommerce.js"
        ) {
          found = true;
        }
      });
      expect(found).to.equal(true);
    });
  } else {
    cy.log("Skipping local check");
  }
};

const loadBCProductDescriptionPage = (
  product: string = "fast-sample-product-1/"
) => {
  it("should load up BC store product page with Fast Button", () => {
    if (Cypress.env("env") === "local") {
      cy.setCookie("fast_debug", "true");
    } else {
      cy.log("Not Setting fast_debug =true");
    }
    cy.visit(bcURL + product);
    verifyLocalLoadedScript();
    cy.get("fast-checkout-button").should("be.visible");
  });
};

export { verifyLocalLoadedScript, loadBCProductDescriptionPage };
