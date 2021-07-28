# fast.js

Fast.js has the following main features:

1. Render Fast Checkout button.
2. Collect your product order data and trigger the Fast Checkout workflow.

## Design Goals

fast.js is designed to work with any website (i.e. not dependent on any e-commerce platform such as BigCommerce).

It is designed to be easily used by web store owners with no/minimal coding experience. It can also be used in app integrations in e-commerce platforms.

It supports major modern evergreen browsers.

## Dev Setup

`yarn` to install the dependencies.

`yarn run build` to compile the library. Any change and this will have to be run to get the updated files.

`yarn run serve` to start a local web server and serve static files from this project root. The web server will listen to `http://localhost:5000/`. Open up `http://localhost:5000/testscript` to see some tests.

### Environment Variable / Config

Look into `config.ts` and `webpack.config.js` files for environment config.

## How to use Fast.js library

First, include the library via script tag:

```html
<script src="/path/to/fast.js"></script>
```

### Render Fast Checkout button

There are four ways to use a Fast Checkout button:

1. use the `<fast-checkout-button>` directly in your HTML form. No JavaScript code needed.

   ```html
   <form>
     <!-- all your other form fields here, e.g. inputs, checkboxes etc. -->

     <!-- put your Fast Checkout Button within the form. -->
     <fast-checkout-button app_id="<YOUR APP_ID HERE>" />
   </form>
   ```

2. programmatically add `<fast-checkout-button>` to your HTML using JavaScript code.

   ```js
   // create an instance of the Fast class, passing your app_id into the constructor.
   const fast = new Fast("<YOUR APP_ID HERE>");

   // create the Fast Checkout button.
   const fastCheckoutButton = fast.createButton();

   // get your HTML form.
   const form = document.querySelector("form");

   // append the button to your form.
   form.append(fastCheckoutButton);
   ```

When users click on the button, it will automatically collect all the input data in the HTML form and pass it as querystring in the checkout URL.

3. use the custom `<fast-checkout-button>` directly in your HTML form.

   ```html
   <form>
     <!-- all your other form fields here, e.g. inputs, checkboxes etc. -->

     <!-- put your Fast Checkout Button within the form. -->
     <fast-checkout-button custom app_id="<YOUR APP_ID HERE>" />
   </form>
   ```

   Then you need to listen for an event when the button is clicked and then dispatch a function to supply the form parameters.

   ```js
   window.addEventListener("readytocheckout", async (e) => {
     const myEvent = new CustomEvent("opencheckout", {
       detail: { invalidFields: [], formParams: { sku: "d2d2323", qty: 8 } },
     });
     window.dispatchEvent(myEvent);
   });
   ```

4. provide product information via button attributes.

   ```html
   <!-- If you use button attributes, at least product_id must be provided. The rest are optional -->
   <fast-checkout-button
     app_id="<YOUR APP_ID HERE>"
     product_id="420"
     variant_id="69"
     product_options='{"size":"medium"}'
   ></fast-checkout-button>
   ```

5. extend the class.

   ```html
   <form>
     <!-- all your other form fields here, e.g. inputs, checkboxes etc. -->

     <!-- put your Fast Checkout Button within the form. -->
     <my-fast-checkout-button app_id="<YOUR APP_ID HERE>" />
   </form>
   ```

   Then you need to extend the class, override `getCheckoutDataFromPage`, and create a new custom element

   ```js
   export class MyFastCheckoutButton extends FastCheckoutButton {
     getCheckoutDataFromPage(): CheckoutData {
       return {
         invalidFields: [],
         params: { sku: "3ed2d23" },
       };
     }
   }

   customElements.define("my-fast-checkout-button", MyFastCheckoutButton);
   ```

### Render Fast Checkout Cart button

There are four ways to use a Fast Checkout Cart button:

1. use the `<fast-checkout-button>` directly. No JavaScript code needed.

   ```html
   <fast-checkout-cart-button
     app_id="<YOUR APP_ID HERE>"
     cart_id="f44223423"
     platform="your_platform"
   />
   ```

2. programmatically add `<fast-checkout-cart-button>` to your HTML using JavaScript code.

   ```js
   // create an instance of the Fast class, passing your app_id into the constructor.
   const fast = new Fast("<YOUR APP_ID HERE>");

   // create the Fast Checkout button.
   const fastCheckoutCartButton = fast.createCheckoutCartButton();

   // get your HTML form.
   const form = document.querySelector("form");

   // append the button to your form.
   form.append(fastCheckoutCartButton);
   ```

3. use the custom `<fast-checkout-cart-button>` directly.

   ```html
   <form>
     <!-- all your other form fields here, e.g. inputs, checkboxes etc. -->

     <!-- put your Fast Checkout Button within the form. -->
     <fast-checkout-button
       custom
       app_id="<YOUR APP_ID HERE>"
       platform="your_platform"
     />
   </form>
   ```

   Then you need to listen for an event when the button is clicked and then dispatch a function to supply the cart id.

   ```js
   window.addEventListener("readytocheckout", async (e) => {
     const myEvent = new CustomEvent("opencheckout", {
       detail: { cart_id: "ed23dd23d" },
     });
     window.dispatchEvent(myEvent);
   });
   ```

4. extend the class.

   ```html
   <form>
     <!-- all your other form fields here, e.g. inputs, checkboxes etc. -->

     <!-- put your Fast Checkout Button within the form. -->
     <my-fast-checkout-cart-button app_id="<YOUR APP_ID HERE>" />
   </form>
   ```

   Then you need to extend the class, override `readForm`, and create a new custom element

   ```js
   export class MyFastCheckoutCartButton extends FastCheckoutCartButton {
     fetchCartId() {
       return { cart_id: "d23d3223" };
     }
   }

   customElements.define(
     "my-fast-checkout-cart-button",
     MyFastCheckoutCartButton
   );
   ```

### Manually Trigger Fast Checkout

If you want to programmatically trigger Fast Checkout, the following JavaScript code is an example to do that:

```js
// listen for the Fast Checkout button click event,
// collect data from form, and trigger Fast Checkout.
fastCheckoutButton.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();

  const fast = new Fast();
  const formData = new FormData(form);
  for (const [key, value] of formData.entries()) {
    if (key === "product_id") {
      fast.setProductKey(value);
    } else if (key.startsWith("attribute")) {
      fast.setOption(key, value);
    } else if (key === "qty[]") {
      fast.setQuantity(value);
    } else {
      fast.setOption(key, value);
    }
  }

  // This will open a new popup window that displays Fast Checkout
  // using the data collected above.
  fast.checkout();
});
```

## Testing on production sites

You can serve the fast.js file locally and have it launch the production checkout, then use a Chrome extension to have the site load your local fast.js script instead of their own hosted one.

1. Serve the development app that opens production checkout
   ```sh
   yarn start:prodcheckout
   yarn serve
   ```
2. Install the [Resource Override Chrome Extension](https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii) and restart your dev tools if they are open

3. From your dev tools, open the "Overrides" tab and create a new rule:
   - From: `https://js.fast.co/fast.js`
   - To: `https://local.dev.slow.dev:5000/dist/fast.js`

Now any site that loads fast.js from our CDN will instead load your local version, and clicking that button will still launch the production checkout flow which will allow it to work end-to-end.

## References

See the original [confluence page](https://fastaf.atlassian.net/wiki/spaces/ENG/pages/291831838/Fast-BigCommerce+Integration) for the creation of fast.js and fast-bigcommerce.js.
