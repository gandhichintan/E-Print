'use strict';

import * as iothub from 'azure-iothub';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { exec } from 'child_process';
import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { NoRetry } from 'azure-iot-common';
import { Logger } from './service.logger';
import { ServiceUtils } from './service.utils';
import { StorageUtils } from './storage.utils';
import { Config } from './service.Config';
import { PrintingJobStatus, PrintingJobStatusService } from '../shared/services/printingJobStatus.service';
import { StatusType } from '../shared/enums';


const logger = new Logger();

(process as NodeJS.EventEmitter).on('uncaughtException', function (ex) {
  logger.log(ex, logger.logType.Error);
});

const util = new ServiceUtils();
const storage = new StorageUtils();
// tslint:disable-next-line:max-line-length
const connectionString = 'HostName=eprinter.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=B+qfbMSrFm1DsggGbYsBrBhZNYhk1LEI1Yt3g8sf+Gc=';
const registry = iothub.Registry.fromConnectionString(connectionString);

let client;

const device = {
  deviceId: storage.get('email')
};

registryCreate();
reconnectHubAlways();

function reconnectHubWhenFail(err, isRemovingListener = false) {
  if (err) {
    logger.log(`Could not connect: ${err}`, logger.logType.Error);
  } else {
    logger.log(`Could not connect`, logger.logType.Error);
  }

  if (isRemovingListener) {
    client.removeAllListeners();
  }

  setTimeout(function () {
    registryCreate();
  }, Config.intervalMillisecondsToReConnectWhenFail);
}

function reconnectHubAlways() {
  setInterval(function () {
    registryCreate();
  }, Config.intervalMillisecondsToReconnect);
}

function registryCreate() {
  registry.create(device, (err, deviceInfo, res) => {
    if (err) {
      if (err.name.indexOf('DeviceAlreadyExistsError') >= 0) {
        registry.get(device.deviceId, listenForMessages);
      } else {
        reconnectHubWhenFail(err);
      }
    }
    if (deviceInfo) {
      listenForMessages(err, deviceInfo, res);
    }
  });
}

function listenForMessages(err, deviceInfo, res) {
  if (deviceInfo) {
    const deviceId = deviceInfo.deviceId;
    const deviceKey = deviceInfo.authentication.symmetricKey.primaryKey;

    logger.log('Device ID: ' + deviceId, logger.logType.Info);
    logger.log('Device key: ' + deviceKey, logger.logType.Info);

    const connString = `HostName=eprinter.azure-devices.net;DeviceId=${deviceId};SharedAccessKey=${deviceKey}`;
    client = clientFromConnectionString(connString);
    client.setRetryPolicy(new NoRetry());
    client.open(connectionCallback);
  } else {
    reconnectHubWhenFail(err);
  }
}

const connectionCallback = function (error) {
  if (error) {
    reconnectHubWhenFail(error);
  } else {
    logger.log('Client connected', logger.logType.Info);

    client.on('message', msg => {
      logger.log('Incoming message: ' + JSON.stringify(msg), logger.logType.Info);
      const propertyList = msg.properties.propertyList;
      const printingProperties = {
        copies: 1,
        pdfUrl: '',
        duplex: ''
      };

      storage.put('printingJobId', msg.printingJobId);

      // tslint:disable-next-line:forin
      for (const item in propertyList) {
        const value = propertyList[item].value;
        switch (propertyList[item].key) {
          case 'pdfUrl':
            printingProperties.pdfUrl = value;
            break;
          case 'copies':
            printingProperties.copies = value;
            break;
          case 'duplex':
            printingProperties.duplex = value;
            break;
        }
      }
      printFile(printingProperties);
    });

    client.on('error', function (err) {
      reconnectHubWhenFail(err, true);
    });

    client.on('disconnect', function (err) {
      reconnectHubWhenFail(err, true);
    });

    client.on('close', function (err) {
      reconnectHubWhenFail(err, true);
    });

    client.on('offline', function (err) {
      reconnectHubWhenFail(err, true);
    });
  }
};

function printFile(options) {
  if (util.isMac() && !fs.existsSync('/Applications/eprinter.app')) {
    logger.log('App is uninstalled already.', logger.logType.Error);
    return;
  }
  // create the directory if it does not exist
  const directoryPath = util.getFilename('');
  mkdirp(directoryPath, function (err) {

    if (err) {
      logger.log(err, logger.logType.Error);
    } else {

      logger.log('Printing file options: ' + JSON.stringify(options), logger.logType.Info);
      options.printer = storage.get('printer');
      logger.log('Printer Name: ' + options.printer, logger.logType.Info);
      const filePath = util.getFilename('file.pdf');
      logger.log('File Path: ' + filePath, logger.logType.Info);

      const file = fs.createWriteStream(filePath);
      const request = https.get(options.pdfUrl, function (response) {
        logger.log('Getting file from: ' + options.pdfUrl, logger.logType.Info);
        response.pipe(file);
      });
      request.on('error', function (innerErr) {
        logger.log(innerErr, logger.logType.Error);
      });

      try {

        const filesInDirectory = fs.readdirSync(directoryPath);

        if (filesInDirectory.length >= Config.maximumFilesInPrintDirectory) {
          // delete the files
          filesInDirectory.forEach(function (fileName) {

            fs.unlinkSync(util.getFilename(fileName));
          });
        }

        file.on('finish', function () {
          const printingJobStatus = new PrintingJobStatus();
          logger.log('File downloaded, sending to print.', logger.logType.Info);
          const cmd = util.getPrintingCommand(options);
          logger.log('Printing command: ' + cmd, logger.logType.Info);
          exec(cmd, function (error, stdout, stderr) {
            logger.log('Error is: ' + error, logger.logType.Error);
            logger.log('Output is: ' + stdout, logger.logType.Info);
            if (error) {
              printingJobStatus.statusType = StatusType.failed;
              printingJobStatus.statusCode = error.message;
            } else {
              printingJobStatus.statusType = StatusType.success;
            }
            updatePrintingJobStatus(printingJobStatus)
            try {
              // instead of deleting the file, rename it
              fs.renameSync(filePath, util.getFilename(`file-${(new Date()).valueOf()}-${filesInDirectory.length.toString()}-.pdf`))
            } catch (err) {
              logger.log(err, logger.logType.Error);
            }
          });
        });
      } catch (e) {
        logger.log(e, logger.logType.Error);
      }
    }

  });

  function updatePrintingJobStatus(printingJobStatus) {

    const printingJobStatusService = new PrintingJobStatusService(storage);
    printingJobStatus.uuid = storage.get('printingJobId');
    printingJobStatusService.updateInstallationStatus(printingJobStatus).then(function () {
      logger.log('File has been printed successful, sending to azure function.', logger.logType.Info);
    });
  }
}
