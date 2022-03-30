'use strict';

$(document).ready(function () {
    var checkoutButton = document.querySelector('fast-checkout-button');
    var checkoutFastButton = $('#fastProductCheckoutButton');
    var fastQuickviewCheckoutButton = $('#fastQuickviewCheckoutButton');
    var qty = document.querySelector('.quantity-select');
    var isQuickViewModalOpen = false;
    
    if (!checkoutFastButton.attr('disabled')) {
        checkoutFastButton.removeClass('fast-checkout');
    }

    $('body').on('product:updateAddToCart', function (e, response) { 
        var isQuickViewModalOpen = document.querySelector('#quickViewModal') != null ? document.querySelector('#quickViewModal').classList.contains('show') : false;
        var isFastCheckoutProduct = document.querySelector('#fastProductCheckoutButton') != null ? true : false;
        var prodId = response.product.id;
        var prodQty = parseInt( response.product.selectedQuantity, 10);
        
        if (isQuickViewModalOpen) {
            checkoutFastButton = $('#fastQuickviewCheckoutButton');
        }
        if (isFastCheckoutProduct) {
            checkoutFastButton = $('#fastProductCheckoutButton');
        }
        
        checkoutFastButton.attr('disabled', (!response.product.readyToOrder || !response.product.available));
        checkoutFastButton.attr('product_id', prodId);
        checkoutFastButton.attr('quantity', prodQty);
        addEventToFastButton(response);
    });

    if (typeof Fast !== 'function') {
        console.error('Fast not loaded, please reload the page and try again.');
        return false;
    }

    function addEventToFastButton(result) {
        if (result.product.readyToOrder && result.product.available) {
            checkoutFastButton.addClass('fast-checkout-enabled');
            checkoutFastButton.removeClass('fast-checkout');
        } else {
            checkoutFastButton.addClass('fast-checkout');
            checkoutFastButton.removeClass('fast-checkout-enabled');
        }
    }
});

//WIP for this file, need more work on the future for different type of products.