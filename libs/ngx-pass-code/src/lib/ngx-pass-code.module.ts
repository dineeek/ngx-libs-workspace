import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassCodeContainerComponent } from './component/pass-code-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusNextInputDirective } from './directives/focus-next-input.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [PassCodeContainerComponent, FocusNextInputDirective],
  exports: [PassCodeContainerComponent],
})
export class NgxPassCodeModule {}
