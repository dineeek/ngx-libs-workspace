import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { disabled, form, pattern, required } from '@angular/forms/signals'

@Component({
  selector: 'ngx-libs-workspace-pass-code-demo',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PassCodeDemoComponent {
  protected readonly textValue = signal<string | number | null>('76')
  protected readonly textDisabled = signal(false)
  protected readonly textForm = form<string | number | null>(
    this.textValue,
    p => {
      required(p)
      pattern(p as never, /^[A-Z0-9]{5}$/)
      disabled(p, () => this.textDisabled())
    }
  )

  protected readonly numberValue = signal<string | number | null>(null)
  protected readonly numberDisabled = signal(false)
  protected readonly numberForm = form<string | number | null>(
    this.numberValue,
    p => {
      required(p)
      disabled(p, () => this.numberDisabled())
    }
  )

  protected readonly passwordValue = signal<string | number | null>('mypass1')
  protected readonly passwordDisabled = signal(false)
  protected readonly passwordForm = form<string | number | null>(
    this.passwordValue,
    p => {
      required(p)
      disabled(p, () => this.passwordDisabled())
    }
  )

  protected resetText(): void {
    this.textValue.set(null)
    this.textDisabled.set(false)
  }

  protected patchText(): void {
    this.textValue.set('ACAB7')
  }

  protected resetNumber(): void {
    this.numberValue.set(null)
    this.numberDisabled.set(false)
  }

  protected patchNumber(): void {
    this.numberValue.set(216582)
  }

  protected resetPassword(): void {
    this.passwordValue.set(null)
    this.passwordDisabled.set(false)
  }

  protected patchPassword(): void {
    this.passwordValue.set('my')
  }
}
