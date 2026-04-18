import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  disabled,
  form,
  pattern,
  required,
  validate,
  ValidationError
} from '@angular/forms/signals'

type PassCodeValue = string | number | null

function hasExactLength(value: PassCodeValue, expected: number): boolean {
  return value != null && String(value).length === expected
}

function incompleteIf(
  value: PassCodeValue,
  expected: number
): ValidationError.WithoutFieldTree | null {
  if (value == null) return null
  return hasExactLength(value, expected)
    ? null
    : ({ kind: 'incomplete' } as ValidationError.WithoutFieldTree)
}

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
    required(p)
    pattern(p as never, /^[A-Z0-9]{5}$/)
    validate(p, ({ value }) => incompleteIf(value(), 5))
    disabled(p, () => this.textDisabled())
  })

  protected readonly numberValue = signal<PassCodeValue>(null)
  protected readonly numberDisabled = signal(false)
  protected readonly numberForm = form<PassCodeValue>(this.numberValue, p => {
    required(p)
    validate(p, ({ value }) => incompleteIf(value(), 5))
    disabled(p, () => this.numberDisabled())
  })

  protected readonly passwordValue = signal<PassCodeValue>('mypass1')
  protected readonly passwordDisabled = signal(false)
  protected readonly passwordForm = form<PassCodeValue>(
    this.passwordValue,
    p => {
      required(p)
      validate(p, ({ value }) => incompleteIf(value(), 7))
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
  required(p)
  pattern(p as never, /^[A-Z0-9]{5}$/)
  validate(p, ({ value }) =>
    value() != null && String(value()).length === 5
      ? null
      : { kind: 'incomplete' })
})

// template
// <ngx-pass-code
//   [formField]="field"
//   type="text"
//   [length]="5"
//   [uppercase]="true"
//   [autofocus]="true"
// />`

  protected readonly numberSnippet = `readonly value = signal<string | number | null>(null)
readonly field = form(this.value, p => {
  required(p)
  validate(p, ({ value }) =>
    value() != null && String(value()).length === 5
      ? null
      : { kind: 'incomplete' })
})

// template
// <ngx-pass-code
//   [formField]="field"
//   type="number"
//   [length]="5"
//   [autoblur]="true"
// />`

  protected readonly passwordSnippet = `readonly value = signal<string | number | null>(null)
readonly field = form(this.value, p => {
  required(p)
  validate(p, ({ value }) =>
    value() != null && String(value()).length === 7
      ? null
      : { kind: 'incomplete' })
})

// template
// <ngx-pass-code
//   [formField]="field"
//   type="password"
//   [length]="7"
// />`

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
