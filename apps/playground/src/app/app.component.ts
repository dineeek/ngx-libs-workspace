import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-libs-workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'playground';

  passCode = new FormControl('54321', { validators: [Validators.required] });
  passCode2 = new FormControl('');

  constructor() {
    this.passCode.valueChanges.subscribe(v => console.log('PARENT VALUE', v));
  }
}
