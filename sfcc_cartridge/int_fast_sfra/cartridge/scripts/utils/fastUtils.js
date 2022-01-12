/**
* 
* fastUtils.ds  -  Utility functions for Fast custom logic.
*
*/
var ProductMgr = require('dw/catalog/ProductMgr');

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


module.exports.getMasterProdId = getMasterProdId;
module.exports.getDiscountedUnitPrice = getDiscountedUnitPrice;
module.exports.getLineDiscountAmount = getLineDiscountAmount;
module.exports.updateItemsAttr = updateItemsAttr;