import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PassCodeComponent } from './component/pass-code.component';
import { AutofocusFirstInputDirective } from './directives/autofocus-first-input.directive';
import { FocusNextPreviousInputDirective } from './directives/focus-next-previous-input.directive';
import { TransformInputValueDirective } from './directives/transform-uppercase.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    PassCodeComponent,
    FocusNextPreviousInputDirective,
    TransformInputValueDirective,
    AutofocusFirstInputDirective,
  ],
  exports: [PassCodeComponent],
})
export class NgxPassCodeModule {}
