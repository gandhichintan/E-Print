"use strict";
exports.__esModule = true;
var service_utils_1 = require("./service.utils");
var electron_1 = require("electron");
var service_logger_1 = require("./service.logger");
var service_name = "ePrintNode";
var service_name = "ePrintNode", util = new service_utils_1.ServiceUtils(), logger = new service_logger_1.Logger(), platform = util.platform();
var storageModuleName = util.getStorageModule();
var nodeStorage = require("" + storageModuleName);
var getScriptName = function () {
    var script_name = 'printservice.js';
    return script_name;
};
var getPlatformService = function () {
    var platform_service;
    switch (platform) {
        case 'linux':
            platform_service = require('node-linux').Service;
            break;
        case 'darwin':
            platform_service = require('node-mac').Service;
            break;
        case 'win32':
            platform_service = require('node-windows').Service;
            break;
    }
    return platform_service;
};
var script_name = getScriptName();
var platform_service = getPlatformService();
var storage = new nodeStorage('eprinter.json');
var updateStorage = function (email, selectedPrinter) {
    if (util.isMac()) {
        storage.set('printer', selectedPrinter);
        storage.set('email', email);
    }
    else {
        storage.put('printer', selectedPrinter);
        storage.put('email', email);
    }
};
var svc = new platform_service({
    name: service_name,
    description: 'ePrinter IoT to printer service',
    script: require('path').join(__dirname, script_name),
    maxRestarts: 1
});
if (util.isWindows()) {
    svc.logOnAs.domain = "NT AUTHORITY";
    svc.logOnAs.account = "NetworkService";
    svc.logOnAs.allowservicelogon = "true";
    svc.logOnAs.password = "";
}
svc.on('install', function () {
    logger.log('Service has been installed, attempting to start it.', logger.logType.Info);
    svc.start();
});
svc.on('alreadyinstalled', function () {
    logger.log('Service is already installed, attempting to uninstall, install and start it.', logger.logType.Info);
    if (util.isMac()) {
        svc.uninstall(function () {
            logger.log('Service was installed and uninstalled successfully, now installing it again', logger.logType.Info);
            svc.install();
        });
    }
});
svc.on('invalidinstallation', function () {
    logger.log('Service installation is invalid.', logger.logType.Info);
    electron_1.app.quit();
});
svc.on('doesnotexist', function () {
    logger.log('Service is not existing for now.', logger.logType.Info);
});
svc.on('uninstall', function () {
    logger.log('Service has been uninstalled.', logger.logType.Info);
});
svc.on('start', function () {
    logger.log('Service has been started.', logger.logType.Info);
    electron_1.app.quit();
});
svc.on('error', function (error) {
    logger.log('Error found...', logger.logType.Info);
    if (error) {
        logger.log(error, logger.logType.Error);
    }
    electron_1.app.quit();
});
function setupCrashReporter() {
    electron_1.crashReporter.start({
        productName: 'ePrinterServiceInstaller',
        companyName: 'ePrinterServiceInstaller',
        submitURL: 'https://eprintercrash.localtunnel.me',
        uploadToServer: true
    });
}
electron_1.app.on('ready', function () {
    setupCrashReporter();
    var option = process.argv[2];
    switch (option) {
        case 'install':
            var selectedPrinter = process.argv[3];
            var email = process.argv[4];
            updateStorage(email, selectedPrinter);
            logger.log('About to install servcie...', logger.logType.Info);
            svc.install();
            break;
        case 'uninstall':
            svc.uninstall();
            break;
    }
});
process.on('uncaughtException', function (err) {
    logger.log('Application almost crashed! Error:' + err, logger.logType.Error);
    electron_1.app.exit(1);
});
