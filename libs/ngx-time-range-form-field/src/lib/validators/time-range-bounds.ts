import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'
import { parseTimeToSeconds } from './internal/parse-time'

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
 * `{ kind: 'max' }`. `null` on either side, or a malformed wire string on
 * either side or in the bounds themselves, is treated as "not yet set" and
 * passes — the component-side parser already rejects malformed entries the
 * user could type. Mixed-precision strings (`HH:mm` vs `HH:mm:ss`) are
 * normalised to seconds before comparison.
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

    const minSeconds =
      bounds.min === undefined ? null : parseTimeToSeconds(bounds.min)
    const maxSeconds =
      bounds.max === undefined ? null : parseTimeToSeconds(bounds.max)

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
      const candidateSeconds = parseTimeToSeconds(side.value)
      if (candidateSeconds === null) continue

      if (minSeconds !== null && candidateSeconds < minSeconds) {
        errors.push({
          kind: 'min',
          message: `${side.label} must be at or after ${bounds.min}`
        } as ValidationError.WithoutFieldTree)
      }

      if (maxSeconds !== null && candidateSeconds > maxSeconds) {
        errors.push({
          kind: 'max',
          message: `${side.label} must be at or before ${bounds.max}`
        } as ValidationError.WithoutFieldTree)
      }
    }

    return errors.length ? errors : null
  })
}
