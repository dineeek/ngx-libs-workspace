import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'

/**
 * Signal Forms validator that flags a numeric range whose maximum is less
 * than its minimum. No-op when either side is `null`.
 */
export function numericRangeOrderValid<
  TValue extends INumericRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }

    const { minimum, maximum } = v
    if (minimum === null || maximum === null) {
      return null
    }

    if (maximum < minimum) {
      return {
        kind: 'invalidRange',
        message: 'Maximum must be greater than or equal to minimum'
      } as ValidationError.WithoutFieldTree
    }

    return null
  })
}
