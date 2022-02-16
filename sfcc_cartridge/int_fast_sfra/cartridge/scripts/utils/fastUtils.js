/**
* 
* fastUtils.ds  -  Utility functions for Fast custom logic.
*
*/

var Site = require('dw/system/Site');
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
var ProductMgr = require('dw/catalog/ProductMgr');
var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');
var SecureRandom = require('dw/crypto/SecureRandom');

/**
 * Get the Master Product Id for given Product.
 * 
 * @param {*} productId 
 * @returns 
 */
 function getMasterProdId(productId) {

    var product = ProductMgr.getProduct(productId);
    if(product && product.variationModel && product.variationModel.master){
        return product.variationModel.master.ID;
    }
    return null;
};

/**
 * get Discounted Unit Price from given Line item.
 * 
 * @param {*} item 
 * @returns discountedUnitPrice
 */
function getDiscountedUnitPrice(item) {
    return item.priceAfterItemDiscount / item.quantity;
};

/**
 * get Line Discount Amount from given Line item.
 * @param {*} item 
 * @returns lineDiscountAmount
 */
function getLineDiscountAmount(item) {
    return item.priceAfterItemDiscount - item.priceAfterOrderDiscount;
};

/**
 * Add below attributes to given line items,
 *      parentProductId
 *      discountedUnitPrice
 *      lineDiscountAmount
 * @param {*} items 
 * @returns 
 */
function updateItemsAttr(items) {

    for (let index = 0; index < items.length; index++) {
        var item = items[index];
        if(item){
            item.c_parentProductId  = getMasterProdId(item.productId);
            item.c_discountedUnitPrice = getDiscountedUnitPrice(item);
            item.c_lineDiscountAmount = getLineDiscountAmount(item);
        }
    }  
    return items;
};

/**
 * Method to generate the Random Password.
 */

function getRandomPassword() {
	
    var random = new SecureRandom();
    var randomStr = new String(random.nextNumber() * 1000000000000);
    var pass = randomStr.replace('.' , '_');
    var prefix = "FastPa$$";
    var suffix = "W0rd";
    var password = prefix + pass + suffix;
    
    return password;
 }

/**
 * Method to generate the reset password token and send the reset password mail to User.
 * 
 * @param {*} customer 
 * @param {*} email 
 * @param {*} firstName 
 * @param {*} lastName 
 */
function sendPasswordResetEmail(customer, email, firstName, lastName) {

    try{
        var passwordResetToken = customer.profile.credentials.createResetPasswordToken();
        var url = URLUtils.https('Account-SetNewPassword', 'Token', passwordResetToken);

        var objectForEmail = {
            passwordResetToken: passwordResetToken,
            firstName: firstName,
            lastName: lastName,
            url: url
        };

        var emailObj = {
            to: email,
            subject: Resource.msg('subject.profile.resetpassword.email', 'login', null),
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@fastco.com',
            type: emailHelpers.emailTypes.passwordChanged
        };

        emailHelpers.sendEmail(emailObj, 'account/password/passwordResetEmail', objectForEmail);

    } catch (error) {
        Logger.error('Error on send reset Password Email in after Post and error :' + error);
    }
};

module.exports.getMasterProdId = getMasterProdId;
module.exports.getDiscountedUnitPrice = getDiscountedUnitPrice;
module.exports.getLineDiscountAmount = getLineDiscountAmount;
module.exports.updateItemsAttr = updateItemsAttr;
module.exports.sendPasswordResetEmail =sendPasswordResetEmail;
module.exports.getRandomPassword=getRandomPassword;