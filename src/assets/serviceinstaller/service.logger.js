"use strinct";
"use strict";
exports.__esModule = true;
var Path = require("path");
var Moment = require("moment");
var service_config_1 = require("./service.config");
var Winston = require("winston");
require('winston-logrotate');
var LogType;
(function (LogType) {
    LogType[LogType["Error"] = 1] = "Error";
    LogType[LogType["Info"] = 2] = "Info";
})(LogType || (LogType = {}));
;
var Logger = (function () {
    function Logger() {
        var _this = this;
        this.logDirectory = 'logs';
        this.logType = LogType;
        this.log = function (message, logType) {
            var errorLogger = _this.getRotatingLogger(LogType.Error), infoLogger = _this.getRotatingLogger(LogType.Info);
            switch (logType) {
                case LogType.Error:
                    errorLogger.error(message);
                    break;
                case LogType.Info:
                    infoLogger.info(message);
                    break;
                default:
                    infoLogger.info(message);
            }
        };
        this.getRotatingLogTransport = function (type) {
            var base = {
                colorize: false,
                timestamp: function () {
                    return Moment(new Date()).format(service_config_1.Config.defaultDateFormat);
                },
                json: false,
                size: service_config_1.Config.logFileMaxSize,
                keep: service_config_1.Config.logFileMaxCount,
                compress: true
            };
            switch (type) {
                case LogType.Info:
                    return new Winston.transports.Rotate(Object.assign({}, base, {
                        file: Path.join(__dirname, _this.logDirectory, service_config_1.Config.infoLogFileName)
                    }));
                case LogType.Error:
                    return new Winston.transports.Rotate(Object.assign({}, base, {
                        file: Path.join(__dirname, _this.logDirectory, service_config_1.Config.errorLogFileName)
                    }));
            }
        };
        this.getRotatingLogger = function (type) {
            switch (type) {
                case LogType.Info:
                    return new (Winston.Logger)({
                        transports: [
                            _this.getRotatingLogTransport(LogType.Info)
                        ]
                    });
                case LogType.Error:
                    return new (Winston.Logger)({
                        transports: [
                            _this.getRotatingLogTransport(LogType.Error)
                        ]
                    });
            }
        };
    }
    return Logger;
}());
exports.Logger = Logger;
