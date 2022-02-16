/**
* 
* OrderUtils.ds  -  Utility functions for Fast Orders custom logic.
*
*/
var Site = require('dw/system/Site');
var Resource = require('dw/web/Resource');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderCreations');

/**
 * Custom Send Order Confirmation Email
 * @param {dw.order.Order} order represents Order.
 * @return {void}
 */
var sendOrderConfirmationEmail = function (order) {

    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

    try {
        var orderModel = new OrderModel(order, { countryCode: order.currencyCode, containerView: 'order' });
        var orderObject = { order: orderModel };
        var toEmail = order.custom.fastEmailId ? order.custom.fastEmailId : order.customerEmail;
    
        var emailObj = {
            to: toEmail,
            subject: Resource.msg('subject.order.confirmation.email', 'order', null),
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@fast.com',
            type: emailHelpers.emailTypes.orderConfirmation
        };
    
        emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationEmail', orderObject);
        Logger.debug('Sent Order confirmation Email to ' + order.customerEmail);

    } catch (error) {
        Logger.error('Error on send OrderConfirmation Email in after Post and error :' + error);
    }
};

/**
 * Get order level discount total
 * 
 * @param {*} order 
 * @returns 
 */
function getOrderDiscount(order) {
    var orderDiscount;
    try {
        if(order){
            var totalExcludingOrderDiscount = order.getAdjustedMerchandizeTotalPrice(false);
            var totalIncludingOrderDiscount = order.getAdjustedMerchandizeTotalPrice(true);
            orderDiscount = totalExcludingOrderDiscount.subtract(totalIncludingOrderDiscount);
        }
    } catch (error) {
        Logger.error('Error on orderUtils.getOrderDiscount and error :' + error);
    }

    return orderDiscount ? orderDiscount.value : 0;
}


module.exports.getOrderDiscount = getOrderDiscount;
module.exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
