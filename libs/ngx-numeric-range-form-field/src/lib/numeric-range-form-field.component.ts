import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  untracked,
  viewChild
} from '@angular/core'
import { FormValueControl, ValidationError } from '@angular/forms/signals'
import { INumericRange } from './numeric-range.model'

@Component({
  selector: 'ngx-numeric-range-form-field',
  templateUrl: './numeric-range-form-field.component.html',
  styleUrls: ['./numeric-range-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumericRangeFormFieldComponent implements FormValueControl<INumericRange | null> {
  readonly label = input('')
  readonly minPlaceholder = input('From')
  readonly maxPlaceholder = input('To')
  readonly readonly = input(false)
  readonly minReadonly = input(false)
  readonly maxReadonly = input(false)
  readonly resettable = input(true)
  readonly required = input(false)

  readonly value = model<INumericRange | null>(null)
  readonly disabled = input(false)
  readonly touched = model(false)
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([])

  protected readonly isInvalid = computed(
    () => this.touched() && this.errors().length > 0
  )

  protected readonly hasValue = computed(() => {
    const v = this.value()
    return v !== null && (v.minimum !== null || v.maximum !== null)
  })

  protected readonly canReset = computed(
    () =>
      this.resettable() &&
      !this.readonly() &&
      !this.minReadonly() &&
      !this.maxReadonly() &&
      !this.disabled() &&
      this.hasValue()
  )

  private readonly minInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('minInput')
  private readonly maxInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('maxInput')

  // Tracks the last numeric value each DOM input emitted so we can tell an
  // external write (reset / patchValue) apart from a keystroke we just
  // processed. Without this, syncing the signal back into the input would
  // clobber transient states like "1." or leading zeros while the user types.
  private lastMinEmitted: number | null = null
  private lastMaxEmitted: number | null = null

  constructor() {
    effect(() => {
      const v = this.value()
      const nextMin = v?.minimum ?? null
      const nextMax = v?.maximum ?? null

      untracked(() => {
        const minEl = this.minInputRef().nativeElement
        const maxEl = this.maxInputRef().nativeElement

        if (nextMin !== this.lastMinEmitted) {
          minEl.value = nextMin === null ? '' : String(nextMin)
          this.lastMinEmitted = nextMin
        }
        if (nextMax !== this.lastMaxEmitted) {
          maxEl.value = nextMax === null ? '' : String(nextMax)
          this.lastMaxEmitted = nextMax
        }
      })
    })
  }

  protected onMinInput(event: Event): void {
    const min = toNumberOrNull((event.target as HTMLInputElement).value)
    this.lastMinEmitted = min
    this.patch({ minimum: min })
  }

  protected onMaxInput(event: Event): void {
    const max = toNumberOrNull((event.target as HTMLInputElement).value)
    this.lastMaxEmitted = max
    this.patch({ maximum: max })
  }

  protected onBlur(): void {
    this.touched.set(true)
  }

  protected reset(): void {
    this.value.set(null)
    this.touched.set(false)
  }

  private patch(partial: Partial<INumericRange>): void {
    const current: INumericRange = this.value() ?? {
      minimum: null,
      maximum: null
    }
    const next: INumericRange = { ...current, ...partial }

    if (next.minimum === null && next.maximum === null) {
      this.value.set(null)
      return
    }

    this.value.set(next)
  }
}

function toNumberOrNull(raw: string): number | null {
  if (raw === '') {
    return null
  }
  const parsed = Number(raw)
  return Number.isNaN(parsed) ? null : parsed
}
