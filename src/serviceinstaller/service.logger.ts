import * as Path from 'path';
import * as Moment from 'moment';
import { Config } from './service.config';
const Winston = require('winston');
require('winston-logrotate');

enum LogType {
  Error = 1,
  Info = 2
};

export class Logger {

  logDirectory = 'logs';

  logType = LogType;

  constructor() { }

  public log = (message, logType) => {
    const errorLogger = this.getRotatingLogger(LogType.Error),
      infoLogger = this.getRotatingLogger(LogType.Info);

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

    console.log(message);
  }

  private getRotatingLogTransport = (type) => {

    const base = {
      colorize: false,
      timestamp: function () {
        return Moment(new Date()).format(Config.defaultDateFormat);
      },
      json: false,
      size: Config.logFileMaxSize,
      keep: Config.logFileMaxCount,
      compress: true
    };

    switch (type) {

      case LogType.Info:

        return new Winston.transports.Rotate(Object.assign({}, base, {
          file: Path.join(__dirname, this.logDirectory, Config.infoLogFileName)
        }));

      case LogType.Error:

        return new Winston.transports.Rotate(Object.assign({}, base, {
          file: Path.join(__dirname, this.logDirectory, Config.errorLogFileName)
        }));
    }
  }

  private getRotatingLogger = (type) => {

    switch (type) {

      case LogType.Info:

        return new (Winston.Logger)({
          transports: [
            this.getRotatingLogTransport(LogType.Info)
          ]
        });

      case LogType.Error:

        return new (Winston.Logger)({
          transports: [
            this.getRotatingLogTransport(LogType.Error)
          ]
        });
    }
  }
}
