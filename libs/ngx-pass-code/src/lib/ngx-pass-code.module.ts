import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassCodeComponent } from './component/pass-code.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusNextPreviousInputDirective } from './directives/focus-next-previous-input.directive';
import { TransformUppercaseDirective } from './directives/transform-uppercase.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    PassCodeComponent,
    FocusNextPreviousInputDirective,
    TransformUppercaseDirective,
  ],
  exports: [PassCodeComponent],
})
export class NgxPassCodeModule {}
