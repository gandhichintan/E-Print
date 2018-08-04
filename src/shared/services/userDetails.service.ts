import { ApiService } from './api.service';
import { StatusType } from '../enums';


export class UserDetailService {

  private _apiService: ApiService;

  constructor() {
    this._apiService = new ApiService();
  }

  getUserDetailsForInstaller(): Promise<any> {

    return this._apiService.get('GetUserDetailsForInstaller');
  }
}
