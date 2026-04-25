/**
 * Error `kind` values emitted by this library's validators. Exporting them
 * as a const-object lets consumers use the typed constants instead of
 * duplicating string literals when filtering `field().errors()`:
 *
 * ```ts
 * import { TimeRangeErrorKind } from 'ngx-time-range-form-field'
 *
 * if (field().errors().some(e => e.kind === TimeRangeErrorKind.OutOfOrder)) {
 *   // …
 * }
 * ```
 *
 * The string values are intentionally identical to the ones emitted by the
 * sibling `ngx-numeric-range-form-field` library so consumers using both can
 * share branching logic.
 */
export const TimeRangeErrorKind = {
  OutOfOrder: 'invalidRange',
  BoundsMin: 'min',
  BoundsMax: 'max',
  Incomplete: 'incomplete',
  WidthMin: 'minWidth',
  WidthMax: 'maxWidth'
} as const

export type TimeRangeErrorKind =
  (typeof TimeRangeErrorKind)[keyof typeof TimeRangeErrorKind]
