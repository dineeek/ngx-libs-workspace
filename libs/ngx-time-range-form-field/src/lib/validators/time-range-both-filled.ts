import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'

/**
 * Signal Forms validator that fails until BOTH sides of a time range are
 * populated. `required(p)` only asserts the composite value is not `null` —
 * pair this helper with it (or use on its own) to guarantee the user filled
 * both the start and the end inputs.
 *
 * Emits `{ kind: 'incomplete' }` when either side is `null`.
 */
export function timeRangeBothFilled<
  TValue extends ITimeRange | null | undefined,
  TPathKind extends PathKind = PathKind.Root
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>): void {
  validate(path, ({ value }) => {
    const v = value()
    if (v && v.start !== null && v.end !== null) {
      return null
    }
    return {
      kind: 'incomplete',
      message: 'Both start and end are required'
    } as ValidationError.WithoutFieldTree
  })
}
