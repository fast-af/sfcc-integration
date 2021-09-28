/**
 *  cartUtils.ds  -  Utility functions for Fast Order custom logic.
 */

 var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');
/**
 * Function to verify, is the given Cart have any fast disabled product.
 * 
 * @param {*} productLineItems 
 * @returns 
 */
function fastEnabled(productLineItems) {

    try {
        for (var count = 0; count < productLineItems.length; count++) {
            var pli = productLineItems[count];
            if(pli && pli.product && pli.product.custom.disableFastCheckout){
                return false;
            }
        }
    } catch (error) {
        Logger.error('Error on cartUtils.fastEnabled and error :' + error);
    }

    return true;
}

/**
 * Get Applicable Shipping Methods for given basket.
 * 
 * @param {*} basket 
 * @returns 
 */
function getApplicableShippingMethods(basket) {

    // Add All Available Shipping methods into Basket response  
    var applicableShipments = [];
    var ShippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');
    try {
        var shippingModels = ShippingHelpers.getShippingModels(basket, null, 'basket');
        if(shippingModels){
            //FAST support single shipment and not multi shipment options
            var shippingModel = shippingModels[0];
            if(shippingModel){
                applicableShipments =  shippingModel.applicableShippingMethods;
            }
        }
    } catch (error) {
        Logger.error('Error on cartUtils.getApplicableShippingMethods and error :' + error);
    }


    return applicableShipments;
}

/**
 * Get order level discount total
 * 
 * @param {*} basket 
 * @returns 
 */
function getOrderDiscount(basket) {
    
    var orderDiscount;
    try {
        if(basket){
            var totalExcludingOrderDiscount = basket.getAdjustedMerchandizeTotalPrice(false);
            var totalIncludingOrderDiscount = basket.getAdjustedMerchandizeTotalPrice(true);
            orderDiscount = totalExcludingOrderDiscount.subtract(totalIncludingOrderDiscount);
        }
    } catch (error) {
        Logger.error('Error on cartUtils.getOrderDiscount and error :' + error);
    }

    return orderDiscount ? orderDiscount.value : 0;
}

module.exports.fastEnabled = fastEnabled;
module.exports.getOrderDiscount = getOrderDiscount;
module.exports.getApplicableShippingMethods = getApplicableShippingMethods;