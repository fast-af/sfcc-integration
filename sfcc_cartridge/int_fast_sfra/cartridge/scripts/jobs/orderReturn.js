
'use strict';

var File = require('dw/io/File');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var jobUtils = require('~/cartridge/scripts/utils/jobUtils');
var serviceUtils = require('~/cartridge/scripts/utils/serviceUtils');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderUpdate');

/**
 * Jobs to Read the Retunr Files, Create the Return in SFCC Order and call the Fast Return service.
 * 
 * @param {*} params 
 * @returns Status
 */
function orderReturn(params) {

	Logger.info('Step 2: Order Return Started');

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
		var jobType = jobUtils.JOB_TYPE.REFUND;
	
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
					Logger.info('Return Process is Started for file : ' + file.name);
					var fileJson = jobUtils.readRefundFileAsJson(file , jobType);
					
					if(!fileJson.isError){
						Logger.info('Data is successfully converted into Json for file : ' + file.name);
						var updateError = jobUtils.returnOrder(fileJson , jobType);
						if(updateError){
							Logger.error('Error data founded during the SFCC Order refund for file ' + file.name);
							fileJson.error = 'SFCC Order Refund Error : ' + updateError;
							errorDataList.push(fileJson);
						}else{
							Logger.info('Data is successfully Updated in SFCC for  Order Refund for file : ' + file.name);
						}
	
						var serviceError = serviceUtils.orderServiceUpdate(fileJson, jobType);
						if(serviceError){
							Logger.error('Error data founded during the Refund FAST service API call for file ' + file.name);
							fileJson.error = 'Fast Refund service Error : ' +  serviceError;
							errorDataList.push(fileJson);
						}else{
							Logger.info('Data is successfully Sent through FAST service API for file : ' + file.name);
						}
					}else{
						Logger.error('Error data founded during the convert Refund file into Json for file ' + file.name);
						errorDataList.push(fileJson);
					}
				}  

				//Generate a error CSV Files for Failed records
				var csvFileName = 'order-refund-error-data'
				jobUtils.generateErrorCSVFile(errorFolder, csvFileName, errorDataList);

				//Archive the file
				jobUtils.archiveFile(file.fullPath , archiveFolder);

				Logger.info('Return Process Ends for file : ' + file.name);
			}   
		} else{
			//Error File not found in the locations
			Logger.error('Error on orderReturn : Source Dir is Empty');
		}

	}else{
		var error = 'Error : one or more mandatory parameters are missing from Jobs Input'
		Logger.error(error);
		return new Status(Status.ERROR, 'ERROR', error);
	}

	Logger.info('Step 2: Order Return Ends');
}

/* Exported functions*/
module.exports = {
	orderReturn:orderReturn
};
