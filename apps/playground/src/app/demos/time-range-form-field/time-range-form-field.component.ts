import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { disabled, form, readonly, required } from '@angular/forms/signals'
import {
  ITimeRange,
  timeRangeBounds,
  timeRangeOrderValid,
  timeRangeWidth
} from 'ngx-time-range-form-field'

@Component({
  selector: 'ngx-libs-workspace-time-range-form-field-demo',
  templateUrl: './time-range-form-field.component.html',
  styleUrls: ['./time-range-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TimeRangeFormFieldDemoComponent {
  protected readonly basicValue = signal<ITimeRange | null>({
    start: '09:00',
    end: '17:00'
  })
  protected readonly basicDisabled = signal(false)
  protected readonly basicForm = form<ITimeRange | null>(this.basicValue, p => {
    timeRangeOrderValid(p)
    disabled(p, () => this.basicDisabled())
  })

  protected readonly validatedValue = signal<ITimeRange | null>(null)
  protected readonly validatedForm = form<ITimeRange | null>(
    this.validatedValue,
    p => {
      required(p)
      timeRangeBounds(p, { min: '08:00', max: '20:00' })
      timeRangeWidth(p, { minMinutes: 30, maxMinutes: 480 })
      timeRangeOrderValid(p)
    }
  )

  protected readonly readonlyValue = signal<ITimeRange | null>({
    start: '09:00',
    end: '17:00'
  })
  protected readonly readonlyForm = form<ITimeRange | null>(
    this.readonlyValue,
    p => {
      readonly(p, () => true)
      timeRangeOrderValid(p)
    }
  )

  protected readonly basicBadges = ['signal forms', 'resettable']
  protected readonly validatedBadges = [
    'required',
    'bounds 08:00..20:00',
    'span 30min..8h',
    'range order'
  ]
  protected readonly readonlyBadges = ['readonly']

  protected readonly basicSnippet = `readonly value = signal<ITimeRange | null>(
  { start: '09:00', end: '17:00' }
)
readonly field = form(this.value, p => {
  timeRangeOrderValid(p)
})

/*
 * template
 * <ngx-time-range-form-field
 *   [formField]="field"
 *   label="Working hours"
 * />
 */`

  protected readonly validatedSnippet = `readonly value = signal<ITimeRange | null>(null)
readonly field = form(this.value, p => {
  required(p)
  timeRangeBounds(p, { min: '08:00', max: '20:00' })
  timeRangeWidth(p, { minMinutes: 30, maxMinutes: 480 })
  timeRangeOrderValid(p)
})

/*
 * template
 * <ngx-time-range-form-field
 *   [formField]="field"
 *   label="Workday slot"
 * />
 */`

  protected readonly readonlySnippet = `readonly value = signal<ITimeRange | null>(
  { start: '09:00', end: '17:00' }
)
readonly field = form(this.value, p => {
  readonly(p, () => true)
  timeRangeOrderValid(p)
})

/*
 * template
 * <ngx-time-range-form-field
 *   [formField]="field"
 *   label="Frozen window"
 *   [resettable]="false"
 * />
 */`

  protected resetBasic(): void {
    this.basicValue.set(null)
    this.basicDisabled.set(false)
  }

  protected patchBasic(): void {
    this.basicValue.set({ start: '10:30', end: '15:45' })
  }

  protected resetValidated(): void {
    this.validatedValue.set(null)
  }

  protected patchValidated(): void {
    this.validatedValue.set({ start: '09:00', end: '12:30' })
  }

  protected patchValidatedOutOfBounds(): void {
    this.validatedValue.set({ start: '06:00', end: '22:00' })
  }
}
