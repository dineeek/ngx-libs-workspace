import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model
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

  protected onMinInput(event: Event): void {
    this.patch({
      minimum: toNumberOrNull((event.target as HTMLInputElement).value)
    })
  }

  protected onMaxInput(event: Event): void {
    this.patch({
      maximum: toNumberOrNull((event.target as HTMLInputElement).value)
    })
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
