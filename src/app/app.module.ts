import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { InstallerScreensModule } from './components/installer-screens/installer-screens.module';
import { HttpModule } from '@angular/http';
import { UserDetailService } from '@apiservice/userDetails.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    InstallerScreensModule,
    HttpModule
  ],
  providers: [
    UserDetailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
