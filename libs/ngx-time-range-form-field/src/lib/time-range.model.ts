/**
 * Composite value of a `<ngx-time-range-form-field>`. Each side is either
 * `null` (cleared) or an `HH:mm` / `HH:mm:ss` string emitted by an
 * `<input type="time">`. The wire format matches what the native time input
 * uses, so values round-trip through `patchValue` and JSON without conversion.
 */
export type ITimeRange = {
  start: string | null
  end: string | null
}
