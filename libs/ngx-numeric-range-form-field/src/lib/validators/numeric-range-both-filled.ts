import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'

/**
 * Signal Forms validator that fails until BOTH sides of a numeric range are
 * populated. `required(p)` only asserts the composite value is not `null` —
 * pair this helper with it (or use on its own) to guarantee the user filled
 * both the minimum and the maximum inputs.
 *
 * Emits `{ kind: 'incomplete' }` when either side is `null`.
 */
export function numericRangeBothFilled<
  TValue extends INumericRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>): void {
  validate(path, ({ value }) => {
    const v = value()
    if (v && v.minimum !== null && v.maximum !== null) {
      return null
    }
    return {
      kind: 'incomplete',
      message: 'Both minimum and maximum are required'
    } as ValidationError.WithoutFieldTree
  })
}
