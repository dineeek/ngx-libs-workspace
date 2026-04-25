/**
 * Error `kind` values emitted by this library's validators. Exporting them
 * as a const-object lets consumers use the typed constants instead of
 * duplicating string literals when filtering `field().errors()`:
 *
 * ```ts
 * import { NumericRangeErrorKind } from 'ngx-numeric-range-form-field'
 *
 * if (field().errors().some(e => e.kind === NumericRangeErrorKind.OutOfOrder)) {
 *   // …
 * }
 * ```
 *
 * The string values are the same as the `kind` strings emitted by the
 * validators today, so existing code that compares against `'invalidRange'`,
 * `'min'`, etc. continues to work.
 */
export const NumericRangeErrorKind = {
  OutOfOrder: 'invalidRange',
  BoundsMin: 'min',
  BoundsMax: 'max',
  Incomplete: 'incomplete',
  WidthMin: 'minWidth',
  WidthMax: 'maxWidth'
} as const

export type NumericRangeErrorKind =
  (typeof NumericRangeErrorKind)[keyof typeof NumericRangeErrorKind]
