import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassCodeDemoComponent } from './demos/pass-code/pass-code-demo.component';

const routes: Routes = [
  { path: 'demos/ngx-pass-code', component: PassCodeDemoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
