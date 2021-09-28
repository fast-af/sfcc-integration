'use strict';
/**
 * Populate the Fast related value into Product
 * @param {*} object 
 * @param {*} apiProduct 
 */
module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'disableFastCheckout', {
        enumerable: true,
        value: apiProduct ? apiProduct.custom.disableFastCheckout : false
    });
};