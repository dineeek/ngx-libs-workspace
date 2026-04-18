import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  signal,
  untracked
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

  private readonly slotsState = signal<string[]>([])
  protected readonly slots = this.slotsState.asReadonly()

  protected readonly isInvalid = computed(
    () => this.touched() && this.errors().length > 0
  )

  // Tracks the last value this component emitted, so the resync effect can
  // tell an external write (reset / patch) apart from a write we just made.
  private lastEmitted: PassCodeValue = null

  constructor() {
    effect(() => {
      const n = this.length()
      const raw = this.value()

      untracked(() => {
        const current = this.slotsState()
        if (raw === this.lastEmitted && current.length === n) {
          return
        }

        const str = raw == null ? '' : String(raw)
        const chars = str.slice(0, n).split('')
        while (chars.length < n) {
          chars.push('')
        }
        const transformed = this.uppercase()
          ? chars.map(c => c.toUpperCase())
          : chars
        this.slotsState.set(transformed)
        this.lastEmitted = raw
      })
    })
  }

  protected onSlotInput(index: number, event: Event): void {
    const el = event.target as HTMLInputElement
    const ch = this.uppercase() ? el.value.toUpperCase() : el.value

    const n = this.length()
    const next = this.slotsState().slice(0, n)
    while (next.length < n) {
      next.push('')
    }
    next[index] = ch
    this.slotsState.set(next)

    const combined = next.join('')
    let newValue: PassCodeValue
    if (combined === '') {
      newValue = null
    } else if (this.type() === 'number') {
      const parsed = Number(combined)
      newValue = Number.isNaN(parsed) ? null : parsed
    } else {
      newValue = combined
    }

    this.lastEmitted = newValue
    this.value.set(newValue)
  }

  protected onSlotBlur(): void {
    this.touched.set(true)
  }
}
