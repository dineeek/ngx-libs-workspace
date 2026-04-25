import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { JsonPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormField } from '@angular/forms/signals'
import { PassCodeComponent } from 'ngx-pass-code'
import { NumericRangeFormFieldComponent } from 'ngx-numeric-range-form-field'
import { PhoneFormFieldComponent } from 'ngx-phone-form-field'

import { AppComponent } from './app.component'

import { AppRoutingModule } from './app-routing.module'
import { PassCodeDemoComponent } from './demos/pass-code/pass-code.component'
import { NumericRangeFormFieldDemoComponent } from './demos/numeric-range-form-field/numeric-range-form-field.component'
import { PhoneFormFieldDemoComponent } from './demos/phone-form-field/phone-form-field.component'
import { TopBarComponent } from './shared/top-bar/top-bar.component'
import { HomeComponent } from './home/home.component'
import { CodeBlockComponent } from './shared/code-block/code-block.component'

@NgModule({
  declarations: [
    AppComponent,
    PassCodeDemoComponent,
    NumericRangeFormFieldDemoComponent,
    PhoneFormFieldDemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JsonPipe,
    RouterLink,
    FormField,
    PassCodeComponent,
    NumericRangeFormFieldComponent,
    PhoneFormFieldComponent,
    TopBarComponent,
    HomeComponent,
    CodeBlockComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
