
'use strict';

var File = require('dw/io/File');
var Site = require('dw/system/Site');
var Status = require('dw/system/Status');
var SFTPClient = require('dw/net/SFTPClient');
var Logger = require('dw/system/Logger').getLogger('Fast', 'OrderUpdate');

/**
 * Function to 
 * 		- Connect the SFTP folder with given Username and Password,
 * 		- Copy the File from Source folder and Move to Target folder
 * 		- Delete the file from Source folder if enabled
 * 
 * @param {*} params 
 */

function sftpDownload(params) {
	Logger.info('Step 1: SFTP Download Started');
	var error = null;
   try{
	   //Read the inputs from the Jobs
		var sourceFolderPath : String = params.get('sourceFolder');
		var targetFolder : String = params.get('targetFolder');
		var filePattern : String = params.get('filePattern'); //"^[\\w\-]{1,}\\.xml$"
		var deleteRemoteFiles = params.get('deleteRemoteFiles');
		var isDeleteRemoteFiles = false;
		if(!empty(deleteRemoteFiles) && String(deleteRemoteFiles).toLowerCase() == "true"){
			isDeleteRemoteFiles = true;
		}

		//Check the mandatory inputs
		if(!empty(sourceFolderPath) && !empty(targetFolder) && !empty(filePattern))
		{
			var sftpClient : SFTPClient = new SFTPClient();
			try{
				var sitePrefs  = Site.getCurrent().getPreferences();

				if (!sitePrefs) {
					return new Status(Status.ERROR, 'ERROR', 'Site is Missing for the Job ');
				}

				//set connection timeout
				sftpClient.setTimeout(0);
			
				//Read the SFTP connection details from Site Pref
				var sFTPUrl : String = "fastSFTPUrl" in sitePrefs.getCustom() ? sitePrefs.getCustom()["fastSFTPUrl"] : '';
				var sFTPUsername : String = "fastSFTPUsername" in sitePrefs.getCustom() ? sitePrefs.getCustom()["fastSFTPUsername"] : '';
				var sFTPPassword : String = "fastSFTPPassword" in sitePrefs.getCustom() ? sitePrefs.getCustom()["fastSFTPPassword"] : '';
				var sFTPPort : Number  = "fastSFTPPort" in sitePrefs.getCustom() ? sitePrefs.getCustom()["fastSFTPPort"] : '';
				var fastSFTPFileMaxSize : Number  = "fastSFTPFileMaxSize" in sitePrefs.getCustom() ? sitePrefs.getCustom()["fastSFTPFileMaxSize"] : '';

				// Get the file max size
				var MEGABYTE : Number = 1024 * 1024;
				var FILE_SIZE_DOWNLOAD_LIMIT : Number = fastSFTPFileMaxSize * MEGABYTE;

				//Check the mandatory inputs
				if(!empty(sFTPUrl) && !empty(sFTPUsername) && !empty(sFTPPassword))
				{
					if(sftpClient.connect(sFTPUrl, sFTPPort, sFTPUsername, sFTPPassword)){
						Logger.info('SFTP connected with Username :  ' + sFTPUsername);

						var sourceFolder : boolean = sftpClient.cd(sourceFolderPath);
						if(!sourceFolder){
							Logger.error('SftpDownload: Unable to find the sourceFolder ' + sourceFolderPath);
						}
						var regExp : RegExp = new RegExp(filePattern);
						var fileInfoList : Array =  sftpClient.list();

						if(fileInfoList != null && fileInfoList.length > 0)
						{
							for(var i : Number = 0; i < fileInfoList.length; i++)
							{
								var fileInfo : FTPFileInfo = fileInfoList[i];
								if(regExp.test(fileInfo.name))
								{
									var fileSize : Number = fileInfo.size;
									if ( fileSize > FILE_SIZE_DOWNLOAD_LIMIT ) {
										Logger.error('FTP download file size limit of Max exceeded for ' + fileInfo.name + '. Actual size is ' + (fileSize/MEGABYTE).toFixed(2) + ' MB.');
										return ;
									} else {
										var targetDirStr : string = targetFolder.charAt(0).equals(File.SEPARATOR) ? targetFolder  : File.SEPARATOR + targetFolder;
										var theDir : File = new File(File.IMPEX + targetDirStr);
										theDir.mkdirs();
										Logger.info('Target Directory is created in ' + theDir.fullPath);
										
										var theFile : File = new File(theDir.fullPath + File.SEPARATOR + fileInfo.name);
										sftpClient.getBinary(fileInfo.name, theFile);
										theFile.createNewFile();
										Logger.info('Target file is Moved and file name is : ' + theFile.fullPath);
										
										if(isDeleteRemoteFiles)
										{
											sftpClient.del(fileInfo.name);
											Logger.info('Target file is deleted in Remote : ' + fileInfo.name);
										}
									}
								}
							}
						}
					}else{
						error =  'Error while connecting SFTP : SFTP the connection could not be established';
						Logger.error(error);
					}
				}
				else{
					error =  'Error : User-ID and Password are required for SFTP-Connection';
					Logger.error(error);
				}
			}catch(e){
				error = 'Error on SFTP file Download and Error is :' + e;
				Logger.error(error);
				return new Status(Status.ERROR, 'ERROR', error);
			}finally{
				if(sftpClient != null && sftpClient.connected)
				{
					sftpClient.disconnect();
					Logger.info('SFTP Client is Disconnected');
				}
			}
		}else{
			error =  'Error : one or more mandatory parameters are missing from Jobs Input';
			Logger.error(error);
		}
	}catch(e){
		error =  'Error on SFTP file Download and Error is :' + e;
		Logger.error(error);
	}

	if(error){
		return new Status(Status.ERROR, 'ERROR', error);
	}

	Logger.info('Step 1: SFTP Download Ends');
	return;
}


/* Exported functions*/
module.exports = {
	sftpDownload:sftpDownload
};