import { Component, Input } from '@angular/core';

@Component({
    selector: 'finish-print-setup',
    templateUrl: './finish-setup.component.html'
})
export class FinishSetupComponent {
    
    @Input()
    public printer: string;

    @Input()
    public email: string;
}
