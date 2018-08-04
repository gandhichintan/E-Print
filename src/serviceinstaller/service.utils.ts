import * as Os from 'os';
import * as Path from 'path';
import { Logger } from './service.logger';
import { Config } from './service.config';

export class ServiceUtils {

  logger = new Logger();
  config = new Config();

  constructor() {
    if (this.isMac()) {
      process.env.XDG_CONFIG_HOME = '/etc';
    } else if (this.isWindows()) {
      process.env.XDG_CONFIG_HOME = 'C:\\Windows';
    }

  }

  public platform = () => { return Os.platform(); }

  public isWindows = () => {
    return this.platform() === 'win32';
  }

  public isMac = () => {
    return this.platform() === 'darwin';
  }

  public getPrintingCommand = (options) => {
    const fileName = this.getFilename('file.pdf');
    if (this.isMac()) {
      return `lp -n ${options.copies} -d ${options.printer} -o fit-to-page -o media="${this.getPaperSize()}" "${fileName}"`;
    } else if (this.isWindows()) {
      // tslint:disable-next-line:max-line-length
      return `${Path.join(__dirname, 'gswin64c.exe')} -dPrinted -dBATCH -dNOPAUSE -dNOSAFER -q -dNumCopies=${options.copies} -sDEVICE=mswinpr2 -sOutputFile="%printer%${options.printer}" -sPAPERSIZE="${this.getPaperSize()}" -dFIXEDMEDIA -dEPSFitPage "${fileName}"`;
    }
  }

  getPaperSize = () => {
    return this.isMac() ? 'A4' : 'a4';
  }

  getStorageModule = (): string => {
    let storage = '';
    if (this.isMac()) {
      storage = 'configstore';
    } else if (this.isWindows()) {
      storage = 'node-storage';
    }
    return storage;
  }

  getFilename = (name) => {
    return Path.join(__dirname, 'temp', name);
  }
}

