import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassCodeContainerComponent } from './container/pass-code-container.component';
import { CodeInputComponent } from './ui/code-input/code-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [PassCodeContainerComponent, CodeInputComponent],
  exports: [PassCodeContainerComponent],
})
export class NgxPassCodeModule {}
