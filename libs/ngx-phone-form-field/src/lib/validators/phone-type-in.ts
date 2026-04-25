import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { NumberType, parsePhoneNumberFromString } from 'libphonenumber-js/max'

/**
 * Signal Forms validator that restricts the phone-line type. Useful for
 * mobile-only fields (`['MOBILE']`) or excluding premium numbers.
 *
 * Requires the `/max` libphonenumber-js metadata (already used by this
 * library) — line-type detection is unavailable in `min` builds.
 *
 * No-op when the value is `null` / empty or when the line type cannot be
 * determined for the parsed country.
 */
export function phoneTypeIn<
  TValue extends string | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(
  path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
  allowed: readonly NumberType[]
): void {
  const allowedSet = new Set<NumberType>(allowed)
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }
    const parsed = parsePhoneNumberFromString(v)
    if (!parsed) {
      return null
    }
    const type = parsed.getType()
    if (!type) {
      return null
    }
    if (allowedSet.has(type)) {
      return null
    }
    return {
      kind: 'disallowedPhoneType',
      message: 'Phone number line type is not allowed'
    } as ValidationError.WithoutFieldTree
  })
}
