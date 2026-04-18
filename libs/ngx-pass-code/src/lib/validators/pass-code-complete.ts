import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
  ValidationError
} from '@angular/forms/signals'

type PassCodeValue = string | number | null | undefined

/**
 * Signal Forms validator that fails until every slot of the pass-code
 * control is filled. Pair with `<ngx-pass-code [length]="N">` and the same
 * `N` here so the `form().valid()` state matches the visible completeness
 * of the control.
 */
export function passCodeComplete<
  TValue extends PassCodeValue,
  TPathKind extends PathKind = PathKind.Root
>(
  path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
  length: number
): void {
  validate(path, ({ value }) => {
    const v = value()
    if (v !== null && v !== undefined && String(v).length === length) {
      return null
    }
    return { kind: 'incomplete' } as ValidationError.WithoutFieldTree
  })
}
