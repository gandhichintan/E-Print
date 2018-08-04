"use strict";
exports.__esModule = true;
var Config = (function () {
    function Config() {
    }
    Config.intervalMillisecondsToReconnect = 3600000;
    Config.intervalMillisecondsToReConnectWhenFail = 60000;
    Config.maximumFilesInPrintDirectory = 10;
    Config.logRotationPeriod = '7d';
    Config.infoLogFileName = 'info_log.log';
    Config.errorLogFileName = 'error_log.log';
    Config.logFileMaxCount = 3;
    Config.logFileMaxSize = '100m';
    Config.defaultDateFormat = 'DD/MM/YYYY HH:mm:ss';
    return Config;
}());
exports.Config = Config;
