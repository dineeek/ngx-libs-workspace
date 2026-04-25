import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'

export type TimeRangeWidthBounds = {
  /** Minimum span of the range, in minutes. Fractional values are allowed for sub-minute precision. */
  minMinutes?: number
  /** Maximum span of the range, in minutes. Fractional values are allowed for sub-minute precision. */
  maxMinutes?: number
}

/**
 * Signal Forms validator that constrains the *span* of a time range
 * (i.e. `end - start`, in minutes). Pass `minMinutes` to require a minimum
 * span and `maxMinutes` to cap it.
 *
 * Emits `{ kind: 'minWidth' }` when the span is below `bounds.minMinutes`
 * and `{ kind: 'maxWidth' }` when the span exceeds `bounds.maxMinutes`.
 * Both carry a human-readable `message`. Skips when either side is `null`
 * or the range is mis-ordered (that case is surfaced by
 * `timeRangeOrderValid`).
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

    const startMinutes = timeStringToMinutes(v.start)
    const endMinutes = timeStringToMinutes(v.end)
    if (startMinutes === null || endMinutes === null) {
      return null
    }
    if (endMinutes < startMinutes) {
      return null
    }

    const span = endMinutes - startMinutes
    const errors: ValidationError.WithoutFieldTree[] = []

    if (bounds.minMinutes !== undefined && span < bounds.minMinutes) {
      errors.push({
        kind: 'minWidth',
        message: `Range must span at least ${bounds.minMinutes} minute(s)`
      } as ValidationError.WithoutFieldTree)
    }

    if (bounds.maxMinutes !== undefined && span > bounds.maxMinutes) {
      errors.push({
        kind: 'maxWidth',
        message: `Range must not span more than ${bounds.maxMinutes} minute(s)`
      } as ValidationError.WithoutFieldTree)
    }

    return errors.length ? errors : null
  })
}

function timeStringToMinutes(t: string): number | null {
  const m = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(t)
  if (!m) return null
  const hours = Number(m[1])
  const minutes = Number(m[2])
  const seconds = m[3] === undefined ? 0 : Number(m[3])
  return hours * 60 + minutes + seconds / 60
}
