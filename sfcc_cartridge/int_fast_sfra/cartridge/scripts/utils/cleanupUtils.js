
'use strict';

var File = require('dw/io/File');
var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderUpdate');

var FileUtils = {};

/**
 * Jobs to Read the parameters and delete the log files in Impex which are before than numberofDays parameter
 * 
 * @param {*} params 
 * @returns Status
 */
function cleanupLogs(params) {
	Logger.info('Cleanup job Started');
	//Read the input data from Jobs
	var sourceFolder : String = params.get('sourceFolder');
	var noofDays  = params.get('numberofDays');
   //Check the mandatory inputs
	if(!empty(sourceFolder) && !empty(noofDays))
	{
		//Add Impex path in input folders
		sourceFolder = File.IMPEX  + sourceFolder
		//Read the File from Impex
		var sourceDir = new File(sourceFolder);
		if(sourceDir){
			let currDate = new Date();
			Logger.info('Current Date ' + currDate); 
			currDate.setDate(currDate.getDate() - noofDays);
			Logger.info('Files before  ' + currDate + 'will be cleaned up'); 
			var files = sourceDir.listFiles();
            for each (var file in files) {
				if ((file.exists()) || (file.isFile())) {
					var fName = file.name;
                    var fnameindx = fName.indexOf("-");
                    fName = fName.substring(fnameindx+1);
                    fName = fName.substr(0,8);
					let fileDate =new Date(fName.substr(0,4),fName.substr(4,2)-1,fName.substr(6,2));
					if (currDate.getTime() > fileDate.getTime()){
						Logger.info('File exists in path and the path is ' + file.fullPath);
						FileUtils.deleteDirectory(file);
      				}				
				}
            }

        }
	}else{
		var error = 'Error : one or more mandatory parameters are missing from Jobs Input'
		Logger.error(error);
		return new Status(Status.ERROR, 'ERROR', error);
	}
	Logger.info('Cleanup job Completed');
}


/**
 * Delete given directory and all files and sub-directories in it
 *
 * @param {File} file - the directory to delete
 */

 FileUtils.deleteDirectory = function (sourceDir) {
	Logger.info('Entering deleteDirectory () ');
  	var files = sourceDir.listFiles();
          for each (var xfile in files) {
				if ((xfile.exists()) || (xfile.isFile())) {
					xfile.remove();
				}
			}
    sourceDir.remove();
	Logger.info('Exited deleteDirectory () ');
};

/* Exported functions*/
module.exports = {
	cleanupLogs:cleanupLogs
	
};
/* Exported functions */
if (typeof (exports) !== 'undefined') {
    exports.FileUtils = FileUtils;
}