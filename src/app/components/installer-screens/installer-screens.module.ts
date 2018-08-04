import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstallerScreensComponent } from './installer-screens.component';
import { PrinterChooserComponent } from './printer-chooser/printer-chooser.component';
import { ComponentsModule } from 'ui-lib';
import { FormsModule } from '@angular/forms';
import { PrintIntroductionComponent } from './print-introduction/print-introduction.component';
import { ConfirmationComponent } from './print-confirmation/print-confirmation.component';
import { FinishSetupComponent } from './finish-setup/finish-setup.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule
  ],
  declarations: [
    PrintIntroductionComponent,
    InstallerScreensComponent,
    PrinterChooserComponent,
    ConfirmationComponent,
    FinishSetupComponent
  ],
  exports: [
    PrintIntroductionComponent,
    InstallerScreensComponent,
    ConfirmationComponent,
    FinishSetupComponent
  ]
})
export class InstallerScreensModule { }
