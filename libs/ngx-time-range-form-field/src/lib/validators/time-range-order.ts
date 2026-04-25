import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'
import { parseTimeToSeconds } from './internal/parse-time'

/**
 * Signal Forms validator that flags a time range whose end is earlier than
 * its start. No-op when either side is `null` or fails strict
 * `HH:mm` / `HH:mm:ss` parsing — malformed strings are a contract violation
 * the component-side parser rejects, so this helper stays silent rather
 * than producing a misleading order error from a corrupt comparison.
 */
export function timeRangeOrderValid<
  TValue extends ITimeRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>): void {
  validate(path, ({ value }) => {
    const v = value()
    if (!v) {
      return null
    }

    const { start, end } = v
    if (start === null || end === null) {
      return null
    }

    const startSeconds = parseTimeToSeconds(start)
    const endSeconds = parseTimeToSeconds(end)
    if (startSeconds === null || endSeconds === null) {
      return null
    }

    if (endSeconds < startSeconds) {
      return {
        kind: 'invalidRange',
        message: 'End must be at or after start'
      } as ValidationError.WithoutFieldTree
    }

    return null
  })
}
