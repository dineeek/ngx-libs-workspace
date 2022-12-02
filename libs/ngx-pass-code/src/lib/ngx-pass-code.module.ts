import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassCodeComponent } from './component/pass-code.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusNextPreviousInputDirective } from './directives/focus-next-previous-input.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [PassCodeComponent, FocusNextPreviousInputDirective],
  exports: [PassCodeComponent],
})
export class NgxPassCodeModule {}
