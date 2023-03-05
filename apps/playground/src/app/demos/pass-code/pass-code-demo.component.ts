import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'ngx-libs-workspace-pass-code-demo',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassCodeDemoComponent {
  form = new FormGroup({
    textCode: new FormControl('76', { validators: [Validators.required] }),
    numberCode: new FormControl(''),
    passwordCode: new FormControl('mypass1')
  })

  textCode = this.form.get('textCode') as FormControl
  numberCode = this.form.get('numberCode') as FormControl
  passwordCode = this.form.get('passwordCode') as FormControl
}
