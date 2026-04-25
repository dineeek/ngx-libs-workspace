import { hasFlag } from 'country-flag-icons'
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode
} from 'libphonenumber-js/max'
import { IPhoneCountry } from '../phone.model'

let cache: readonly IPhoneCountry[] | null = null

/**
 * Returns the full curated country list — every ISO 3166-1 alpha-2 country
 * supported by libphonenumber-js for which `country-flag-icons` ships an SVG.
 * Each entry carries an English display name (`Intl.DisplayNames`) and the
 * E.164 dial code without the leading `+`. Sorted by name.
 *
 * Consumers can filter this list to build a subset for the
 * `[countries]` input on `<ngx-phone-form-field>`.
 *
 * The result is memoized — repeated calls return the same array.
 */
export function getDefaultCountries(): readonly IPhoneCountry[] {
  if (cache !== null) {
    return cache
  }

  const display = new Intl.DisplayNames(['en'], { type: 'region' })

  cache = getCountries()
    .filter((iso): iso is CountryCode => hasFlag(iso))
    .map(iso => ({
      iso2: iso,
      name: display.of(iso) ?? iso,
      dialCode: getCountryCallingCode(iso)
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return cache
}
