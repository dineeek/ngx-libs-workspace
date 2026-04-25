import { isSupportedCountry, type CountryCode } from 'libphonenumber-js/max'

/**
 * Resolves an initial country for the phone field by reading the browser's
 * preferred language and extracting its region tag (e.g. `en-GB` → `GB`).
 * Falls back to `'US'` when:
 *  - `navigator.language` is missing or empty
 *  - the locale tag does not yield a region
 *  - the resolved region is not a country libphonenumber supports
 */
export function detectCountry(fallback: CountryCode = 'US'): CountryCode {
  const lang =
    typeof navigator !== 'undefined' && typeof navigator.language === 'string'
      ? navigator.language.trim()
      : ''
  if (!lang) {
    return fallback
  }

  try {
    const region = new Intl.Locale(lang).maximize().region?.toUpperCase()
    if (region && isSupportedCountry(region)) {
      return region as CountryCode
    }
  } catch {
    // malformed tag — fall through
  }

  return fallback
}
