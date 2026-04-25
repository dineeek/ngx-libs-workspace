import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js/max'

/**
 * Signal Forms validator that rejects a phone number when its detected
 * country is not in the allowed list. Pass any subset of ISO 3166-1
 * alpha-2 country codes (e.g. `['US', 'GB', 'HR']`).
 *
 * Behaviour:
 * - `null` / empty value — no-op (use `required(p)` if you need that
 *   guarantee).
 * - Parseable value with country in `allowed` — passes.
 * - Parseable value with country NOT in `allowed` — emits
 *   `{ kind: 'disallowedCountry' }`.
 * - **Unparseable value** — also emits `{ kind: 'disallowedCountry' }` on
 *   the principle "no detected country ⇒ not in the allowed list". Compose
 *   with `phoneValid(p)` first if you'd prefer unparseable input to surface
 *   as `'invalidPhone'` instead.
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
