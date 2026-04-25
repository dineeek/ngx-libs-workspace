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

    const sides: ReadonlyArray<{
      label: 'Minimum' | 'Maximum'
      value: number | null
    }> = [
      { label: 'Minimum', value: v.minimum },
      { label: 'Maximum', value: v.maximum }
    ]
    const errors: ValidationError.WithoutFieldTree[] = []

    for (const side of sides) {
      if (side.value === null) continue

      if (bounds.min !== undefined && side.value < bounds.min) {
        errors.push({
          kind: 'min',
          message: `${side.label} must be at least ${bounds.min}`
        } as ValidationError.WithoutFieldTree)
      }

      if (bounds.max !== undefined && side.value > bounds.max) {
        errors.push({
          kind: 'max',
          message: `${side.label} must not exceed ${bounds.max}`
        } as ValidationError.WithoutFieldTree)
      }
    }

    return errors.length ? errors : null
  })
}
