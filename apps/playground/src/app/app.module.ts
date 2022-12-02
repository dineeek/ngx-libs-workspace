import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPassCodeModule } from 'ngx-pass-code';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, NgxPassCodeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
