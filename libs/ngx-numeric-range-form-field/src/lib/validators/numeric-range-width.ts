import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'

export type NumericRangeWidthBounds = {
  min?: number
  max?: number
}

/**
 * Signal Forms validator that constrains the *span* of a numeric range
 * (i.e. `maximum - minimum`). Pass `min` to require a minimum span and
 * `max` to cap the span.
 *
 * Emits `{ kind: 'minWidth' }` when the span is below `bounds.min`
 * and `{ kind: 'maxWidth' }` when the span exceeds `bounds.max`. Both
 * carry a human-readable `message`. Skips when either side is `null` or
 * the range is mis-ordered (that case is surfaced by
 * `numericRangeOrderValid`).
 */
export function numericRangeWidth<
  TValue extends INumericRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(
  path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
  bounds: NumericRangeWidthBounds
): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v || v.minimum === null || v.maximum === null) {
      return null
    }
    if (v.maximum < v.minimum) {
      return null
    }

    const span = v.maximum - v.minimum
    const errors: ValidationError.WithoutFieldTree[] = []

    if (bounds.min !== undefined && span < bounds.min) {
      errors.push({
        kind: 'minWidth',
        message: `Range must span at least ${bounds.min}`
      } as ValidationError.WithoutFieldTree)
    }

    if (bounds.max !== undefined && span > bounds.max) {
      errors.push({
        kind: 'maxWidth',
        message: `Range must not span more than ${bounds.max}`
      } as ValidationError.WithoutFieldTree)
    }

    return errors.length ? errors : null
  })
}
