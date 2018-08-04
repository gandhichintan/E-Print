
import { ServiceUtils } from './service.utils';
import { StorageUtils } from './storage.utils';
import { app, crashReporter } from 'electron';
import { Logger } from './service.logger';
import { InstallationStatus, InstallationStatusService } from '../shared/services/installationStatus.service';
import { StatusType } from '../shared/enums';
import { AuthService } from '../shared/services/auth.service';

const service_name = 'ePrintNode',
  util = new ServiceUtils(),
  logger = new Logger(),
  platform = util.platform();

const getScriptName = () => {
  return 'printservice.js';
}

const getPlatformService = () => {
  switch (platform) {
    case 'linux':
      return require('node-linux').Service;
    case 'darwin':
      return require('node-mac').Service;
    case 'win32':
      return require('node-windows').Service;
  }
}


const script_name = getScriptName();
const platform_service = getPlatformService();
const storage = new StorageUtils();
const authService = new AuthService(storage);

const svc = new platform_service({
  name: service_name,
  description: 'ePrinter IoT to printer service',
  script: require('path').join(__dirname, script_name),
  maxRestarts: 1
});

if (util.isWindows()) {
  svc.logOnAs.domain = 'NT AUTHORITY';
  svc.logOnAs.account = 'NetworkService';
  svc.logOnAs.allowservicelogon = 'true';
  svc.logOnAs.password = '';
}

svc.on('install', function () {
  logger.log('Service has been installed, attempting to start it.', logger.logType.Info);
  updateInstallationStatus();
  startService();
});

function startService() {
  try {
    svc.start();
  } catch (e) {
    logger.log(`Service failed to start. error: ${e}`, logger.logType.Error);
    app.quit();
  }
}

svc.on('alreadyinstalled', function () {
  logger.log('Service is already installed, attempting to uninstall, install and start it.', logger.logType.Info);
  svc.uninstall(function () {
    logger.log('Service was installed and uninstalled successfully, now installing it again', logger.logType.Info);
    svc.install();
  });
});

svc.on('invalidinstallation', function () {
  logger.log('Service installation is invalid.', logger.logType.Info);
  app.quit();
});

svc.on('uninstall', function () {
  updateUnInstallationStatus();
  logger.log('Service has been uninstalled.', logger.logType.Info);
});

svc.on('start', function () {
  logger.log('Service has been started.', logger.logType.Info);
  app.quit();
});

svc.on('error', function (error) {
  logger.log('Error found...', logger.logType.Info);
  if (error) {
    logger.log(error, logger.logType.Error);
  }
  app.quit();
});

function updateInstallationStatus() {
  const installationStatus = new InstallationStatus();
  const installationStatusService = new InstallationStatusService(storage);
  installationStatus.guid = storage.get('uuid');
  installationStatus.status = StatusType.success

  installationStatusService.updateInstallationStatus(installationStatus).then(function () {
    logger.log('Installation Status updated on azure function', logger.logType.Info);
  });
}

function updateUnInstallationStatus() {
  const uninstallRequest = {
    'eprinterEmailAddress': storage.get('email')
  };
  const installationStatusService = new InstallationStatusService(storage);
  installationStatusService.updateUninstallDone(uninstallRequest).then(function () {
    logger.log('UnInstallation Status updated on azure function', logger.logType.Info);

  });
}

function setupCrashReporter() {
  crashReporter.start({
    productName: 'ePrinterServiceInstaller',
    companyName: 'ePrinterServiceInstaller',
    submitURL: 'https://eprintercrash.localtunnel.me',
    uploadToServer: true
  });
}

app.on('ready', function () {

  setupCrashReporter();

  const option = process.argv[2];

  switch (option) {
    case 'install':
      const selectedPrinter = process.argv[3];
      const email = process.argv[4];
      const token = process.argv[5];
      storage.put('email', email);
      storage.put('printer', selectedPrinter);
      authService.setToken(token);
      try {
        logger.log(`About to install service using printer: ${selectedPrinter} email: ${email}...`, logger.logType.Info);
        svc.install();
      } catch (e) {
        logger.log(e, logger.logType.Error);
        app.quit();
      }

      break;
    case 'uninstall':
      svc.uninstall();
      break;
  }
});

(process as NodeJS.EventEmitter).on('uncaughtException', function (err) {
  logger.log('Application almost crashed! Error:' + err, logger.logType.Error);
  app.quit();
});



