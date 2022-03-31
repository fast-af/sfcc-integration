/**
 * Class to Hook for Order  OCAPI and add the Custom logic. 
 */
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');
var CustomerMgr = require('dw/customer/CustomerMgr');
var fastUtils = require('*/cartridge/scripts/utils/fastUtils');
var orderUtils = require('~/cartridge/scripts/utils/orderUtils.js');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');

/**
 * modify Order GET Response to add Fast custom attributes.
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
 * After Order Patch to add Fast custom logic.
 * 
 * @param {*} order 
 * @param {*} orderInput 
 */
exports.afterPATCH = function (order, orderInput) {
	Logger.debug('AFTER Patch ORDER HOOK - Start');

	try {
		var orderStatus = Transaction.wrap(function () {
			//Check the Fast order status and updated SFCC Order data
			if(order.custom.fastStatus === "ORDER_STATUS_CANCELED"){
				order.setExportStatus(order.EXPORT_STATUS_NOTEXPORTED);
				order.setConfirmationStatus(order.CONFIRMATION_STATUS_NOTCONFIRMED);
				order.setPaymentStatus(order.PAYMENT_STATUS_NOTPAID);
				order.setStatus(order.ORDER_STATUS_CANCELLED);
				order.setShippingStatus(Order.SHIPPING_STATUS_NOTSHIPPED);
			}else if(order.custom.fastStatus === "ORDER_STATUS_BOOKED"){
				order.setStatus(order.ORDER_STATUS_OPEN);
			}else if(order.custom.fastStatus === "ORDER_STATUS_PENDING_FULFILLMENT"){
				order.setPaymentStatus(order.PAYMENT_STATUS_PAID);
				order.setExportStatus(order.EXPORT_STATUS_READY);
			}
		});

	} catch (error) {
		Logger.error('Error on afterPATCH() and error :' + error);
	}

	Logger.debug('End Patch ORDER HOOK - End');
};

/**
 * After Order create Post - Custom logic. 
 * 
 * @param {*} order 
 * @returns 
 */
exports.afterPOST = function (order) {
	Logger.debug('AFTER POST ORDER HOOK');

	//Set the transaction number in Payment 
	try {
		var paymentInstruments : Collection = order.getPaymentInstruments();
		for each (let paymentInstrument in paymentInstruments) {
			if(paymentInstrument.getPaymentMethod().equals("Fast")){
				Transaction.wrap(function(){
					if(order.custom.fastId){
						paymentInstrument.paymentTransaction.setTransactionID(order.custom.fastId);
					}
				});
			}
		}
	} catch (error) {
		Logger.error('Error on setting the Fast transaction value on Payment Instruments and error :' + error);
	}
	
	// set email ID
	Transaction.wrap(function(){
		order.customerEmail = order.custom.fastEmailId;
	});
	
	//Read marketing consent property from Request Header
	var fastMarketingConsent = request.httpHeaders.get('x-fast-marketing-consent');
	//If value true, allow user to add marketing consent logic 
	if(fastMarketingConsent){
		Transaction.wrap(function(){
			order.custom.fastMarketingConsent = true;
		});
	}

	//Set the Order Status to Open 
	try {
		var orderStatus = Transaction.wrap(function () {
            if (OrderMgr.placeOrder(order) === Status.ERROR) {
                OrderMgr.failOrder(order);
				Logger.error('Error on OrderMgr.placeOrder so fail the Order');
                return false;
            }

            return true;
        });
	} catch (error) {
		Logger.error('Error on update the Order Status in after Order Post and error :' + error);
	}

	// Send the Confirmation Email
	try {
		orderUtils.sendOrderConfirmationEmail(order);
	} catch (error) {
		Logger.error('Error on send OrderConfirmation Email in after Post and error :' + error);
	}

    return new Status(Status.OK);
};