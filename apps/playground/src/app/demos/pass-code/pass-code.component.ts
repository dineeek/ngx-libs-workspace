import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'ngx-libs-workspace-pass-code-demo',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassCodeDemoComponent {
  protected textCodeControl = new FormControl<string>('76', {
    validators: []
  })
  protected numberCodeControl = new FormControl<number | null>(null, {
    validators: [Validators.required]
  })
  protected passwordCodeControl = new FormControl<string>('mypass1', {
    validators: [Validators.required]
  })
}
