/**
 * Class to Hook for Basket OCAPI and add the Custom logic. 
 */
var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger');
var Transaction = require('dw/system/Transaction');
var CustomerMgr = require('dw/customer/CustomerMgr');
var fastUtils = require('*/cartridge/scripts/utils/fastUtils');
var cartUtils = require('*/cartridge/scripts/utils/cartUtils');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');

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

exports.afterPATCH =function(basket , basketInput) {
    Logger.debug('Before Basket Patch HOOK');

	//Read the value from Request Header
	var enableCreateCustomer = request.getHttpHeaders().get("x-enable-create-customer");

    //Set the Customer to Order
	try {
		var login = basket.custom.fastEmailId;
		//Query the Customer from current Customer List
 		var profile = CustomerMgr.queryProfile('email = {0}', login);

		 //Check given User in List
		if(profile){
			//If User part current User List, add the Customer to Order
			var lookupCustomer = profile.getCustomer();
            Transaction.wrap(function(){
				basket.custom.customerNo = profile.customerNo;
				basket.custom.customerId = lookupCustomer.ID;
            });
		}else if(enableCreateCustomer){

			Transaction.begin();
			//If the given user is not part of Current User List, Create new User
			var password = fastUtils.getRandomPassword();
			var newCustomer = CustomerMgr.createCustomer(login, password);

			//Create new customer profile
			var newCustomerProfile = newCustomer.getProfile();
			if(basket.billingAddress){
				//Add data to profile from Billing address
				newCustomerProfile.firstName = basket.billingAddress.firstName;
				newCustomerProfile.lastName = basket.billingAddress.lastName;
			}
			newCustomerProfile.email = login;

			//Add address book to Customer from Shipping address
			var addressBook = newCustomerProfile.addressBook;
			if(basket.defaultShipment){
			var usedAddress = basket.defaultShipment.shippingAddress;
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
			}
			basket.custom.customerNo = newCustomerProfile.customerNo;
			basket.custom.customerId = newCustomer.ID;
			Transaction.commit();

			//Send Password reset email to the User. 
			fastUtils.sendPasswordResetEmail(newCustomer, login, newCustomerProfile.firstName, newCustomerProfile.lastName);
		}
	} catch (error) {
		Logger.error('Error on adding customer into Basket in after Basket Patch and error :' + error);
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