import {Component, Input} from '@angular/core';

@Component({
    selector: 'print-confirmation',
    templateUrl: './print-confirmation.component.html',
    styles: [
      `	.error {
        color: red;
      }, .err-desc { font-size: 11px; }`
    ]
})
export class ConfirmationComponent {

  @Input()
  public error: string;

  public expanded: boolean = false;
}
