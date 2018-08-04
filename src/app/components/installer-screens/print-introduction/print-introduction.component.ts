import { Component, Input } from '@angular/core';

@Component({
  selector: 'print-introduction',
  templateUrl: './print-introduction.component.html',
  styles: [
    `	.error {
        color: red;
      }, .err-desc { font-size: 11px; }`
  ]
})
export class PrintIntroductionComponent {

  @Input()
  public error: string;
  public expanded = false;
  public showProcessIndicator = false;
}
