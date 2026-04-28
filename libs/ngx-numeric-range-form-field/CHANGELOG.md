# Changelog

All notable changes to `ngx-numeric-range-form-field` are documented here. This
project adheres to [Semantic Versioning](https://semver.org/). Starting with
`5.0.0`, entries are generated automatically by
[release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/).

## [1.0.0](https://github.com/dineeek/ngx-libs-workspace/compare/ngx-numeric-range-form-field@5.1.0...ngx-numeric-range-form-field@1.0.0) (2026-04-28)


### Miscellaneous Chores

* **ngx-time-range-form-field:** release 1.0.0 ([69ac096](https://github.com/dineeek/ngx-libs-workspace/commit/69ac096fbd574f73a67dd4d8b29e17a716419e04))

## [5.1.0](https://github.com/dineeek/ngx-libs-workspace/compare/ngx-numeric-range-form-field@5.0.0...ngx-numeric-range-form-field@5.1.0) (2026-04-25)


### Features

* **ngx-numeric-range-form-field:** quality-pass — fix ±Infinity, expose label/native/error-kind APIs, a11y wiring ([#44](https://github.com/dineeek/ngx-libs-workspace/issues/44)) ([783cb2c](https://github.com/dineeek/ngx-libs-workspace/commit/783cb2c3237c883828a72bed811e71177b1a84f9))

## [5.0.0] - 2026-04-24

### ⚠ BREAKING CHANGES

- Re-homed into the
  [ngx-libs-workspace](https://github.com/dineeek/ngx-libs-workspace) monorepo.
  The standalone repo
  [dineeek/ngx-numeric-range-form-field](https://github.com/dineeek/ngx-numeric-range-form-field)
  is kept for historical reference only; future development happens here.
- Peer deps bumped to `@angular/* >=21.0.0 <22.0.0`.
- Standalone-only distribution — the `NgxNumericRangeFormFieldModule` is
  removed; import `NumericRangeFormFieldComponent` directly.
- Forms integration switched from `ControlValueAccessor` / `formControlName` to
  Signal Forms `FormValueControl` / `[formField]`.
- `@angular/material` and `@angular/cdk` are no longer peer dependencies. The
  component owns its outlined styling via CSS custom properties.
- Public shape reduced to a single component — the previous container + control
  split is merged into `NumericRangeFormFieldComponent`. The old
  `NumericRangeFormFieldContainerComponent` and
  `NumericRangeFormFieldControlComponent` are removed.
- Inputs removed: `appearance`, `floatLabel`, `dynamicSyncValidators`,
  `errorStateMatcher`, `requiredErrorMessage`, `minimumErrorMessage`,
  `maximumErrorMessage`, `invalidRangeErrorMessage`. Error presentation is now
  the consumer's concern — read `field().errors()` from the `form()`.
- Outputs removed: `blurred`, `enterPressed`, `numericRangeChanged`. `value` is
  a `model()` and propagates through the schema; DOM events can be attached
  directly in consumer templates.
- `INumericRange` now allows `null` on each side:
  `type INumericRange = { minimum: number | null; maximum: number | null }`. The
  composite value itself may also be `null` when both sides are cleared.
- The `NumericRangeFormService`, `NumericRangeStateMatcher`, and the
  `numericRangeValues` imperative validator are removed.

### Added

- `numericRangeOrderValid(path)` validator helper for `form()` schemas. Emits
  `{ kind: 'invalidRange' }` when `maximum < minimum`.
- `numericRangeBounds(path, { min, max })` validator helper. Emits
  `{ kind: 'min' }` when either side is below the floor and `{ kind: 'max' }`
  when either side is above the ceiling; both carry a human-readable `message`.
  Either bound is optional.
- `numericRangeBothFilled(path)` validator helper. Emits
  `{ kind: 'incomplete' }` until both sides are populated — stricter than
  `required(p)`, which only asserts the composite is not `null`.
- `numericRangeWidth(path, { min, max })` validator helper. Constrains the
  _span_ (`maximum - minimum`). Emits `{ kind: 'minWidth' }` when the span is
  below `bounds.min` and `{ kind: 'maxWidth' }` when it exceeds `bounds.max`.
  Skipped while either side is `null` or the range is mis-ordered. Either bound
  is optional.
- CSS custom properties (`--ngx-nrff-*`) for font, colors, radius, padding, and
  the gap between the two inputs — reskin without `::ng-deep`.
- SVG reset affordance that appears when a value is present and the field is not
  read-only/disabled.
- ARIA plumbing: `role="group"` on the outer container, per-input `aria-label`
  sourced from the placeholders.

### Removed

- `@angular/material` + `@angular/cdk` runtime dependencies.
- `mat-form-field` / `MatFormFieldControl` integration.
- Per-control dynamic sync / async validators — replace with schema-based
  `validate(path, ...)` / `validateAsync(path, ...)`.

### Migration

```diff
- import { NgxNumericRangeFormFieldModule } from 'ngx-numeric-range-form-field'
+ import {
+   NumericRangeFormFieldComponent,
+   numericRangeOrderValid
+ } from 'ngx-numeric-range-form-field'

- // AppModule: imports: [NgxNumericRangeFormFieldModule, ReactiveFormsModule]
+ // Standalone: imports: [NumericRangeFormFieldComponent, FormField]

- form = new FormGroup({
-   range: new FormControl({ minimum: 10, maximum: 50 }, [Validators.required])
- })
+ rangeValue = signal<INumericRange | null>({ minimum: 10, maximum: 50 })
+ rangeForm = form<INumericRange | null>(this.rangeValue, p => {
+   required(p)
+   numericRangeOrderValid(p)
+ })

- <ngx-numeric-range-form-field formControlName="range" label="Pick a range" />
+ <ngx-numeric-range-form-field [formField]="rangeForm" label="Pick a range" />
```

---

History prior to `5.0.0` lives in the archived
[dineeek/ngx-numeric-range-form-field](https://github.com/dineeek/ngx-numeric-range-form-field/blob/main/ngx-numeric-range-form-field/projects/ngx-numeric-range-form-field)
repo.
