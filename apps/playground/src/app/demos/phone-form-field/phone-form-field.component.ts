import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { form, required } from '@angular/forms/signals'
import {
  CountryCode,
  getDefaultCountries,
  phoneCountryIn,
  phoneTypeIn,
  phoneValid
} from 'ngx-phone-form-field'

const RESTRICTED: readonly CountryCode[] = ['US', 'GB', 'DE', 'FR', 'JP', 'HR']

@Component({
  selector: 'ngx-libs-workspace-phone-form-field-demo',
  templateUrl: './phone-form-field.component.html',
  styleUrls: ['./phone-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PhoneFormFieldDemoComponent {
  protected readonly basicValue = signal<string | null>(null)
  protected readonly basicForm = form<string | null>(this.basicValue, p => {
    phoneValid(p)
  })

  protected readonly restrictedValue = signal<string | null>(null)
  protected readonly restrictedCountries = RESTRICTED
  protected readonly restrictedForm = form<string | null>(
    this.restrictedValue,
    p => {
      phoneValid(p)
      phoneCountryIn(p, RESTRICTED)
    }
  )

  protected readonly mobileValue = signal<string | null>(null)
  protected readonly mobileForm = form<string | null>(this.mobileValue, p => {
    required(p)
    phoneValid(p)
    phoneTypeIn(p, ['MOBILE'])
  })

  protected readonly basicBadges = ['signal forms', 'AsYouType', 'auto-detect']
  protected readonly restrictedBadges = [
    `${RESTRICTED.length} countries`,
    'phoneCountryIn'
  ]
  protected readonly mobileBadges = ['required', 'phoneTypeIn(MOBILE)']

  protected readonly basicSnippet = `readonly value = signal<string | null>(null)
readonly field = form(this.value, p => {
  phoneValid(p)
})

/*
 * template
 * <ngx-phone-form-field
 *   [formField]="field"
 *   label="Mobile number"
 *   initialCountry="US"
 * />
 */`

  protected readonly restrictedSnippet = `import { getDefaultCountries } from 'ngx-phone-form-field'

const allowed = ['US', 'GB', 'DE', 'FR', 'JP', 'HR'] as const
const subset = getDefaultCountries().filter(c =>
  (allowed as readonly string[]).includes(c.iso2)
)

readonly value = signal<string | null>(null)
readonly field = form(this.value, p => {
  phoneValid(p)
  phoneCountryIn(p, allowed)
})

/*
 * template
 * <ngx-phone-form-field
 *   [formField]="field"
 *   [countries]="allowed"
 *   label="Phone (US, GB, DE, FR, JP, HR)"
 * />
 */`

  protected readonly mobileSnippet = `readonly value = signal<string | null>(null)
readonly field = form(this.value, p => {
  required(p)
  phoneValid(p)
  phoneTypeIn(p, ['MOBILE'])
})

/*
 * template
 * <ngx-phone-form-field
 *   [formField]="field"
 *   label="Mobile only"
 *   initialCountry="GB"
 * />
 */`

  protected readonly subsetExampleCount = getDefaultCountries().filter(c =>
    (RESTRICTED as readonly string[]).includes(c.iso2)
  ).length

  protected resetBasic(): void {
    this.basicValue.set(null)
  }

  protected patchBasicUS(): void {
    this.basicValue.set('+12015550123')
  }

  protected patchBasicUK(): void {
    this.basicValue.set('+442079460000')
  }

  protected resetRestricted(): void {
    this.restrictedValue.set(null)
  }

  protected setRestrictedAllowed(): void {
    this.restrictedValue.set('+442079460000')
  }

  protected setRestrictedDisallowed(): void {
    this.restrictedValue.set('+390612345678') // Italy — not in the subset
  }

  protected resetMobile(): void {
    this.mobileValue.set(null)
  }

  protected setMobileLandline(): void {
    this.mobileValue.set('+442079460000') // UK landline
  }

  protected setMobileMobile(): void {
    this.mobileValue.set('+447400123456') // UK mobile
  }
}
