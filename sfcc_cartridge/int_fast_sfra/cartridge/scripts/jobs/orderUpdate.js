'use strict';
/**
 * Class to Update the Order from Job and will perform below Order Update
 * 		- Order Update with Fulfillment
 * 		- Order Update without Fulfillment
 * 		- Order Cancel
 */
var File = require('dw/io/File');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var jobUtils = require('~/cartridge/scripts/utils/jobUtils');
var serviceUtils = require('~/cartridge/scripts/utils/serviceUtils');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderUpdate');

/**
 * Job for Order Update with Fulfillment Data.
 * 
 * @param {*} params 
 */
function orderFulfillmentUpdate(params){
	orderUpdate(params , jobUtils.JOB_TYPE.FULFILLMENT);
};

/**
 * Job for Order Update without Fulfillment Data, Only Status and event_type.
 * 
 * @param {*} params 
 */
function orderStatusUpdate(params){
	orderUpdate(params , jobUtils.JOB_TYPE.UPDATE);
};

/**
 * Job for Order Cancel 
 * 
 * @param {*} params 
 */
function orderCancel(params){
	orderUpdate(params , jobUtils.JOB_TYPE.CANCEL);
};


/**
 * Internal method to Perform thr Order Update based on the Job type.
 * 
 * @param {*} params 
 * @param {*} jobType 
 * @returns Status
 */
function orderUpdate(params, jobType) {

	Logger.info('Step 2: Order Status Update Started');

	//Read the input data from Jobs
	var sourceFolder : String = params.get('sourceFolder');
	var archiveFolder : String = params.get('archiveFolder');
	var errorFolder : String = params.get('errorFolder');

	//Check the mandatory inputs
	if(!empty(sourceFolder) && !empty(archiveFolder) && !empty(errorFolder))
	{
		//Add Impex path in input folders
		sourceFolder = File.IMPEX  + sourceFolder
		archiveFolder = File.IMPEX  + archiveFolder
		errorFolder = File.IMPEX  + errorFolder;
	
		//Read the File from Impex
		var sourceDir = new File(sourceFolder);
		if(sourceDir){
			var files = sourceDir.listFiles();
			var errorDataList = new Array();
	
			for each (var file in files) {
				var itemJson = {};
				if ((!file.exists()) || (!file.isFile())) {
					Logger.error('File is not found in path : ' + file.fullPath);
					continue;
				}
				else {
					Logger.info('Update Process is Started for file : ' + file.name);
					var fileJson = jobUtils.readUpdateFileAsJson(file , jobType);
					
					if(!fileJson.isError){
						Logger.info('Data is successfully converted into Json for file : ' + file.name);
						var updateError = jobUtils.updateOrder(fileJson , jobType);
						if(updateError){
							Logger.error('Error data founded during the SFCC Order update for file ' + file.name);
							fileJson.error = 'SFCC Order update Error : ' + updateError;
							errorDataList.push(fileJson);
						}else{
							Logger.info('Data is successfully Updated in SFCC Order for file : ' + file.name);
						}
	
						var serviceError = serviceUtils.orderServiceUpdate(fileJson, jobType);
						if(serviceError){
							Logger.error('Error data founded during the FAST service API call for file ' + file.name);
							fileJson.error = 'Fast update service Error : ' + serviceError;
							errorDataList.push(fileJson);
						}else{
							Logger.info('Data is successfully Sent through FAST service API for file : ' + file.name);
						}
					}else{
						Logger.error('Error data founded during the convert file into Json for file ' + file.name);
						errorDataList.push(fileJson);
					}
				}  

				//Generate a error CSV Files for Failed records
				var csvFileName = 'order-update-error-data'
				jobUtils.generateErrorCSVFile(errorFolder, csvFileName, errorDataList);

				//Archive the file
				jobUtils.archiveFile(file.fullPath , archiveFolder);

				Logger.info('Update Process Ends for file : ' + file.name);
			}   
		} else{
			//Error File not found in the locations
			Logger.error('Error on orderStatusUpdate : Source Dir is Empty');
		}

	}else{
		var error = 'Error : one or more mandatory parameters are missing from Jobs Input'
		Logger.error(error);
		return new Status(Status.ERROR, 'ERROR', error);
	}

	Logger.info('Step 2: Order Status Update Ends');
}

/* Exported functions*/
module.exports = {
	orderFulfillmentUpdate:orderFulfillmentUpdate,
	orderStatusUpdate:orderStatusUpdate,
	orderCancel:orderCancel
};
