import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { JsonPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormField } from '@angular/forms/signals'
import { PassCodeComponent } from 'ngx-pass-code'

import { AppComponent } from './app.component'

import { AppRoutingModule } from './app-routing.module'
import { PassCodeDemoComponent } from './demos/pass-code/pass-code.component'
import { TopBarComponent } from './shared/top-bar/top-bar.component'
import { HomeComponent } from './home/home.component'
import { CodeBlockComponent } from './shared/code-block/code-block.component'

@NgModule({
  declarations: [AppComponent, PassCodeDemoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JsonPipe,
    RouterLink,
    FormField,
    PassCodeComponent,
    TopBarComponent,
    HomeComponent,
    CodeBlockComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
