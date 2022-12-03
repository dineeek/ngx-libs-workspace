import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-libs-workspace-pass-code-demo',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCodeDemoComponent {
  passCode = new FormControl('541', { validators: [Validators.required] });
  passCode2 = new FormControl('');
  passCode3 = new FormControl('as');

  constructor() {
    this.passCode.valueChanges.subscribe(v => console.log('PASS CODE 1', v));
    this.passCode2.valueChanges.subscribe(v => console.log('PASS CODE 2', v));
    this.passCode3.valueChanges.subscribe(v => console.log('PASS CODE 3', v));
  }
}
