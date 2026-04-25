import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { isValidPhoneNumber } from 'libphonenumber-js/max'

/**
 * Signal Forms validator that flags an E.164 phone string that
 * `libphonenumber-js` cannot fully validate (wrong length for the country,
 * wrong prefix, or unparseable). No-op when the value is `null` / empty —
 * pair with `required(p)` if a value is mandatory.
 */
export function phoneValid<
  TValue extends string | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }
    if (isValidPhoneNumber(v)) {
      return null
    }
    return {
      kind: 'invalidPhone',
      message: 'Phone number is not valid'
    } as ValidationError.WithoutFieldTree
  })
}
