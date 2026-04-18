import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model
} from '@angular/core'
import { FormValueControl, ValidationError } from '@angular/forms/signals'

import { AutofocusFirstInputDirective } from '../directives/autofocus-first-input.directive'
import { FocusNextPreviousInputDirective } from '../directives/focus-next-previous-input.directive'
import { TransformInputValueDirective } from '../directives/transform-uppercase.directive'

type PassCodeType = 'text' | 'number' | 'password'
type PassCodeValue = string | number | null

@Component({
  selector: 'ngx-pass-code',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AutofocusFirstInputDirective,
    FocusNextPreviousInputDirective,
    TransformInputValueDirective
  ]
})
export class PassCodeComponent implements FormValueControl<PassCodeValue> {
  readonly length = input.required<number>()
  readonly type = input<PassCodeType>('text')
  readonly uppercase = input(false)
  readonly autofocus = input(false)
  readonly autoblur = input(false)

  readonly value = model<PassCodeValue>(null)
  readonly disabled = input(false)
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([])
  readonly touched = model(false)

  protected readonly slotIndices = computed<number[]>(() =>
    Array.from({ length: this.length() }, (_, i) => i)
  )

  protected readonly slots = computed<string[]>(() => {
    const n = this.length()
    const raw = this.value()
    const str = raw == null ? '' : String(raw)
    const chars = str.slice(0, n).split('')
    while (chars.length < n) {
      chars.push('')
    }
    return this.uppercase() ? chars.map(c => c.toUpperCase()) : chars
  })

  protected readonly isInvalid = computed(
    () => this.touched() && this.errors().length > 0
  )

  protected onSlotInput(index: number, event: Event): void {
    const el = event.target as HTMLInputElement
    const current = this.slots().slice()
    current[index] = el.value
    const combined = current.join('')

    if (combined === '') {
      this.value.set(null)
      return
    }

    if (this.type() === 'number') {
      const parsed = Number(combined)
      this.value.set(Number.isNaN(parsed) ? null : parsed)
      return
    }

    this.value.set(this.uppercase() ? combined.toUpperCase() : combined)
  }

  protected onSlotBlur(): void {
    this.touched.set(true)
  }
}
