import { Logger } from './service.logger';
import { Config } from './service.config';
import { ServiceUtils } from './service.utils';

const utils = new ServiceUtils();
let Storage;
if (utils.isWindows()) {
  Storage = require('node-storage');
} else if (utils.isMac()) {
  Storage = require('configstore');
}

export class StorageUtils {
  storage: any;

  constructor() {
    this.storage = new Storage('eprinter.json');
  }

  get = (key: string) => {
    return this.storage.get(key);
  }

  put = (key: string, value: any) => {
    const self = this;
    if (utils.isMac()) {
      self.storage.set(key, value);
    } else {
      self.storage.put(key, value);
    }
  }
}
