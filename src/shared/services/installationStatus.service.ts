import { ApiService } from './api.service';
import { StatusType } from '../enums';
import { IStorage } from './storage.interface';

interface IinstallationStatus {
  guid: string;
  status: StatusType;
}

export class InstallationStatus implements IinstallationStatus {
  guid: string;
  status: StatusType;
}

export class InstallationStatusService {

  private _apiService: ApiService;

  constructor(storage: IStorage) {
    this._apiService = new ApiService(storage);
  }

  getGuidForInstallation(): Promise<string> {
    return this._apiService.get<string>('getGuidForInstallation');
  }

  updateInstallationStatus(obj): Promise<IinstallationStatus> {

    return this._apiService.post<IinstallationStatus>('UpdateInstallationDone', obj);
  }

  updateUninstallDone(obj): Promise<IinstallationStatus> {
    return this._apiService.post<IinstallationStatus>('updateUninstallDone', obj);
  }
}
