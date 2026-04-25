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
 * passes. Mixed-precision strings are normalised to `HH:mm:ss` before
 * comparison, so bounds like `min: '09:00'` work for `'09:00:00'` values.
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

    const minBound =
      bounds.min === undefined ? undefined : toComparable(bounds.min)
    const maxBound =
      bounds.max === undefined ? undefined : toComparable(bounds.max)

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
      const candidate = toComparable(side.value)

      if (minBound !== undefined && candidate < minBound) {
        errors.push({
          kind: 'min',
          message: `${side.label} must be at or after ${bounds.min}`
        } as ValidationError.WithoutFieldTree)
      }

      if (maxBound !== undefined && candidate > maxBound) {
        errors.push({
          kind: 'max',
          message: `${side.label} must be at or before ${bounds.max}`
        } as ValidationError.WithoutFieldTree)
      }
    }

    return errors.length ? errors : null
  })
}

function toComparable(t: string): string {
  return t.length === 5 ? `${t}:00` : t
}
