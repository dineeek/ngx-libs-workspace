import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  signal,
  untracked,
  viewChild
} from '@angular/core'
import { FormValueControl, ValidationError } from '@angular/forms/signals'
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  parsePhoneNumberFromString
} from 'libphonenumber-js/max'
import { getDefaultCountries } from './countries/default-countries'
import { PhoneCountryPickerComponent } from './country-picker/country-picker.component'
import { detectCountry } from './locale/detect-country'
import { IPhoneCountry } from './phone.model'

@Component({
  selector: 'ngx-phone-form-field',
  templateUrl: './phone-form-field.component.html',
  styleUrls: ['./phone-form-field.component.scss'],
  imports: [PhoneCountryPickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneFormFieldComponent implements FormValueControl<
  string | null
> {
  readonly label = input('')
  readonly placeholder = input('')
  readonly initialCountry = input<CountryCode | null>(null)
  readonly countries = input<readonly CountryCode[] | null>(null)
  readonly format = input(true)
  readonly readonly = input(false)
  readonly resettable = input(true)
  readonly required = input(false)
  readonly searchPlaceholder = input('Search country')

  readonly value = model<string | null>(null)
  readonly disabled = input(false)
  readonly touched = model(false)
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([])

  protected readonly selectedCountry = signal<CountryCode>('US')
  protected readonly displayValue = signal('')

  protected readonly availableCountries = computed<readonly IPhoneCountry[]>(
    () => {
      const all = getDefaultCountries()
      const filter = this.countries()
      if (!filter || filter.length === 0) {
        return all
      }
      const allowed = new Set<string>(filter)
      return all.filter(c => allowed.has(c.iso2))
    }
  )

  protected readonly resolvedPlaceholder = computed(() => this.placeholder())

  protected readonly isInvalid = computed(
    () => this.touched() && this.errors().length > 0
  )

  protected readonly hasValue = computed(() => {
    const v = this.value()
    return v !== null && v !== ''
  })

  protected readonly canReset = computed(
    () =>
      this.resettable() &&
      !this.readonly() &&
      !this.disabled() &&
      this.hasValue()
  )

  private readonly numberInputRef =
    viewChild<ElementRef<HTMLInputElement>>('numberInput')

  // Tracks the last value this component emitted so the value-sync effect can
  // tell user typing apart from an external write (reset / patchValue) and
  // skip re-processing its own emission.
  private lastEmittedValue: string | null = null

  constructor() {
    this.selectedCountry.set(this.initialCountry() ?? detectCountry())

    effect(() => {
      // Reactive: respond to programmatic initialCountry changes when the
      // field has no value (so we don't clobber a user's typed country).
      const init = this.initialCountry()
      untracked(() => {
        if (init && this.value() === null) {
          this.selectedCountry.set(init)
          this.displayValue.set('')
          this.writeDom('')
        }
      })
    })

    effect(() => {
      const v = this.value()
      untracked(() => {
        if (v === this.lastEmittedValue) {
          return
        }
        this.applyExternalValue(v)
      })
    })
  }

  protected onNumberInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value
    this.processTyping(raw)
  }

  protected onCountryChange(iso: CountryCode): void {
    this.selectedCountry.set(iso)
    const digits = stripToTypedChars(this.displayValue())
    this.processTyping(digits)
    queueMicrotask(() => this.numberInputRef()?.nativeElement.focus())
  }

  protected onBlur(): void {
    this.touched.set(true)
  }

  protected reset(): void {
    this.lastEmittedValue = null
    this.value.set(null)
    this.touched.set(false)
    this.displayValue.set('')
    this.writeDom('')
    this.selectedCountry.set(this.initialCountry() ?? detectCountry())
  }

  private processTyping(raw: string): void {
    const trimmed = raw.trim()
    if (trimmed === '') {
      this.displayValue.set('')
      this.writeDom('')
      this.emit(null)
      return
    }

    const country = this.selectedCountry()
    const formatter = new AsYouType(country)
    const formatted = formatter.input(raw)
    const parsed = formatter.getNumber()

    if (parsed?.country && parsed.country !== country) {
      this.selectedCountry.set(parsed.country)
    }

    const display = this.format() ? formatted : raw
    this.displayValue.set(display)
    this.writeDom(display)

    if (parsed) {
      this.emit(parsed.number)
      return
    }

    // Couldn't parse to a phone number yet — emit a partial E.164 so consumers
    // see typing progress. Build it from the raw digits + the current dial code.
    const digits = raw.replace(/\D/g, '')
    if (!digits) {
      this.emit(null)
      return
    }
    if (raw.trim().startsWith('+')) {
      this.emit(`+${digits}`)
      return
    }
    this.emit(`+${getCountryCallingCode(country)}${digits}`)
  }

  private applyExternalValue(v: string | null): void {
    this.lastEmittedValue = v
    if (!v) {
      this.displayValue.set('')
      this.writeDom('')
      return
    }
    const parsed = parsePhoneNumberFromString(v)
    if (parsed?.country) {
      this.selectedCountry.set(parsed.country)
    }
    const display = this.format()
      ? (parsed?.formatNational() ?? parsed?.nationalNumber ?? '')
      : (parsed?.nationalNumber ?? v.replace(/^\+\d+/, ''))
    this.displayValue.set(display)
    this.writeDom(display)
  }

  private emit(next: string | null): void {
    this.lastEmittedValue = next
    this.value.set(next)
  }

  private writeDom(text: string): void {
    const el = this.numberInputRef()?.nativeElement
    if (el && el.value !== text) {
      el.value = text
    }
  }
}

function stripToTypedChars(formatted: string): string {
  // Keep digits and a leading + (preserves user-intent for international entry).
  if (formatted.startsWith('+')) {
    return '+' + formatted.slice(1).replace(/\D/g, '')
  }
  return formatted.replace(/\D/g, '')
}
