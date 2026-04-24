import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'

export type NumericRangeBounds = {
  min?: number
  max?: number
}

/**
 * Signal Forms validator that keeps both sides of a numeric range within
 * consumer-supplied bounds. A value on either side below `bounds.min` emits
 * `{ kind: 'min' }`; a value above `bounds.max` emits `{ kind: 'max' }`.
 * `null` on either side is treated as "not yet set" and passes.
 */
export function numericRangeBounds<
  TValue extends INumericRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(
  path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
  bounds: NumericRangeBounds
): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }

    const errors: ValidationError.WithoutFieldTree[] = []

    if (bounds.min !== undefined) {
      if (v.minimum !== null && v.minimum < bounds.min) {
        errors.push({
          kind: 'min',
          message: `Minimum must be at least ${bounds.min}`
        } as ValidationError.WithoutFieldTree)
      }
      if (v.maximum !== null && v.maximum < bounds.min) {
        errors.push({
          kind: 'min',
          message: `Maximum must be at least ${bounds.min}`
        } as ValidationError.WithoutFieldTree)
      }
    }

    if (bounds.max !== undefined) {
      if (v.minimum !== null && v.minimum > bounds.max) {
        errors.push({
          kind: 'max',
          message: `Minimum must not exceed ${bounds.max}`
        } as ValidationError.WithoutFieldTree)
      }
      if (v.maximum !== null && v.maximum > bounds.max) {
        errors.push({
          kind: 'max',
          message: `Maximum must not exceed ${bounds.max}`
        } as ValidationError.WithoutFieldTree)
      }
    }

    return errors.length ? errors : null
  })
}
