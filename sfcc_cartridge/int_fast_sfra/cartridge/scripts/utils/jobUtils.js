/**
* 
* jobUtils.ds  -  Utility functions for Fast Job custom logic.
*
*/
importPackage( dw.net );
var File = require('dw/io/File');
var Site = require('dw/system/Site');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var Calendar = require('dw/util/Calendar');
var OrderMgr = require('dw/order/OrderMgr');
var FileReader = require('dw/io/FileReader');
var FileWriter = require('dw/io/FileWriter');
var StringUtils = require('dw/util/StringUtils');
var Transaction = require('dw/system/Transaction');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var XMLStreamReader = require('dw/io/XMLStreamReader');
var XMLStreamConstants = require('dw/io/XMLStreamConstants');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderUpdate');

/**
 * Define the Job Types
 */
const JOB_TYPE = {
	FULFILLMENT: "fulfillment",
	UPDATE: "update",
	CANCEL: "cancel",
    REFUND: "refund"
} 

/**************************  Read XML file Utils  ******************************/

/**
 * Read the Update File and convert into Json.
 * 
 * @param {*} file 
 * @returns 
 */
function readUpdateFileAsJson(file , jobType) {
    Logger.info('Read and Converting the Update File into Json Process is stared : ' + file.name);
    var itemJson = {};
    itemJson.isError = false;
    try {
        //Convert into XML 
        var fileReader = new FileReader(file, "UTF-8");
        var xmlStreamReader = new XMLStreamReader(fileReader);
        while (xmlStreamReader.hasNext()) {
            if (xmlStreamReader.next() == XMLStreamConstants.START_ELEMENT) {
                if (xmlStreamReader.getLocalName() == 'order') {
                    var orderXML = xmlStreamReader.readXMLObject();

                    //Read Order Number
                    var orderNumber = orderXML.attribute('order-no');
                    itemJson.orderNumber = orderNumber ? orderNumber.toString() : null;
                    Logger.info('begin to process order, orderNo: ' + orderNumber);
                    default xml namespace = 'http://www.demandware.com/xml/impex/order/2006-10-31';

                    //Read Status
                    var xmlStatus = orderXML.elements('status');
                    itemJson.status = readStatus(xmlStatus, orderNumber);

                    if(JOB_TYPE.FULFILLMENT == jobType){
                        //Read shipment
                        var xmlShipments = orderXML.elements('shipments');
                        itemJson.shipment = readShipments(xmlShipments, orderNumber);

                        //Read productLineItems
                        var productLineItems = orderXML.elements('product-lineitems');
                        itemJson.product = readProductLines(productLineItems, orderNumber);
                    }

                    //Read custom-attributes
                    var orderCustomAtts = orderXML.elements('custom-attributes');
                    if(orderCustomAtts){
                        for each (var orderCustomAtt in orderCustomAtts.children()) {
                            if (orderCustomAtt.attribute('attribute-id') == 'fastId') {
                                itemJson.fastId = orderCustomAtt.toString();
                            }
                            if (orderCustomAtt.attribute('attribute-id') == 'fastEventType') {
                                itemJson.fastEventType = getEventType(orderCustomAtt.toString())
                            }

                            if(JOB_TYPE.CANCEL == jobType){
                                if (orderCustomAtt.attribute('attribute-id') == 'fastReasonCode') {
                                    itemJson.fastReasonCode = getCancelReason(orderCustomAtt.toString());
                                }
                                if (orderCustomAtt.attribute('attribute-id') == 'fastReasonNote') {
                                    itemJson.fastReasonNote = orderCustomAtt.toString();
                                }
                            }
                        }
                    } else{
                        Logger.debug('Custom attributes id missing for order no :' + orderNumber);
                    }
                }
            }
        }
    }catch(e) {
            var error = 'Error on readUpdateFileAsJson for Order and Error is ' + e;
            Logger.error(error);
            // Set the Error data in JSON
            itemJson.isError = true;
            itemJson.error(error);
    }finally{
        //Close the Reader
        xmlStreamReader.close();
        fileReader.close();
    }

    Logger.debug('End of jobUtils.readUpdateFileAsJson()');
    return itemJson;
}

/**
 * Read Status attributes from XML file and convert into Json.
 * 
 * @param {*} xmlStatus 
 * @param {*} orderNumber 
 * @returns statusJson
 */
function readStatus(xmlStatus, orderNumber) {
    var statusJson = {}
    if(xmlStatus){
        statusJson.orderStatus = xmlStatus.elements('order-status');
        statusJson.shippingStatus = xmlStatus.elements('shipping-status');
        statusJson.confirmationStatus = xmlStatus.elements('confirmation-status');
        statusJson.exportStatus = xmlStatus.elements('export-status');
        statusJson.paymentStatus = xmlStatus.elements('payment-status');
    }else{
        Logger.debug('Status attributes are missing for order no :' + orderNumber);
    }
    return statusJson;
}

/**
 * Read Shipments attributes from XML file and convert into Json.
 * 
 * @param {*} xmlShipments 
 * @param {*} orderNumber 
 * @returns shipmentJson
 */
function readShipments(xmlShipments, orderNumber) {
    var shipmentJson = {}
    if(xmlShipments){
        var shipment = xmlShipments.elements('shipment');
        if(shipment){
            shipmentJson.shipmentID = shipment.attribute('shipment-id');;
            shipmentJson.trackingNumber = shipment.elements('tracking-number').toString();
            shipmentJson.shippingMethod = shipment.elements('shipping-method').toString();

            var estimatedDeliveryDate;
            var shipmentCustomAtts = shipment.elements('custom-attributes');
            for each (var shipmentCustomAtt in shipmentCustomAtts.children()) {
                if (shipmentCustomAtt.attribute('attribute-id') == 'estimatedDeliveryDate') {
                    estimatedDeliveryDate = shipmentCustomAtt.toString();
                }
            }
            shipmentJson.estimatedDeliveryDate = estimatedDeliveryDate;
        }else{
            Logger.debug('Shipment attributes are missing for order no :' + orderNumber);
        }
    }else{
        Logger.debug('Shipments attributes are missing for order no :' + orderNumber);
    }
    return shipmentJson;
}

/**
 * Read Product attributes from XML file and convert into Json.
 * 
 * @param {*} productLineItems 
 * @param {*} orderNumber 
 * @returns productJson
 */
function readProductLines(productLineItems, orderNumber) {
    var productJson = [];
    //Set product-line items
    if (!empty(productLineItems)) {
        var productLineItemElements = productLineItems.elements('product-lineitem');
        for each (var productLineItemElement in productLineItemElements) {
            var productLineJson = {}
            var fastProdLineId;
            var prodCustomAtts = productLineItemElement.elements('custom-attributes');
            for each (var prodCustomAtt in prodCustomAtts.children()) {
                if (prodCustomAtt.attribute('attribute-id') == 'fastProdLineId') {
                    fastProdLineId = prodCustomAtt.toString();
                }
            }
            productLineJson.quantity = productLineItemElement.elements('quantity').toString();
            productLineJson.productId = productLineItemElement.elements('product-id');
            productLineJson.fastProdLineId = fastProdLineId;

            productLineJson.externalLineItemStatus = productLineItemElement.elements('product-status');
            productJson.push(productLineJson);
        }
    }else{
        Logger.debug('Product attributes are missing for order no :' + orderNumber);
    }

    return productJson;
}

/**
 * Read the Refund File and convert into Json.
 * 
 * @param {*} file 
 * @returns 
 */
function readRefundFileAsJson(file) {
    Logger.info('Read and Converting the Refund File into Json Process is stared : ' + file.name);
    var returnJson = {};
    returnJson.isError = false;
    try {
        //Convert into XML 
        var fileReader = new FileReader(file, "UTF-8");
        var xmlStreamReader = new XMLStreamReader(fileReader);
        while (xmlStreamReader.hasNext()) {
            if (xmlStreamReader.next() == XMLStreamConstants.START_ELEMENT) {
                if (xmlStreamReader.getLocalName() == 'return') {
                    var returnXML = xmlStreamReader.readXMLObject();

                    default xml namespace = 'urn:demandware.com:oms:return_import_feed:99.9';
                    //Read the Order Data
                    var orderNo = returnXML.elements('order-no').toString();
                    returnJson.returnOrder = orderNo;

                    //Read the Return data
                    returnJson.returnCaseNumber = returnXML.elements('return-case-number').toString();
                    returnJson.returnNumber = returnXML.elements('return-number').toString();
                    returnJson.status = returnXML.elements('status').toString();

                    //Read Return item data
                    var returnItems = returnXML.elements('return-items');
                    var returnItemsJson = [];
                    for each (var returnItem in returnItems.children()) {
                        var returnItemJson = {}
                        returnItemJson.productId = returnItem.elements('product-id').toString();
                        returnItemJson.quantity = returnItem.elements('quantity').toString();
                        returnItemJson.reasonCode = returnItem.elements('reason-code').toString();

                        //Read  Return item custom-attributes
                        var customAttrs = returnItem.elements('custom-attributes');
                        if(customAttrs){
                            for each (var customAttr in customAttrs.children()) {
                                if (customAttr.attribute('attribute-id') == 'fastReasonCode') {
                                    returnItemJson.fastReasonCode = getRefundReason(customAttr.toString());
                                }
                                if (customAttr.attribute('attribute-id') == 'fastReasonNote') {
                                    returnItemJson.fastReasonNote = customAttr.toString();
                                }
                                if (customAttr.attribute('attribute-id') == 'fastProdLineId') {
                                    returnItemJson.fastProdLineId = customAttr.toString();
                                }
                            }
                        } else{
                            Logger.debug('Return Item Custom attributes are missing for order no :' + orderNo);
                        }
                        if(!empty(returnItemJson.productId) && !empty(returnItemJson.quantity)){
                            returnItemsJson.push(returnItemJson);
                        }
                        
                    }
                    returnJson.returnItems = returnItemsJson;

                    //Read Return custom-attributes
                    var returnCustomAtts = returnXML.elements('custom-attributes');
                    if(returnCustomAtts){
                        for each (var returnCustomAtt in returnCustomAtts.children()) {
                            if (returnCustomAtt.attribute('attribute-id') == 'fastReasonCode') {
                                returnJson.fastReasonCode = getRefundReason(returnCustomAtt.toString());
                            }
                            if (returnCustomAtt.attribute('attribute-id') == 'fastReasonNote') {
                                returnJson.fastReasonNote = returnCustomAtt.toString();
                            }
                            if (returnCustomAtt.attribute('attribute-id') == 'fastRefundMethod') {
                                returnJson.fastRefundMethod = getRefundMethod(returnCustomAtt.toString())
                            }
                            if (returnCustomAtt.attribute('attribute-id') == 'capturedAmount') {
                                returnJson.capturedAmount = returnCustomAtt.toString();
                            }
                            if (returnCustomAtt.attribute('attribute-id') == 'capturedTaxAmount') {
                                returnJson.capturedTaxAmount = returnCustomAtt.toString();
                            }
                            if (returnCustomAtt.attribute('attribute-id') == 'capturedShipAmount') {
                                returnJson.capturedShipAmount = returnCustomAtt.toString();
                            }
                            if (returnCustomAtt.attribute('attribute-id') == 'fastId') {
                                returnJson.fastId = returnCustomAtt.toString();
                            }
                        }
                    } else{
                        Logger.debug('Custom attributes id missing for order no :' + orderNo);
                    }
                }
            }
        }
    }catch(e) {
            var error = 'Error on readRefundFileAsJson for Return and Error is ' + e;
            Logger.error(error);
            // Set the Error data in JSON
            returnJson.isError = true;
            returnJson.error(error);
    }finally{
        //Close the Reader
        xmlStreamReader.close();
        fileReader.close();
    }

    Logger.debug('End of jobUtils.readRefundFileAsJson()');
    return returnJson;
}


/**************************  Get the Fast Order / Refund Data Utils  ******************************/

/**
 * get SFCC Order Status from XML Order status.
 * 
 * @param {*} param 
 * @returns SFCC Order Status
 */
function getOrderStatus(param) {
    var orderStatus;

    if(param && !empty(param)){

        switch(param.toString())
        {
            case 'CREATED': 		
                orderStatus = Order.ORDER_STATUS_CREATED;
                break;
            case 'NEW': 		
                orderStatus = Order.ORDER_STATUS_NEW;
                break;
            case 'OPEN': 
                orderStatus = Order.ORDER_STATUS_OPEN;
                break;
            case 'COMPLETED':	
                orderStatus = Order.ORDER_STATUS_COMPLETED;
                break;
            case 'CANCELLED': 	
                orderStatus = Order.ORDER_STATUS_CANCELLED;
                break;
            case 'FAILED': 	
                orderStatus = Order.ORDER_STATUS_FAILED;
                break;
            case 'REPLACED': 	
                orderStatus = Order.ORDER_STATUS_REPLACED;
                break;
            default:
                Logger.error('Error on getOrderStatus() - Unable to find the Order Status for '+ param.toString());
                break;
        }
    }

    return orderStatus;
};

/**
 * get SFCC Payment Status from XML Order status.
 * 
 * @param {*} param 
 * @returns paymentStatus
 */
function getPaymentStatus(param) {
    var paymentStatus;

    if(param && !empty(param)){

        switch(param.toString())
        {
            case 'NOT_PAID': 		
                paymentStatus = Order.PAYMENT_STATUS_NOTPAID;
                break;
            case 'PAID': 		
                paymentStatus = Order.PAYMENT_STATUS_PAID;
                break;
            case 'PART_PAID': 
                paymentStatus = Order.PAYMENT_STATUS_PARTPAID;
                break;
            default:
                Logger.error('Error on getPaymentStatus() - Unable to find the Payment Status for '+ param.toString());
                break;
        }
    }

    return paymentStatus;
};

/**
 * get SFCC Shipping Status from XML Order status.
 * 
 * @param {*} param 
 * @returns 
 */
function getShippingStatus(param) {
    var shippingStatus;

    if(param && !empty(param)){

        switch(param.toString())
        {
            case 'SHIPPED': 		
                shippingStatus = Order.SHIPPING_STATUS_SHIPPED;
                break;
            case 'NOT_SHIPPED': 		
                shippingStatus = Order.SHIPPING_STATUS_NOTSHIPPED;
                break;
            case 'PART_SHIPPED': 
                shippingStatus = Order.SHIPPING_STATUS_PARTSHIPPED;
                break;
            default:
                Logger.error('Error on getShippingStatus() - Unable to find the Shipping Status for '+ param.toString());
                break;
        }
    }

    return shippingStatus;
};

/**
 * get SFCC Confirmation Status from XML Order status.
 * 
 * @param {*} param 
 * @returns confirmationStatus
 */
function getConfirmationStatus(param) {
    var confirmationStatus;

    if(param && !empty(param)){

        switch(param.toString())
        {
            case 'CONFIRMED': 		
                confirmationStatus = Order.CONFIRMATION_STATUS_CONFIRMED;
                break;
            case 'NOT_CONFIRMED': 		
                confirmationStatus = Order.CONFIRMATION_STATUS_NOTCONFIRMED;
                break;
            default:
                Logger.error('Error on getConfirmationStatus() - Unable to find the Confirmation Status for '+ param.toString());
                break;
        }
    }

    return confirmationStatus;
};

/**
 * get SFCC Export Status from XML Order status.
 * 
 * @param {*} param 
 * @returns exportStatus
 */
function getExportStatus(param) {
    var exportStatus;

    if(param && !empty(param)){

        switch(param.toString())
        {
            case 'NOT_EXPORTED': 		
                exportStatus = Order.EXPORT_STATUS_NOTEXPORTED;
                break;
            case 'EXPORTED': 		
                exportStatus = Order.EXPORT_STATUS_EXPORTED;
                break;
            case 'READY': 
                exportStatus = Order.EXPORT_STATUS_READY;
                break;
            case 'FAILED': 
                exportStatus = Order.EXPORT_STATUS_FAILED;
                break;
            default:
                Logger.error('Error on getExportStatus() - Unable to find the Export Status for '+ param.toString());
                break;
        }
    }

    return exportStatus;
};
/**
 * Calculate and get Fast Order Status from 
 *        * orderStatus
 *        * shippingStatus
 *        * confirmationStatus
 *        * paymentStatus
 *        * exportStatus
 * 
 * @param {*} order 
 * @returns fastOrderStatus
 */
function getFastOrderStatus(order) {
    var fastOrderStatus;

    //Read the value from Order
    var orderStatus = order.getStatus() ? order.getStatus().value : '';
    var shippingStatus = order.getShippingStatus() ? order.getShippingStatus().value : '';
    var confirmationStatus = order.getConfirmationStatus() ? order.getConfirmationStatus().value : '';
    var paymentStatus = order.getPaymentStatus() ? order.getPaymentStatus().value : '';
    var exportStatus = order.getExportStatus() ? order.getExportStatus().value : '';

    //Check and assign Fast Order Status
    if(Order.ORDER_STATUS_CREATED == orderStatus && Order.SHIPPING_STATUS_NOTSHIPPED == shippingStatus 
            && Order.CONFIRMATION_STATUS_NOTCONFIRMED == confirmationStatus && Order.PAYMENT_STATUS_NOTPAID == paymentStatus 
            && Order.EXPORT_STATUS_NOTEXPORTED == exportStatus){
                fastOrderStatus = 'ORDER_STATUS_PENDING';
    }else if((Order.ORDER_STATUS_NEW == orderStatus || Order.ORDER_STATUS_OPEN == orderStatus) && Order.SHIPPING_STATUS_NOTSHIPPED == shippingStatus 
            && Order.CONFIRMATION_STATUS_NOTCONFIRMED == confirmationStatus && Order.PAYMENT_STATUS_NOTPAID == paymentStatus 
            && Order.EXPORT_STATUS_NOTEXPORTED == exportStatus){
                fastOrderStatus = 'ORDER_STATUS_BOOKED';
    }else if((Order.ORDER_STATUS_NEW == orderStatus || Order.ORDER_STATUS_OPEN == orderStatus) && Order.SHIPPING_STATUS_NOTSHIPPED == shippingStatus 
            && Order.CONFIRMATION_STATUS_NOTCONFIRMED == confirmationStatus && Order.PAYMENT_STATUS_PAID == paymentStatus 
            && Order.EXPORT_STATUS_READY == exportStatus){
                fastOrderStatus = 'ORDER_STATUS_PENDING_FULFILLMENT';
    }else if(Order.ORDER_STATUS_COMPLETED == orderStatus  && Order.SHIPPING_STATUS_SHIPPED == shippingStatus 
            && Order.CONFIRMATION_STATUS_CONFIRMED == confirmationStatus && Order.PAYMENT_STATUS_PAID == paymentStatus 
            && Order.EXPORT_STATUS_EXPORTED == exportStatus){
                fastOrderStatus = 'ORDER_STATUS_FULFILLED';
    }else if(Order.ORDER_STATUS_COMPLETED == orderStatus  && Order.SHIPPING_STATUS_SHIPPED == shippingStatus 
            && Order.CONFIRMATION_STATUS_CONFIRMED == confirmationStatus && Order.PAYMENT_STATUS_PAID == paymentStatus 
            && Order.EXPORT_STATUS_EXPORTED == exportStatus){
                fastOrderStatus = 'ORDER_STATUS_COMPLETE';
    }else if(Order.ORDER_STATUS_CANCELLED == orderStatus){
                fastOrderStatus = 'ORDER_STATUS_CANCELED';
    }else {
        fastOrderStatus = 'ORDER_STATUS_PENDING';
    }

    return fastOrderStatus;
};

/**
 * Calculate and get Fast Event Type from given event string.
 * 
 * @param {*} param 
 * @returns eventType
 */
function getEventType(param) {
    var eventType;

    if(param && !empty(param)){
        switch(param.toString())  
        {
            case 'UNSPECIFIED': 		
                eventType = 'BUSINESS_EVENT_TYPE_UNSPECIFIED';
                break;
            case 'FULFILLMENT': 		
                eventType = 'BUSINESS_EVENT_TYPE_FULFILLMENT';
                break;
            case 'CLEAR_TO_COLLECT_PAYMENT':		
                eventType = 'BUSINESS_EVENT_TYPE_CLEAR_TO_COLLECT_PAYMENT';
                break;
            default:
                Logger.error('Error on getEventType() - Unable to find the Event Type for '+ param.toString());
                break;
        }
    }

    return eventType;
};

/**
 * Calculate and get Fast Reason Code from given reason code string.
 * 
 * @param {*} param 
 * @returns Fast Reason Code
 */
function getCancelReason(param) {
    var reasonCode;

    if(param && !empty(param)){
        switch(param.toString())  
        {
            case 'UNSPECIFIED': 		
                reasonCode = 'CANCEL_REASON_CODE_UNSPECIFIED';
                break;
            case 'CUSTOMER_INITIATED': 		
                reasonCode = 'CANCEL_REASON_CODE_CUSTOMER_INITIATED';
                break;
            case 'MERCHANT_INITIATED':		
                reasonCode = 'CANCEL_REASON_CODE_MERCHANT_INITIATED';
                break;
            case 'NO_STOCK': 		
                reasonCode = 'CANCEL_REASON_CODE_NO_STOCK';
                break;
            case 'BAD_CONFIG': 		
                reasonCode = 'CANCEL_REASON_CODE_BAD_CONFIG';
                break;
            case 'OTHER':		
                reasonCode = 'CANCEL_REASON_CODE_OTHER';
                break;            
            default:
                Logger.error('Error on getCancelReason() - Unable to find the Cancel Reason Code for '+ param.toString());
                break;
        }
    }

    return reasonCode;
};

/**
 * Calculate and get Fast Refund Reason Code from given reason code string. 
 * 
 * @param {*} param 
 * @returns Fast Refund Reason
 */
function getRefundReason(param) {
    var refundReason;
 
    if(param && !empty(param)){
        switch(param.toString())  
        {
            case 'UNSPECIFIED': 		
                refundReason = 'REFUND_REASON_CODE_UNSPECIFIED';
                break;
            case 'UNSATISFIED': 		
                refundReason = 'REFUND_REASON_CODE_UNSATISFIED';
                break;
            case 'WRONG_OPTION': 		
                refundReason = 'REFUND_REASON_CODE_WRONG_OPTION';
                break;
            case 'WRONG_PRODUCT':		
                refundReason = 'REFUND_REASON_CODE_WRONG_PRODUCT';
                break;
            case 'DAMAGED_PRODUCT': 		
                refundReason = 'REFUND_REASON_CODE_DAMAGED_PRODUCT';
                break;
            case 'NOT_DELIVERED': 		
                refundReason = 'REFUND_REASON_CODE_NOT_DELIVERED';
                break;
            case 'WRONG_TAX':		
                refundReason = 'REFUND_REASON_CODE_WRONG_TAX';
                break;
            case 'WRONG_SHIPPING': 		
                refundReason = 'REFUND_REASON_CODE_WRONG_SHIPPING';
                break;
            case 'OVERCHARGE': 		
                refundReason = 'REFUND_REASON_CODE_OVERCHARGE';
                break;
            case 'COURTESY':		
                refundReason = 'REFUND_REASON_CODE_COURTESY';
                break;
            case 'OTHER': 		
                refundReason = 'REFUND_REASON_CODE_OTHER';
                break;
            default:
                Logger.error('Error on getRefundReason() - Unable to find the Refund Reason for '+ param.toString());
                break;
        }
    }

    return refundReason;
};

/**
 * Calculate and get Fast Refund Method from given Refund method string. 
 * 
 * @param {*} param 
 * @returns 
 */
function getRefundMethod(param) {
    var refundMethod;

    if(param && !empty(param)){
        switch(param.toString())  
        {
            case 'UNSPECIFIED': 		
                refundMethod = 'REFUND_METHOD_UNSPECIFIED';
                break;
            case 'STORE_CREDIT': 		
                refundMethod = 'REFUND_METHOD_STORE_CREDIT';
                break;
            case 'ORIGINAL_METHOD':		
                refundMethod = 'REFUND_METHOD_ORIGINAL_METHOD';
                break;
            default:
                Logger.error('Error on getRefundMethod() - Unable to find the Refund Method for '+ param.toString());
                break;
        }
    }

    return refundMethod;
};

/**************************  Updated SFCC Order Utils  ******************************/

/**
 * Updated the Given Order date (from File) in SFCC Order Object.
 * 
 * @param {*} fileJson 
 * @returns error 
 */
 function updateOrder(fileJson , jobType) {
    var error = null;
    Logger.info('Update in SFCC Order Process is stared for Order  : ' + fileJson.orderNumber);
    try{
        var orderObj = OrderMgr.getOrder(fileJson.orderNumber);
        if(orderObj){
            var statusJson =  fileJson.status;
            setOrderStatus(orderObj , statusJson)

            if(JOB_TYPE.FULFILLMENT == jobType){
                var shipmentJson =  fileJson.shipment;
                setOrderShipment(orderObj , shipmentJson)

                var productsJson =  fileJson.product;
                setOrderProducts(orderObj , productsJson)
            }

            //Get the Fast Order Status from Current Order Status
            var fastOrderStatus = getFastOrderStatus(orderObj);
            fileJson.fastOrderStatus = fastOrderStatus;
            
            setOrderCustom(orderObj , fileJson, jobType)

            if(JOB_TYPE.CANCEL == jobType){
                //update values in SFCC Order
                error = cancelOrder(orderObj, fileJson);
            }   

        }else{
            error = 'Unable to find the Order in SFCC with given Order nbr' + fileJson.orderNumber;
            Logger.error(error);
        }
        }catch(e) {
            error = 'Error on update the Order nbr ' + fileJson.orderNumber + ' And the Error is ' + e;
            Logger.error(error);
        }

        return error;
}

/**
 * Cancel the Given Order date (from File) in SFCC Order Object.
 * 
 * @param {*} order 
 * @param {*} fileJson 
 * @returns error
 */
function cancelOrder(order , fileJson) {
    Logger.info('Cancel Order in SFCC Order Process is stared for Order  : ' + fileJson.orderNumber);
    var error = null;
    try{
        //Cancel the Order
        OrderMgr.cancelOrder(order);
        //Set the Cancel code and note
        Transaction.wrap(function () {
            order.setCancelCode(fileJson.fastReasonCode);
            order.setCancelDescription(fileJson.fastReasonNote);
        });
    }catch(e) {
        error = 'Error on Cancel the Order nbr ' + fileJson.orderNumber + ' And the Error is ' + e;
        Logger.error(error);
    }

    return error;
}

/**
 * Return the Given Order date (from File) in SFCC Order Object.
 * 
 * @param {*} param 
 * @returns  error
 */

function returnOrder(param) {
    
    var error = null;
    var orderNo = param.returnOrder;
    Logger.info('SFCC Return Order Process is stared for Order  : ' + param.returnOrder);
    try{
        var order = OrderMgr.getOrder(param.returnOrder);
        if(order){
            //Init the refund Json
            var refund = {};
            refund.returnCaseNumber = param.returnCaseNumber;
            refund.returnNumber = param.returnNumber;
            refund.fastOrderId = param.fastId;
            refund.reason = param.fastReasonCode;
            refund.note = param.fastReasonNote;
            refund.method = param.fastRefundMethod;
            refund.amount = param.capturedAmount;
            refund.taxAmount = param.capturedTaxAmount;
            refund.shippingAmount = param.capturedShipAmount;

            //Set the return Item 
            var refundLines =[]
            var products = param.returnItems;
            products.forEach(returnItem => {
                //Init and set Product
                var orderLine ={}
                orderLine.value = returnItem.fastProdLineId;
                orderLine.productId= returnItem.productId;
                orderLine.quantity = returnItem.quantity;
                orderLine.reason= returnItem.fastReasonCode;
                refundLines.push(orderLine);
            });
            refund.refundLines = refundLines;

            //Read the Return data from Order
            var returnData=[];
            var oldReturnData = order.custom.returnData;
            if(oldReturnData==null || oldReturnData.length == 0){
                returnData.push(JSON.stringify(refund));
            }else{
                var newReturnData=[];
                newReturnData.push(JSON.stringify(refund));
                //Merge the old and new return data
                returnData = oldReturnData.concat(newReturnData);
            }
            Transaction.wrap(function () {
                order.custom.returnData=returnData;
            });

        }else{
            error = 'Unable to find the Order in SFCC with given Order nbr' + orderNo;
            Logger.error(error);
        }
        }catch(e) {
            error = 'Error on update the Order nbr ' + orderNo + ' And the Error is ' + e;
            Logger.error(error);
        }

        return error;
}

/**
 * Set below Order status in Order Object from given param.
 *      * order-status
 *      *  shipping-status
 *      *  confirmation-status
 *      *  payment-status
 *      *  export-status
 *  
 * @param {*} order 
 * @param {*} param 
 */
function setOrderStatus(order , param) {
    //Set Status
    if(param){
        Transaction.wrap(function () {
            //order-status
            if(param.orderStatus){
                order.setStatus(getOrderStatus(param.orderStatus));
            }

            //shipping-status
            if(param.shippingStatus){
                order.setShippingStatus(getShippingStatus(param.shippingStatus));
            }

            //confirmation-status 
            if(param.confirmationStatus){
                order.setConfirmationStatus(getConfirmationStatus(param.confirmationStatus));
            }

            //payment-status
            if(param.paymentStatus){
                order.setPaymentStatus(getPaymentStatus(param.paymentStatus));
            }

            //export-status 
            if(param.exportStatus){
                order.setExportStatus(getExportStatus(param.exportStatus));
            }
        });
    }
}

/**
 * Set Order Product value in Order Object from given param.
 * SFCC will not updated quantity and fastProdLineId in Order Object.
 * 
 * @param {*} order 
 * @param {*} param 
 */
function setOrderProducts(order , param) {
    if(param){
        for each (var productLine in param) {
            for each (var productLineItem in order.getAllProductLineItems()) {
                //Read the quantity and send to Fast. 
                if (productLineItem.productID == productLine.productId) {
                    if (productLine.externalLineItemStatus) {
                        Transaction.wrap(function () {
                            productLineItem.externalLineItemStatus = productLine.externalLineItemStatus;
                            productLineItem.custom.fastProdLineId = productLine.fastProdLineId;
                        });
                    }
                }
            }
        }
    }else{
        Logger.error('Error on setOrderProducts - No Order Product data to process');
    }
}

/**
 * Set Order Shipment into SFCC Order Object from given param.
 * 
 * @param {*} order 
 * @param {*} param 
 */
function setOrderShipment(order , param) {
    if(param){
        //Set shipments
        var orderShipment = order.getDefaultShipment();
        if (!empty(orderShipment) && !empty(param.trackingNumber)) {
            if (orderShipment.shipmentNo == param.shipmentID) {
                //set tracking number
                Transaction.wrap(function () {
                    orderShipment.trackingNumber = param.trackingNumber; 
                });
                // set estimated Delivery Date
                Transaction.wrap(function () {
                    orderShipment.custom.estimatedDeliveryDate = param.estimatedDeliveryDate; 
                });
            }
        }
    }else{
        Logger.error('Error on setOrderShipment - No Order Shipment data to process');
    }
}

/**
 * Set below Fast Custom attributes into SFCC Order Object and will not store the Fast Event Type
 *     Fast ID
 *     Fast Status 
 * 
 * @param {*} order 
 * @param {*} param 
 */
function setOrderCustom(order , param) {

    Transaction.wrap(function () {
        if(param.fastId){
            order.custom.fastId = param.fastId;
        }
        if(param.fastOrderStatus){
            order.custom.fastStatus = param.fastOrderStatus;
        }
        
    });
}

/**************************   File Utils  ******************************/
/**
 * Archive the given file in given locations.
 * 
 * @param {*} fileSrc 
 * @param {*} archiveFolder 
 * @returns 
 */
 function archiveFile(fileSrc , archiveFolder) {
    try {
        var file = new File(fileSrc);

        Logger.info('File archive process is stared for   ' + file.fullPath);
        if (!file.exists()) {
           Logger.error('Error on archiveFile and File ' + file.fullPath + ' not found');
        }
        
        var archivePath = archiveFolder + '-' + getCurrentDateString(true) + File.SEPARATOR;
        var archiveFileString = archivePath + file.name;
        
        //Create archive file path
        var md = new File(archivePath).mkdirs();
        var archiveFile = new File(archiveFileString);
        
        //Move the file to Archive
        var result = file.renameTo(archiveFile);
        if (!result) {
            Logger.error('Error on ArchiveFile: Can not move the ' + file.fullPath + ' to ' + archiveFile.fullPath);
        }else{
            Logger.info('File is successfully archived to  ' + archiveFile.fullPath);
        }
        
    } catch(e) {
        Logger.error('Error on archiveFile and Error is: ' + e);
    }

    Logger.info('File archive process is completed   ' + file.fullPath);
    return;
};

/**
 * Generate CSV file for Error records.
 * 
 * @param {*} errorFolder 
 * @param {*} csvFileName 
 * @param {*} errorDataList 
 */
function generateErrorCSVFile(errorFolder, csvFileName, errorDataList){

    if(!empty(errorDataList)){
        Logger.info('Error Data found and Creating the CSV file in  ' + errorFolder)

        // Verify target folder exists
        var errorDir: File = new File(errorFolder);
        try {
            if (!errorDir.exists()) {
                errorDir.mkdirs();
            }

            // Save new CSV file with csvFileName job parameter as file name
            var fullCSVFileName = csvFileName + '-'  + getCurrentDateString(true) + '.csv';
            var csvFile = new File(errorFolder + File.SEPARATOR + fullCSVFileName);
            csvFile.createNewFile();
        
            // Start the CSV file writer
            var csvFileWriter = new FileWriter(csvFile);
            var csvWriter = new CSVStreamWriter(csvFileWriter);
        
            // Write CSV file header
            var csvHeader = [ 'Order Number', 'Fast Order Number','Error Details'];
            csvWriter.writeNext(csvHeader);

            errorDataList.forEach(errorData => {
                csvWriter.writeNext([ errorData.orderNumber, errorData.fastId, errorData.error]);
            });

            csvWriter.close();

            Logger.info('Error Data CSV file Created and file name is ' + fullCSVFileName)

        }
        catch (e) {
            Logger.error( "Error on create Error Data CSV file and error is : " + e );		
        }
    }
}

/**
 * Returns the current GMT date in yyyy-MM-dd format.
 * 
 * @returns dateString
 */
 function getCurrentDateString(withTime) {
	
    // current date/time
    var calendar : Calendar = new Calendar();
    // for data exchanges we always use GMT
    calendar.timeZone = "GMT";
    //get the date as string
    //yyyyMMddHHmmss
    var dateFormat = withTime ?  "yyyyMMddHHmmss" :  "yyyy-MM-dd"
    var dateString : String = StringUtils.formatCalendar(calendar, dateFormat);
    
    return dateString;
};

module.exports.JOB_TYPE=JOB_TYPE;
module.exports.returnOrder=returnOrder;
module.exports.updateOrder=updateOrder;
module.exports.archiveFile = archiveFile;
module.exports.getFastOrderStatus =getFastOrderStatus;
module.exports.readUpdateFileAsJson =readUpdateFileAsJson;
module.exports.generateErrorCSVFile=generateErrorCSVFile;
module.exports.getCurrentDateString=getCurrentDateString;
module.exports.readRefundFileAsJson=readRefundFileAsJson;
