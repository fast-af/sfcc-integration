var server = require('server');
var page = module.superModule;
server.extend(page);
var cartUtils = require('*/cartridge/scripts/utils/cartUtils');

/**
 * Extend Cart-Show to add a special `cartId` parameter to the page, so that know if we are passing the basket UUID to use on the cart.
 * Also adding `isFastEnabled` parameter to the page for validation if fast is enabled on the cart.
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @return {[type]}       [description]
 */
server.append('Show', function(req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentOrNewBasket();

    if (currentBasket) {
        var result = {
            cartId: currentBasket.UUID,
            isFastEnabled: cartUtils.fastEnabled(currentBasket.getAllProductLineItems())
        };
    }

    res.setViewData(result);
    next();
});

/**
 * Extend Cart-MiniCartShow to add a special `cartId` parameter to the page, so that know if we are passing the basket UUID to use on the mini-cart.
 * Also adding `isFastEnabled` parameter to the page for validation if fast is enabled on the cart.
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @return {[type]}       [description]
 */

server.append('MiniCartShow', function(req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    
    if (currentBasket) {
        var result = {
            cartId: currentBasket.UUID,
            isFastEnabled: cartUtils.fastEnabled(currentBasket.getAllProductLineItems())
        };
    }

    res.setViewData(result);
    next();
});

module.exports = server.exports();
