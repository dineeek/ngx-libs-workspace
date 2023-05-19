import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { NgxPassCodeModule } from 'ngx-pass-code'

import { AppComponent } from './app.component'

import { AppRoutingModule } from './app-routing.module'
import { PassCodeDemoComponent } from './demos/pass-code/pass-code.component'

@NgModule({
  declarations: [AppComponent, PassCodeDemoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxPassCodeModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
