import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'
import { parseTimeToSeconds } from './internal/parse-time'

export type TimeRangeWidthBounds = {
  /** Minimum span of the range, in minutes. Fractional values are allowed for sub-minute precision. */
  min?: number
  /** Maximum span of the range, in minutes. Fractional values are allowed for sub-minute precision. */
  max?: number
}

/**
 * Signal Forms validator that constrains the *span* of a time range
 * (`end - start`, in minutes). Pass `min` to require a minimum span and
 * `max` to cap it.
 *
 * Emits `{ kind: 'minWidth' }` when the span is below `bounds.min` and
 * `{ kind: 'maxWidth' }` when the span exceeds `bounds.max`. Both carry a
 * human-readable `message`. Skips when either side is `null`, malformed, or
 * the range is mis-ordered (`timeRangeOrderValid` owns that case).
 */
export function timeRangeWidth<
  TValue extends ITimeRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(
  path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
  bounds: TimeRangeWidthBounds
): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v || v.start === null || v.end === null) {
      return null
    }

    const startSeconds = parseTimeToSeconds(v.start)
    const endSeconds = parseTimeToSeconds(v.end)
    if (startSeconds === null || endSeconds === null) {
      return null
    }
    if (endSeconds < startSeconds) {
      return null
    }

    const span = (endSeconds - startSeconds) / 60
    const errors: ValidationError.WithoutFieldTree[] = []

    if (bounds.min !== undefined && span < bounds.min) {
      errors.push({
        kind: 'minWidth',
        message: `Range must span at least ${bounds.min} minute(s)`
      } as ValidationError.WithoutFieldTree)
    }

    if (bounds.max !== undefined && span > bounds.max) {
      errors.push({
        kind: 'maxWidth',
        message: `Range must not span more than ${bounds.max} minute(s)`
      } as ValidationError.WithoutFieldTree)
    }

    return errors.length ? errors : null
  })
}
