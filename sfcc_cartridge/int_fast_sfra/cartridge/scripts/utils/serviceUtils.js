/**
* 
* serviceUtils.ds  -  Utility functions for Seller to Fast service custom logic.
*
*/
importPackage( dw.net );
var Site = require('dw/system/Site');
var jobUtils = require('~/cartridge/scripts/utils/jobUtils');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderUpdate');

/**************************   Service API Utils  ******************************/

/**
 * get FAST Service based on Payload and Fast ID.
 * 
 * @param {*} fastId 
 * @param {*} payload 
 * @returns service
 */
function getService(fastId ,reqType, payload) {
    
    //Read the Fast App data from Custom Preference
    var fastAppId = Site.current.getCustomPreferenceValue('fastAppId')
    var fastAppAuth = Site.current.getCustomPreferenceValue('fastAppAuth')

    var tokenConfig = {
        createRequest: function (svc, params) {
            
            var url = svc.configuration.credential.URL;
            var prefix = getServiceUrlPrefix(fastId, reqType); 
            svc.setURL(url+prefix);
            svc.setAuthentication('NONE');
            svc.setRequestMethod('POST');

            svc.addHeader('x-fast-app', fastAppId);
            svc.addHeader('x-fast-app-auth', fastAppAuth);
            svc.addHeader('User-Agent', 'fast-scripts');
            svc.addHeader('Content-type', 'application/json');

            return JSON.stringify(payload);
        },
        parseResponse: function (service, response) {
            return JSON.parse(response.text);
        },
    
        getRequestLogMessage: function (request) {
            return JSON.stringify(request);
        },
    
        getResponseLogMessage: function (response) {
            return JSON.stringify(response);
        },
    
        filterLogMessage: function (message) {
            return message;
        }
    };

    var service =  LocalServiceRegistry.createService("FastOrder", tokenConfig);
    return service;
};

/**
 * Function to Create the Payload and make the Seller to Fast Service call for given Job type
 * 
 * Support Job type : Order Update with and without fulfillment, Order Cancel and Order Refund
 * 
 * @param {*} fileJson 
 * @param {*} jobType 
 * @returns error
 */
function orderServiceUpdate(fileJson, jobType) {
    Logger.info('Fast service API '+ jobType +' Process is stared for Order  : ' + fileJson.orderNumber);
    var error = null;
    try{
        var payload = null;
        var error = null;

        switch (jobType) {
            case jobUtils.JOB_TYPE.FULFILLMENT:
                 payload = getFulfillmentPayLoad(fileJson);
                 error = makeServiceCall(fileJson , 'update', payload);
                break;
            case jobUtils.JOB_TYPE.UPDATE:
                payload = getUpdatePayLoad(fileJson);
                error = makeServiceCall(fileJson , 'update', payload);
            case jobUtils.JOB_TYPE.CANCEL:
                payload = getCancelPayLoad(fileJson);
                error = makeServiceCall(fileJson , 'cancel', payload);
                break;
            case jobUtils.JOB_TYPE.REFUND:
                payload = getRefundPayLoad(fileJson);
                error = makeServiceCall(fileJson , 'refund', payload);
                break;
            default:
                error = 'No Job service find for type : ' + jobType + ' for Order Number ' + fileJson.orderNumber;
                Logger.error(error);
        }
        
    }catch(e) {
        error = 'Error on Fast service API Cancel Process for Order ' + fileJson.orderNumber + ' and error is ' + e;
        Logger.error(error);
    }

    return error;
};

/**
 * Make the Fast Order update service API call.
 * 
 * @param {*} fileJson 
 * @param {*} reqType 
 * @param {*} payload 
 * @returns 
 */
 function makeServiceCall(fileJson, reqType, payload) {

    var error = null;
    try{
        //Make FAST API call
        var authService = getService(fileJson.fastId ,reqType , payload);

        var authResult = authService.call();
        if(authResult.status != 'OK' && authResult.msg){
            error = authResult.status + ' ' + authResult.error + ' ' + authResult.msg;
        }
    }catch(e) {
        error = 'Error on Fast service API update Process for Order ' + fileJson.orderNumber + ' and error is ' + e;
        Logger.error(error);
    }

    return error;
};

/**
 * Get Fast Service URL Prefix based on request type.
 * 
 * @param {*} fastId 
 * @param {*} reqType 
 * @returns prefix URL
 */
function getServiceUrlPrefix(fastId, reqType){
    var prefix = fastId;

    if(reqType === 'update'){
        prefix = prefix + '/business_event'
    }else if(reqType ==='refund'){
        prefix = prefix + '/refund'
    }else if(reqType ==='cancel'){
        prefix = prefix;
    }
    
    Logger.info('Fast service API URL is '+ prefix +' for the Job type : ' + reqType);
    return prefix;
};

/**************************   Get Payload Utils  ******************************/

/**
 * Get the Fast service update API Payload from Input data in below format
 * 
 * {
 *    "order_id": {
 *        "value": "{{order_id}}"
 *     },
 *    "event_type": "BUSINESS_EVENT_TYPE_FULFILLMENT",
 *    "status": "ORDER_STATUS_COMPLETE",
 *    "fulfillment": {
 *        "order_id": {
 *            "value": "{{order_id}}"
 *         },
 *         "shipment": {
 *            "tracking_number": "12345",
 *            "carrier": "UPS",
 *            "estimated_delivery_date": "2021-09-09",
 *            "order_lines": [
 *                {
 *                    "id": {
 * 						"value": "{{item_id}}"
 * 						},
 *                    "quantity": "1"
 *                }
 *            ]
 *        }
 *    }
 * }
 * 
 * @param {*} itemJson 
 * @returns 
 */
function getFulfillmentPayLoad(itemJson) {

    //Init Payload 
    var  payload = {};

    //Init order_id and set order_id, event_type and status
    var orderId ={}
    orderId.value = itemJson.fastId;
    payload.order_id = orderId;
    payload.event_type = itemJson.fastEventType;
    payload.status = itemJson.fastOrderStatus;

    //Init and set the fulfillment
    var fulfillment ={}
    orderId.value = itemJson.fastId;
    fulfillment.order_id = orderId;

    //Init and set the shipment
    var shipment ={}
    var statusJson = itemJson.shipment;
    //shipmentJson.shipmentID = shipmentID;
    shipment.tracking_number = statusJson.trackingNumber;
    shipment.carrier = statusJson.shippingMethod;
    shipment.estimated_delivery_date = statusJson.estimatedDeliveryDate;
    
    //Init and set order Lines
    var orderLines =[]
    var products = itemJson.product;
    products.forEach(product => {
        //Init and set Product
        var orderLine ={}
        var lineId ={}
        lineId.value = product.fastProdLineId;
        orderLine.id = lineId;
        orderLine.quantity = product.quantity;
        orderLines.push(orderLine);
    });

    shipment.order_lines = orderLines;

    fulfillment.shipment = shipment;
    payload.fulfillment = fulfillment;

    return payload;

};

/**
 * Get the Fast service update API Payload from Input data in below format
 * 
 * {
 *    "order_id": {
 *        "value": "{{order_id}}"
 *    },
 *    "event_type": "BUSINESS_EVENT_TYPE_CLEAR_TO_COLLECT_PAYMENT",
 *    "status": "ORDER_STATUS_COMPLETE"
 *  }
 * 
 * @param {*} itemJson 
 * @returns 
 */
function getUpdatePayLoad(itemJson) {

    //Init Payload 
    var  payload = {};

    //Init order_id and set order_id, event_type and status
    var orderId ={}
    orderId.value = itemJson.fastId;
    payload.order_id = orderId;
    payload.event_type = itemJson.fastEventType;
    payload.status = itemJson.fastOrderStatus;

    return payload;
};

/**
 * Get the Fast service Refund API Payload from Input data in below format
 * 
 * {
 *     "order_id": {
 *         "value": "{{order_id}}"
 *     },
 *    "external_refund_id": "test_refund_id",
 *     "reason": "REFUND_REASON_CODE_COURTESY",
 *     "note": "",
 *     "method": "REFUND_METHOD_ORIGINAL_METHOD",
 *    "amount": "1.00",
 *     "tax_amount": "0.00",
 *     "shipping_amount": "0.00",
 *    "order_lines": [
 *         {
 *            "line": {
 *                "id": {
 *                    "value": "{{item_id}}"
 *                },
 *                "quantity": 1
 *            },
 *            "reason": "REFUND_REASON_CODE_COURTESY"
 *        },
 *    ]
 * }
 * 
 * @param {*} refundJson 
 * @returns 
 */
function getRefundPayLoad(refundJson) {

    //Init Payload 
    var  payload = {};

    //Init order_id and set order_id, event_type and status
    var orderId ={}
    orderId.value = refundJson.fastId;
    payload.order_id = orderId;

    //Set the Refund data
    payload.external_refund_id = refundJson.returnCaseNumber;
    payload.reason = refundJson.fastReasonCode;
    payload.note = refundJson.fastReasonNote;
    payload.method = refundJson.fastRefundMethod;
    payload.amount = refundJson.capturedAmount;
    payload.tax_amount = refundJson.capturedTaxAmount;
    payload.shipping_amount = refundJson.capturedShipAmount;
    
    //Set the return Item 
    var orderLines =[]
    var products = refundJson.returnItems;
    products.forEach(returnItem => {
        //Init and set Product
        var orderLine ={}
        var line = {}
        var id ={}
        id.value = returnItem.fastProdLineId;
        line.id = id;
        line.quantity = returnItem.quantity;
        orderLine.line = line;
        orderLine.reason= returnItem.fastReasonCode;
        orderLines.push(orderLine);
    });

    payload.order_lines = orderLines;

    return payload;
};

/**
 * Get the Fast service cancel API Payload from Input data in below format
 * 
 * {
 *     "order_id": {
 *         "value": "{{order_id}}"
 *     },
 *     "reason": "CANCEL_REASON_CODE_MERCHANT_INITIATED",
 *     "notes": "string"
 * }
 * 
 * @param {*} itemJson 
 * @returns 
 */
function getCancelPayLoad(itemJson) {

    //Init Payload 
    var  payload = {};

    //Init order_id and set order_id, reason and notes
    var orderId ={}
    orderId.value = itemJson.fastId;
    payload.order_id = orderId;

    //Set the reason and note
    payload.reason = itemJson.fastReasonCode;
    payload.notes = itemJson.fastReasonNote;

    return payload;
};


module.exports.getService = getService;
module.exports.orderServiceUpdate=orderServiceUpdate;