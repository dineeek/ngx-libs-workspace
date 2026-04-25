import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { PassCodeDemoComponent } from './demos/pass-code/pass-code.component'
import { NumericRangeFormFieldDemoComponent } from './demos/numeric-range-form-field/numeric-range-form-field.component'
import { PhoneFormFieldDemoComponent } from './demos/phone-form-field/phone-form-field.component'
import { TimeRangeFormFieldDemoComponent } from './demos/time-range-form-field/time-range-form-field.component'
import { OverflowTooltipDemoComponent } from './demos/overflow-tooltip/overflow-tooltip.component'

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'ngx-pass-code', component: PassCodeDemoComponent },
  {
    path: 'ngx-numeric-range-form-field',
    component: NumericRangeFormFieldDemoComponent
  },
  { path: 'ngx-phone-form-field', component: PhoneFormFieldDemoComponent },
  {
    path: 'ngx-time-range-form-field',
    component: TimeRangeFormFieldDemoComponent
  },
  { path: 'ngx-overflow-tooltip', component: OverflowTooltipDemoComponent },
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
