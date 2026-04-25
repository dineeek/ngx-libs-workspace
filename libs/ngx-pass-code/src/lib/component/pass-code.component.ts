import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
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
type PassCodeInputMode =
  | 'text'
  | 'numeric'
  | 'decimal'
  | 'tel'
  | 'search'
  | 'email'
  | 'url'
  | 'none'
  | ''

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
  readonly autocomplete = input<string>('')
  readonly inputmode = input<PassCodeInputMode>('')

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

  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef)

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

  protected onSlotPaste(event: ClipboardEvent): void {
    const clipboard = event.clipboardData?.getData('text') ?? ''
    if (clipboard.length === 0) {
      return
    }
    event.preventDefault()

    const type = this.type()
    let sanitized: string
    if (type === 'number') {
      sanitized = clipboard.replace(/\D/g, '')
    } else if (type === 'password') {
      sanitized = clipboard.replace(/\s+/g, '')
    } else {
      sanitized = clipboard.replace(/[\s\-_]+/g, '')
    }
    if (this.uppercase()) {
      sanitized = sanitized.toUpperCase()
    }

    const n = this.length()
    sanitized = sanitized.slice(0, n)
    if (sanitized.length === 0) {
      return
    }

    const next = new Array<string>(n).fill('')
    for (let i = 0; i < sanitized.length; i++) {
      next[i] = sanitized[i]
    }
    this.slotsState.set(next)

    let newValue: PassCodeValue
    if (type === 'number') {
      const parsed = Number(sanitized)
      newValue = Number.isNaN(parsed) ? null : parsed
    } else {
      newValue = sanitized
    }
    this.lastEmitted = newValue
    this.value.set(newValue)

    queueMicrotask(() => {
      const inputs = Array.from(
        this.hostEl.nativeElement.querySelectorAll<HTMLInputElement>('input')
      )
      if (inputs.length === 0) return
      if (sanitized.length < n) {
        inputs[sanitized.length]?.focus()
      } else if (this.autoblur()) {
        inputs[n - 1]?.blur()
      } else {
        inputs[n - 1]?.focus()
      }
    })
  }

  protected onSlotBlur(): void {
    this.touched.set(true)
  }
}
