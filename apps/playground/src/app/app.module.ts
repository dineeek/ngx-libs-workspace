import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { JsonPipe } from '@angular/common'
import { FormField } from '@angular/forms/signals'
import { PassCodeComponent } from 'ngx-pass-code'

import { AppComponent } from './app.component'

import { AppRoutingModule } from './app-routing.module'
import { PassCodeDemoComponent } from './demos/pass-code/pass-code.component'

@NgModule({
  declarations: [AppComponent, PassCodeDemoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JsonPipe,
    FormField,
    PassCodeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
