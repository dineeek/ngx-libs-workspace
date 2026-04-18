import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { disabled, form, pattern } from '@angular/forms/signals'
import { passCodeComplete } from 'ngx-pass-code'

type PassCodeValue = string | number | null

@Component({
  selector: 'ngx-libs-workspace-pass-code-demo',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PassCodeDemoComponent {
  protected readonly textValue = signal<PassCodeValue>('76')
  protected readonly textDisabled = signal(false)
  protected readonly textForm = form<PassCodeValue>(this.textValue, p => {
    passCodeComplete(p, 5)
    pattern(p as never, /^[A-Z0-9]{5}$/)
    disabled(p, () => this.textDisabled())
  })

  protected readonly numberValue = signal<PassCodeValue>(null)
  protected readonly numberDisabled = signal(false)
  protected readonly numberForm = form<PassCodeValue>(this.numberValue, p => {
    passCodeComplete(p, 5)
    disabled(p, () => this.numberDisabled())
  })

  protected readonly passwordValue = signal<PassCodeValue>('mypass1')
  protected readonly passwordDisabled = signal(false)
  protected readonly passwordForm = form<PassCodeValue>(
    this.passwordValue,
    p => {
      passCodeComplete(p, 7)
      disabled(p, () => this.passwordDisabled())
    }
  )

  protected readonly textBadges = [
    'type=text',
    'length=5',
    'required',
    'pattern',
    'uppercase',
    'autofocus'
  ]

  protected readonly numberBadges = [
    'type=number',
    'length=5',
    'required',
    'autoblur'
  ]

  protected readonly passwordBadges = ['type=password', 'length=7', 'required']

  protected readonly textSnippet = `readonly value = signal<string | number | null>(null)
readonly field = form(this.value, p => {
  passCodeComplete(p, 5)
  pattern(p as never, /^[A-Z0-9]{5}$/)
})

/*
 * template
 * <ngx-pass-code
 *   [formField]="field"
 *   type="text"
 *   [length]="5"
 *   [uppercase]="true"
 *   [autofocus]="true"
 * />
 */`

  protected readonly numberSnippet = `readonly value = signal<string | number | null>(null)
readonly field = form(this.value, p => {
  passCodeComplete(p, 5)
})

/*
 * template
 * <ngx-pass-code
 *   [formField]="field"
 *   type="number"
 *   [length]="5"
 *   [autoblur]="true"
 * />
 */`

  protected readonly passwordSnippet = `readonly value = signal<string | number | null>(null)
readonly field = form(this.value, p => {
  passCodeComplete(p, 7)
})

/*
 * template
 * <ngx-pass-code
 *   [formField]="field"
 *   type="password"
 *   [length]="7"
 * />
 */`

  protected resetText(): void {
    this.textValue.set(null)
    this.textDisabled.set(false)
  }

  protected patchText(): void {
    this.textValue.set('HELLO')
  }

  protected resetNumber(): void {
    this.numberValue.set(null)
    this.numberDisabled.set(false)
  }

  protected patchNumber(): void {
    this.numberValue.set(21658)
  }

  protected resetPassword(): void {
    this.passwordValue.set(null)
    this.passwordDisabled.set(false)
  }

  protected patchPassword(): void {
    this.passwordValue.set('my')
  }
}
