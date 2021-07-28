# fast-bigcommerce-js

fast-bigcommerce.js is a library that is built to work with BigCommerce stores that use the Cornerstone theme.

fast-bigcommerce.js depends on the fast-js repository.

## Design Goals

fast-bigcommerce.js is essentially a wrapper around fast.js. Its purpose is to help BigCommerce store owners who have no/minimal coding experience to easily integrate Fast Checkout into their store.

This repo is in an interim state where the output is almost identical to `fast-js` but with a different filename.

The goal is to replace the HTML on legacy seller's pages to have a `<script>` that pulls in `fast-bigcommerce.js` instead of `fast.js`.

## Dev Guide

`yarn build` or `yarn build:dev` to build the library into the `dist` folder.

`yarn run serve` to start a local web server and serve static files from this project root. The web server will listen to `http://localhost:5000/`.

## Usage

1. Include the fast-bigcommerce.js library via script tag:

   ```html
   <script src="/path/to/fast-bigcommerce.js"></script>
   ```

   Add custom element(s):

   ```html
   <fast-checkout-button app_id="your_app_id" />

   <fast-checkout-cart-button app_id="your_app_id" />

   <fast-login app_id="your_app_id" />

   <fast-login-button app_id="your_app_id" />
   ```

## References

See the original [confluence page](https://fastaf.atlassian.net/wiki/spaces/ENG/pages/291831838/Fast-BigCommerce+Integration) for the creation of fast.js and fast-bigcommerce.js.

## Cypress Testing

If you set fast_debug=true, we will load the script from https://local.dev.slow.dev:5000/dist/fast-bigcommerce.js. You will need to delete the default fast-js script in the BC > Storefront > Script Manager and add the below.

```html
<script>
  var newScript = document.createElement("script");
  newScript.src = "https://js.dev.slow.dev/fast-bigcommerce.js";

  if (document.cookie.indexOf("fast_debug=true") > -1) {
    //load local js
    newScript.src = "https://local.dev.slow.dev:5000/dist/fast-bigcommerce.js";
  }
  document.getElementsByTagName("head")[0].appendChild(newScript);
</script>
```
