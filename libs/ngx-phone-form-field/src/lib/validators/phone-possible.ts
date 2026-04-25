import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { isPossiblePhoneNumber } from 'libphonenumber-js/max'

/**
 * Signal Forms validator that performs a length-only check (no carrier
 * prefix / line-type validation). Useful when you want to accept any number
 * that *could* be a real phone number for the parsed country, even if it
 * isn't currently in service. No-op when the value is `null` / empty.
 */
export function phonePossible<
  TValue extends string | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }
    if (isPossiblePhoneNumber(v)) {
      return null
    }
    return {
      kind: 'notPossiblePhone',
      message: 'Phone number length is not valid for any country'
    } as ValidationError.WithoutFieldTree
  })
}
