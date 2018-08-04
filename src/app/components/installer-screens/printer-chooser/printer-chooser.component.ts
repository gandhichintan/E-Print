import { Component } from '@angular/core';
import { StorageUtils } from '@serviceutils/storage.utils';

@Component({
  selector: 'app-printer-chooser',
  templateUrl: './printer-chooser.component.html',
  styleUrls: ['./printer-chooser.component.scss']
})
export class PrinterChooserComponent {

  public selectedPrinter: any;
  public username = '';

  get isUserNameValid() {
    return this.username.length > 0;
  }

  get email(): string {
    return this.username;
  };
  public _awake = true;

  public _printers: any[] = [
  ];

  constructor() {
    let id = 0;

    this._printers = window['printer'].getPrinters().filter(name => name && name.length > 0).map(name => {
      return { id: id++, name: name, checked: false }
    });

  }

}
