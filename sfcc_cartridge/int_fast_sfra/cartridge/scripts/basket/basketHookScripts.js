/**
 * Class to Hook for Basket OCAPI and add the Custom logic. 
 */
var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger');
var Transaction = require('dw/system/Transaction');
var fastUtils = require('*/cartridge/scripts/utils/fastUtils');
var cartUtils = require('*/cartridge/scripts/utils/cartUtils');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');

/**
 * Before Add Basket - Custom logic. 
 * @param {*} basket 
 * @param {*} items 
 */
 exports.beforePOST = function (basket , items) {
    Logger.debug('BEFORE BASKET POST HOOK');

    try {
        //Added the Fast custom value into Basket
        var fastId = basket.custom.fastId;
        var fastStatus = basket.custom.fastStatus;
        if(basket.custom.fastId && basket.custom.fastStatus){
            //Add FAST payment into Basket
            Transaction.wrap(function () {
                var paymentInstrument = basket.createPaymentInstrument(
                    "Fast" , basket.totalGrossPrice
                    );
            });
        }
    } catch (error) {
        Logger.error('Error on Before Add Basket - Custom logic and error :' + error);
    }

    return new Status(Status.OK);
};

/**
 * Modify Basket GET Response hook.
 * 
 * @param {*} basket 
 * @param {*} basketResponse 
 * @returns 
 */
exports.modifyGETResponse =function(basket , basketResponse) {
    Logger.debug('Modify Basket GET HOOK');

    try {
        // Add All Available Shipping methods into Basket response  
        basketResponse.c_applicableShippingMethods = cartUtils.getApplicableShippingMethods(basket);
        //Set Product Item custom attributes
        fastUtils.updateItemsAttr(basketResponse.productItems);
        //Set the Order Discount Total in Basket
        basketResponse.c_orderLevelDiscountTotal = cartUtils.getOrderDiscount(basket);
    } catch (error) {
        Logger.error('Error on modifyGETResponse - Custom logic and error :' + error);
    }

    return new Status(Status.OK);
};

/**
 * Modify Basket POST Response hook.
 * 
 * @param {*} basket 
 * @param {*} basketResponse 
 * @returns 
 */
exports.modifyPOSTResponse =function(basket , basketResponse) {
    Logger.debug('Modify Basket POST HOOK');

    //Set Product Item custom attributes
    fastUtils.updateItemsAttr(basketResponse.productItems);
    return new Status(Status.OK);
};