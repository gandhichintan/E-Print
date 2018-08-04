"use strict";
exports.__esModule = true;
var Os = require("os");
var Path = require("path");
var service_logger_1 = require("./service.logger");
var service_config_1 = require("./service.config");
var ServiceUtils = (function () {
    function ServiceUtils() {
        var _this = this;
        this.logger = new service_logger_1.Logger();
        this.config = new service_config_1.Config();
        this.platform = function () { return Os.platform(); };
        this.isWindows = function () {
            return _this.platform() === 'win32';
        };
        this.isMac = function () {
            return _this.platform() === 'darwin';
        };
        this.getPrintingCommand = function (options) {
            var fileName = _this.getFilename('file.pdf');
            if (_this.isMac()) {
                return "lp -n " + options.copies + " -d " + options.printer + " -o fit-to-page -o media=\"" + _this.getPaperSize() + "\" \"" + fileName + "\"";
            }
            else if (_this.isWindows()) {
                return Path.join(__dirname, 'gswin64c.exe') + " -dPrinted -dBATCH -dNOPAUSE -dNOSAFER -q -dNumCopies=" + options.copies + " -sDEVICE=mswinpr2 -sOutputFile=\"%printer%" + options.printer + "\" -sPAPERSIZE=\"" + _this.getPaperSize() + "\" -dFIXEDMEDIA -dEPSFitPage \"" + fileName + "\"";
            }
        };
        this.getPaperSize = function () {
            return 'a4';
        };
        this.getStorageModule = function () {
            var storage = '';
            if (_this.isMac()) {
                storage = 'configstore';
            }
            else if (_this.isWindows()) {
                storage = 'node-storage';
            }
            return storage;
        };
        this.getFilename = function (name) {
            return Path.join(__dirname, 'temp', name);
        };
        if (this.isMac()) {
            process.env.XDG_CONFIG_HOME = '/etc';
        }
        else if (this.isWindows()) {
            process.env.XDG_CONFIG_HOME = 'C:\\Windows';
        }
    }
    return ServiceUtils;
}());
exports.ServiceUtils = ServiceUtils;
