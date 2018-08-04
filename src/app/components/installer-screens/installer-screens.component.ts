import { Component, ElementRef } from '@angular/core';
import { PrinterChooserComponent } from './printer-chooser/printer-chooser.component';
import { PrintIntroductionComponent } from './print-introduction/print-introduction.component';
import { ViewChild } from '@angular/core';
import { UserDetailService } from '@apiservice/userDetails.service';
import { LocalStorageService } from '../../services/storage.service';
import { AuthService } from '@apiservice/auth.service';
import { IStorage } from '@apiservice/storage.interface';

@Component({
  selector: 'app-installer-screens',
  templateUrl: './installer-screens.component.html',
  styleUrls: ['./installer-screens.component.scss']
})
export class InstallerScreensComponent {

  public error: string = null;
  public loading = false;
  public loadingText = '';
  private storageService: IStorage;
  private authService: AuthService;

  @ViewChild(PrinterChooserComponent) printChooser: PrinterChooserComponent;
  @ViewChild(PrintIntroductionComponent) printIntroduction: PrintIntroductionComponent;

  constructor(private elm: ElementRef, private _userService: UserDetailService) {
    this._userService = new UserDetailService();
    this.getUserDetails();
    this.storageService = new LocalStorageService();
    this.authService = new AuthService(this.storageService);
  }

  install = () => {

    this.storageService.put('printer', this.printChooser.selectedPrinter.name);
    this.startLoader('Installing...');
    const that = this;
    return new Promise((resolve) => {
      window['printer'].install(this.printChooser.email, this.printChooser.selectedPrinter.name, this.authService.getToken(), function () {

        that.storageService.put('email', that.printChooser.username);
        that.storageService.put('installed', 'true');
        resolve();
        that.stopLoader();
        that.error = null;
      }, function (err) {
        that.error = err;
        that.stopLoader();
        setTimeout(() => {
          const errorText = document.getElementsByClassName('err-desc')[0].textContent;
          window['log'].error(errorText);
        }, 2000);
      });

    });
  }

  finish = () => {
    window['appSettings'].closeApp();
  }

  getUserDetails = () => {
    const self = this;

    self.startLoader('Loading...');
    console.info('user details requested');
    self._userService.getUserDetailsForInstaller().then(function (data) {
      const email = data.EprinterEmailAddress;
      self.storageService.put('uuid', data.uuid);
      self.authService.setToken(data.Token);

      self.printChooser.username = email;
      self.error = null;
      self.stopLoader();
    }).catch(function (err) {
      self.error = 'installation token expired, please download again';
      self.stopLoader();
      setTimeout((error) => {
        const errorText = document.getElementsByClassName('err-desc')[0].textContent;
        window['log'].error(errorText);
      }, 2000);
    });

  }

  public startLoader(loadingMessage: string): void {
    this.loadingText = loadingMessage;
    this.loading = true;
  }

  public stopLoader(): void {
    this.loading = false;
  }
}
