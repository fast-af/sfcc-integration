'use strict';
const myTimeout = setTimeout(initCartFastBtn, 2000);

function initCartFastBtn() {
    
    $(document).ready(function () {
        // following code is for cart page fast checkout button to check checkout events
        var cartPageCheckoutButton = $('.cart-page fast-checkout-cart-button');
        
        if (cartPageCheckoutButton.length > 0) {
            cartPageCheckoutButton.click(function(){
                var fast = new Fast();
                
                fast.addEventListener("user_event", function(event) {
                    
                    var cartClearingEvents = [
                        "Checkout - Order Created",
                        "Checkout - Order Updated",
                        "Checkout - Order Completed",
                    ];
            
                    if (cartClearingEvents.includes(event.name)) {
                        // First hit custom endpoint from FAST-130 to clear cart, later reload page.
                        window.location.href = window.location.href;
                    }
                });
            });
        }
        // following code with prepare when mouse hover on minicart 
        $(".minicart").hover(function(){
            
        	setTimeout(function() {
        		var minicartCheckoutButton = $(".minicart fast-checkout-cart-button");
                
                if (minicartCheckoutButton.length > 0) {
                    minicartCheckoutButton.click(function(){
                        var fast = new Fast();
                        
                        fast.addEventListener("user_event", function(event) {
                            
                            var cartClearingEvents = [
                                "Checkout - Order Created",
                                "Checkout - Order Updated",
                                "Checkout - Order Completed",
                            ];
                    
                            if (cartClearingEvents.includes(event.name)) {
                                // First hit custom endpoint from FAST-130 to clear cart, later reload page.
                                window.location.href = window.location.href;
                            }
                        });
                    });
                }
    		}, 1000);

        }, function(){
        	var minicartCheckoutButton = $(".minicart fast-checkout-cart-button");
            if (minicartCheckoutButton.length > 0) {
                $('.minicart fast-checkout-cart-button').off('click');
            }
        });
        
    });

}

