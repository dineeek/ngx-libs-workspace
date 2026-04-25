import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js/max'

/**
 * Signal Forms validator that rejects a phone number whose detected country
 * is not in the allowed list. Pass any subset of ISO 3166-1 alpha-2 country
 * codes (e.g. `['US', 'GB', 'HR']`). No-op when the value is `null` / empty.
 */
export function phoneCountryIn<
  TValue extends string | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(
  path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
  allowed: readonly CountryCode[]
): void {
  const allowedSet = new Set<string>(allowed)
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }
    const parsed = parsePhoneNumberFromString(v)
    const country = parsed?.country
    if (country && allowedSet.has(country)) {
      return null
    }
    return {
      kind: 'disallowedCountry',
      message: 'Phone number is from a country that is not allowed'
    } as ValidationError.WithoutFieldTree
  })
}
