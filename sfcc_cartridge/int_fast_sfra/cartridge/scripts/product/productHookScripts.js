/**
 * Class to Hook for Product OCAPI and add the Custom logic. 
 */
var Status = require('dw/system/Status');
var fastUtils = require('*/cartridge/scripts/utils/fastUtils');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');

/**
 * modify the Product POST Response
 * @param {*} basket 
 * @param {*} basketResponse 
 * @param {*} productItems 
 * @returns 
 */
 exports.modifyPOSTResponse = function (basket , basketResponse, productItems )  {
    Logger.debug('modify Basket -Items POST Response HOOK');
 
    //Set Product Item custom attributes
    fastUtils.updateItemsAttr(basketResponse.productItems); 
    return new Status(Status.OK);
};

/**
 * modify the Product Patch Response
 * @param {*} basket 
 * @param {*} basketResponse 
 * @param {*} productItemId 
 * @returns 
 */
exports.modifyPATCHResponse = function (basket, basketResponse, productItemId ) {
    Logger.debug('modify Basket -Items PATCH Response HOOK');

    //Set Product Item custom attributes
    fastUtils.updateItemsAttr(basketResponse.productItems); 
    return new Status(Status.OK);
};

/**
 * modify the Product Delete Response
 * @param {*} basket 
 * @param {*} basketResponse 
 * @param {*} productItemId 
 * @returns 
 */
 exports.modifyDELETEResponse = function (basket, basketResponse, productItemId ) {
    Logger.debug('modify Basket -Items DELETE Response HOOK');

    //Set Product Item custom attributes
    fastUtils.updateItemsAttr(basketResponse.productItems); 
    return new Status(Status.OK);
};
