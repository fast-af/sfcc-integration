'use strict';

$(document).ready(function () {
    var checkoutButton = document.querySelector('fast-checkout-button');
    var checkoutFastButton = $('#fastProductCheckoutButton');
    var qty = document.querySelector('.quantity-select');


    if (!checkoutFastButton.attr('disabled')) {
        checkoutFastButton.removeClass('fast-checkout');
    }

    $('body').on('product:updateAddToCart', function (e, response) {
        checkoutFastButton.attr('disabled',
            (!response.product.readyToOrder || !response.product.available));
        checkoutFastButton.attr('product_id', response.product.id);
        addEventToFastButton(response);
    });

    if (typeof Fast !== 'function') {
        console.error('Fast not loaded, please reload the page and try again.');
        return false;
    }

    checkoutButton.addEventListener('click', event => {
        Fast.checkout({
            appId: checkoutButton.getAttribute('fast_app_id'),
            buttonId: event.target.id,
            products: [
                {
                    id: checkoutButton.getAttribute('product_id'),
                    variantId: checkoutButton.getAttribute('product_id'),
                    quantity: qtyValuesFromProduct()
                }
            ],
        })
    });

    function qtyValuesFromProduct() {
        var selectedQty;
        Array.from(qty.options).forEach(function (optionElement) {
            var isOptionSelected = optionElement.value;

            if (optionElement.selected) {
                selectedQty = isOptionSelected;
                return false;
            }
        });
        return parseInt(selectedQty);
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