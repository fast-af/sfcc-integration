/**
 * Class to Hook for Order  OCAPI and add the Custom logic. 
 */
var Site = require('dw/system/Site');
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
	var fastAppAuth = Site.current.getCustomPreferenceValue('fastAppAuth')

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
	
	//Set the Customer to Order
	try {
		var enableNewCustomerCreations = Site.current.getCustomPreferenceValue('enableNewCustomerCreations')
		var login = order.custom.fastEmailId;
		//Query the Customer from current Customer List
 		var profile = CustomerMgr.queryProfile('email = {0}', login);
		 //Check given User in List
		 Transaction.begin();
		if(profile){
			//If User part current User List, add the Customer to Order
			var lookupCustomer = profile.getCustomer();
			order.setCustomer(lookupCustomer);
		}else if(enableNewCustomerCreations){
			//If the given user is not part of Current User List, Create new User
			var password = fastUtils.getRandomPassword();
			var newCustomer = CustomerMgr.createCustomer(login, password);

			var firstName = order.billingAddress.firstName;
			var lastName = order.billingAddress.lastName;
			//Create new customer profile
			var newCustomerProfile = newCustomer.getProfile();
			//Add data to profile from Billing address
			newCustomerProfile.firstName = firstName;
			newCustomerProfile.lastName = lastName;
			newCustomerProfile.email = login;
			//Add address book to Customer from Shipping address
			var addressBook = newCustomerProfile.addressBook;
			var usedAddress = order.defaultShipment.shippingAddress;
	
			if(usedAddress){
				address = addressBook.createAddress(usedAddress.firstName + "_" + usedAddress.city);
				address.setFirstName(usedAddress.firstName);
				address.setLastName(usedAddress.lastName);
				address.setAddress1(usedAddress.address1);
				address.setAddress2(usedAddress.address2);
				address.setCity(usedAddress.city);
				address.setPostalCode(usedAddress.postalCode);
				address.setStateCode(usedAddress.stateCode);
				address.setCountryCode(usedAddress.countryCode.value);
				address.setPhone(usedAddress.phone);
			}
			//add the Customer to Order
			order.setCustomer(newCustomer);
			//Send Password reset email to the User. 
			fastUtils.sendPasswordResetEmail(newCustomer, login, firstName, lastName);
		}
		Transaction.commit();
	} catch (error) {
		Logger.error('Error on adding customer into Order in after Order Post and error :' + error);
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