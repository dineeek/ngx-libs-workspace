import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'

export type TimeRangeBounds = {
  /** Earliest allowable time-of-day (`HH:mm` or `HH:mm:ss`). */
  min?: string
  /** Latest allowable time-of-day (`HH:mm` or `HH:mm:ss`). */
  max?: string
}

/**
 * Signal Forms validator that keeps both sides of a time range within
 * consumer-supplied bounds. A value on either side earlier than `bounds.min`
 * emits `{ kind: 'min' }`; a value later than `bounds.max` emits
 * `{ kind: 'max' }`. `null` on either side is treated as "not yet set" and
 * passes. Comparison is lexicographic (exact for zero-padded times).
 */
export function timeRangeBounds<
  TValue extends ITimeRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(
  path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
  bounds: TimeRangeBounds
): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }

    const sides: ReadonlyArray<{
      label: 'Start' | 'End'
      value: string | null
    }> = [
      { label: 'Start', value: v.start },
      { label: 'End', value: v.end }
    ]
    const errors: ValidationError.WithoutFieldTree[] = []

    for (const side of sides) {
      if (side.value === null) continue

      if (bounds.min !== undefined && side.value < bounds.min) {
        errors.push({
          kind: 'min',
          message: `${side.label} must be at or after ${bounds.min}`
        } as ValidationError.WithoutFieldTree)
      }

      if (bounds.max !== undefined && side.value > bounds.max) {
        errors.push({
          kind: 'max',
          message: `${side.label} must be at or before ${bounds.max}`
        } as ValidationError.WithoutFieldTree)
      }
    }

    return errors.length ? errors : null
  })
}
