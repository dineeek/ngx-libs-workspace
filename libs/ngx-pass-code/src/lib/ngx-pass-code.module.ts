import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassCodeContainerComponent } from './container/pass-code-container.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [PassCodeContainerComponent],
  exports: [PassCodeContainerComponent],
})
export class NgxPassCodeModule {}
