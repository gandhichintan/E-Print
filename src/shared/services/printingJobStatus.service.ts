import { ApiService } from './api.service';
import { StatusType } from '../enums';
import { IStorage } from './storage.interface';

export class PrintingJobStatus {
  uuid: string;
  statusType: StatusType;
  statusCode: string;
}

export class PrintingJobStatusService {

  private _apiService: ApiService;

  constructor(storage: IStorage) {
    this._apiService = new ApiService(storage);
  }

  updateInstallationStatus(obj): Promise<PrintingJobStatus> {

    return this._apiService.post<PrintingJobStatus>('UpdatePrintingJobStatus', obj);
  }
}
