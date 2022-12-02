import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPassCodeModule } from 'ngx-pass-code';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, ReactiveFormsModule, NgxPassCodeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
