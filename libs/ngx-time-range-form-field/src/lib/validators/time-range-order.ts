import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'

/**
 * Signal Forms validator that flags a time range whose end is earlier than
 * its start. No-op when either side is `null`. Mixed-precision values are
 * normalised to `HH:mm:ss` first so a bare `'17:00'` compares equal to
 * `'17:00:00'`.
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

    if (toComparable(end) < toComparable(start)) {
      return {
        kind: 'invalidRange',
        message: 'End must be at or after start'
      } as ValidationError.WithoutFieldTree
    }

    return null
  })
}

function toComparable(t: string): string {
  return t.length === 5 ? `${t}:00` : t
}
