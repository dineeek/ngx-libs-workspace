import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassCodeContainerComponent } from './component/pass-code-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusNextPreviousInputDirective } from './directives/focus-next-previous-input.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [PassCodeContainerComponent, FocusNextPreviousInputDirective],
  exports: [PassCodeContainerComponent],
})
export class NgxPassCodeModule {}
