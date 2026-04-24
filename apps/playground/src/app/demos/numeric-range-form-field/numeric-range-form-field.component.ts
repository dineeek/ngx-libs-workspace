import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { disabled, form, readonly, required } from '@angular/forms/signals'
import {
  INumericRange,
  numericRangeBounds,
  numericRangeOrderValid
} from 'ngx-numeric-range-form-field'

@Component({
  selector: 'ngx-libs-workspace-numeric-range-form-field-demo',
  templateUrl: './numeric-range-form-field.component.html',
  styleUrls: ['./numeric-range-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NumericRangeFormFieldDemoComponent {
  protected readonly basicValue = signal<INumericRange | null>({
    minimum: 10,
    maximum: 50
  })
  protected readonly basicDisabled = signal(false)
  protected readonly basicForm = form<INumericRange | null>(
    this.basicValue,
    p => {
      numericRangeOrderValid(p)
      disabled(p, () => this.basicDisabled())
    }
  )

  protected readonly validatedValue = signal<INumericRange | null>(null)
  protected readonly validatedForm = form<INumericRange | null>(
    this.validatedValue,
    p => {
      required(p)
      numericRangeBounds(p, { min: 1, max: 10 })
      numericRangeOrderValid(p)
    }
  )

  protected readonly readonlyValue = signal<INumericRange | null>({
    minimum: 1,
    maximum: 9
  })
  protected readonly readonlyForm = form<INumericRange | null>(
    this.readonlyValue,
    p => {
      readonly(p, () => true)
      numericRangeOrderValid(p)
    }
  )

  protected readonly basicBadges = ['signal forms', 'resettable']
  protected readonly validatedBadges = [
    'required',
    'bounds 1..10',
    'range order'
  ]
  protected readonly readonlyBadges = ['readonly']

  protected readonly basicSnippet = `readonly value = signal<INumericRange | null>(
  { minimum: 10, maximum: 50 }
)
readonly field = form(this.value, p => {
  numericRangeOrderValid(p)
})

/*
 * template
 * <ngx-numeric-range-form-field
 *   [formField]="field"
 *   label="Pick a range"
 * />
 */`

  protected readonly validatedSnippet = `readonly value = signal<INumericRange | null>(null)
readonly field = form(this.value, p => {
  required(p)
  numericRangeBounds(p, { min: 1, max: 10 })
  numericRangeOrderValid(p)
})

/*
 * template
 * <ngx-numeric-range-form-field
 *   [formField]="field"
 *   label="Between 1 and 10"
 * />
 */`

  protected readonly readonlySnippet = `readonly value = signal<INumericRange | null>(
  { minimum: 1, maximum: 9 }
)
readonly field = form(this.value, p => {
  readonly(p, () => true)
  numericRangeOrderValid(p)
})

/*
 * template
 * <ngx-numeric-range-form-field
 *   [formField]="field"
 *   label="Frozen range"
 *   [resettable]="false"
 * />
 */`

  protected resetBasic(): void {
    this.basicValue.set(null)
    this.basicDisabled.set(false)
  }

  protected patchBasic(): void {
    this.basicValue.set({ minimum: 25, maximum: 75 })
  }

  protected resetValidated(): void {
    this.validatedValue.set(null)
  }

  protected patchValidated(): void {
    this.validatedValue.set({ minimum: 2, maximum: 8 })
  }

  protected patchValidatedOutOfBounds(): void {
    this.validatedValue.set({ minimum: 0, maximum: 11 })
  }
}
