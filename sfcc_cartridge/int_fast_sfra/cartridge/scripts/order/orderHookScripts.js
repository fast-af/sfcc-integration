/**
 * Class to Hook for Order  OCAPI and add the Custom logic. 
 */
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var CustomerMgr = require('dw/customer/CustomerMgr');
var fastUtils = require('*/cartridge/scripts/utils/fastUtils');
var orderUtils = require('~/cartridge/scripts/utils/orderUtils.js');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');

/**
 * 
 * @param {*} order 
 * @param {*} orderResponse 
 * @returns 
 */
exports.modifyGETResponse =function(order , orderResponse) {
    Logger.debug('Modify Order GET HOOK');

	//Set Product Item custom attributes
	fastUtils.updateItemsAttr(orderResponse.productItems);
    //Set  custom attributes
	orderResponse.c_orderLevelDiscountTotal = orderUtils.getOrderDiscount(order);

    return new Status(Status.OK);
};

/**
 * After Order create Post - Custom logic. 
 * @param {*} order 
 * @returns 
 */
exports.afterPOST = function (order) {
	Logger.debug('AFTER POST ORDER HOOK');
	
	//Set the Customer to Order
	try {
		var profile = CustomerMgr.queryProfile('email = {0}', order.custom.fastEmailId);
		if(profile){
			var lookupCustomer = profile.getCustomer();
			order.setCustomer(lookupCustomer);
		}
	} catch (error) {
		Logger.error('Error on adding customer into Order in after Order Post and error :' + error);
	}

	// Send the Confirmation Email
	try {
		orderUtils.sendOrderConfirmationEmail(order);
	} catch (error) {
		Logger.error('Error on send OrderConfirmation Email in after Post and error :' + error);
	}

    return new Status(Status.OK);
};