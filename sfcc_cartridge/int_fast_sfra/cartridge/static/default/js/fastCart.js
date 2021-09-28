'use strict';

$(document).ready(function () {
    var fastButtonExist = setInterval(function() {
        if ($('fast-checkout-cart-button').length) {
            var fast = new Fast();
            var checkoutFastJsButton = $('fast-checkout-cart-button');

            checkoutFastJsButton.click(function(event) {
                // This is not the final file is in WIP for future changes
                if (event.target.closest('.cart-page')) {
                    fast.addEventListener("user_event", function(event) {
            
                        var cartClearingEvents = [
                            "Checkout - Order Created",
                            "Checkout - Order Updated",
                            "Checkout - Order Completed",
                        ];
                
                        if (cartClearingEvents.includes(event.name)) {
                        // First hit custom endpoint from FAST-130 to clear cart, later reload page.
                        window.location.reload();
                        }
                    });
                } else {
                    fast.addEventListener("user_event", function(event) {
            
                        var cartClearingEvents = [
                            "Checkout - Order Created",
                            "Checkout - Order Updated",
                            "Checkout - Order Completed",
                        ];
                
                        if (cartClearingEvents.includes(event.name)) {
                        // Only reload page on mini cart
                        window.location.reload();
                        }
                    });
                }
            });
            clearInterval(fastButtonExist);
        }
    }, 100);
});
