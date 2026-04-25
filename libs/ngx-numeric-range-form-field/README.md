# ngx-numeric-range-form-field

A reactive Angular custom form control for a composite **numeric range** — two
number inputs (minimum, maximum) exposed as a single value. Built on **Angular
21 Signal Forms** (`FormValueControl`) with no `ControlValueAccessor`, no
Angular Material, no third-party runtime dependencies.

![ngx-numeric-range-form-field](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-numeric-range-form-field/screenshots/02-filled.png)

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-numeric-range-form-field"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-numeric-range-form-field.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-numeric-range-form-field"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-numeric-range-form-field.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/ngx-numeric-range-form-field"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/ngx-numeric-range-form-field?style=flat-square"></a>
</p>

[![CI](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

**[Live demo](https://dineeek.github.io/ngx-libs-workspace/ngx-numeric-range-form-field)**
· **[Changelog](./CHANGELOG.md)**

## Features

- Two-input composite numeric range rendered as one field
- Plug & play with Angular **Signal Forms** via `FormValueControl`
  (`[formField]`)
- Ships four composable validator helpers — `numericRangeOrderValid`,
  `numericRangeBounds`, `numericRangeBothFilled`, `numericRangeWidth`
- Typed `NumericRangeErrorKind` contract for error-key matching
- Schema-driven validation (`required`, `readonly`, `disabled`, `validate`, …)
  owned by the consumer's `form()` definition
- Accessible by default — visible label wires to the group via
  `aria-labelledby`; per-input announcements compose `<group> <side>`
- Native numeric-input attributes pass-through (`step`, `autocomplete`, per-side
  `name` / `min` / `max`)
- Custom outlined field styling — reskin via CSS custom properties without
  `::ng-deep`
- Tree-shakable (`sideEffects: false`)
- Zero runtime dependencies — no Angular Material, no CDK

> `@angular/forms/signals` is marked `@experimental 21.0.0`. Consumers of
> `ngx-numeric-range-form-field@5.x` adopt the same experimental surface.

## At a glance

|                                                                                                                                                      |                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Empty**<br/>![empty](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-numeric-range-form-field/screenshots/01-empty.png)           | **Filled**<br/>![filled](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-numeric-range-form-field/screenshots/02-filled.png)                      |
| **Read-only**<br/>![readonly](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-numeric-range-form-field/screenshots/03-readonly.png) | **Invalid order**<br/>![invalid](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-numeric-range-form-field/screenshots/04-error-invalid-range.png) |

## Install

```shell
npm install ngx-numeric-range-form-field
```

Peer dependencies: `@angular/common`, `@angular/core`, `@angular/forms` (all
`>=21.0.0 <22.0.0`).

## Usage

```typescript
import { Component, signal } from '@angular/core'
import { form, FormField, required } from '@angular/forms/signals'
import {
  INumericRange,
  NumericRangeFormFieldComponent,
  numericRangeOrderValid
} from 'ngx-numeric-range-form-field'

@Component({
  selector: 'app-range-demo',
  standalone: true,
  imports: [NumericRangeFormFieldComponent, FormField],
  template: `
    <ngx-numeric-range-form-field
      [formField]="rangeForm"
      label="Pick a range"
    />
  `
})
export class RangeDemoComponent {
  readonly rangeValue = signal<INumericRange | null>({
    minimum: 10,
    maximum: 50
  })

  readonly rangeForm = form<INumericRange | null>(this.rangeValue, p => {
    required(p)
    numericRangeOrderValid(p)
  })
}
```

The emitted value type:

```typescript
type INumericRange = {
  minimum: number | null
  maximum: number | null
}
```

Either side may be `null` to represent a half-filled range. When both sides are
`null`, the value itself becomes `null`.

## Inputs

All inputs are signal inputs. Inputs marked **(schema-driven)** are
automatically written by the `FormField` directive from the attached `form()`
schema — bind them directly only when using the component without `[formField]`.

| Input                      | Type                                               | Default         | Description                                                                                                                                               |
| -------------------------- | -------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                    | `string`                                           | `''`            | Visible label rendered above the field. When set, becomes the group's `aria-labelledby` target.                                                           |
| `minPlaceholder`           | `string`                                           | `'From'`        | Placeholder for the minimum input.                                                                                                                        |
| `maxPlaceholder`           | `string`                                           | `'To'`          | Placeholder for the maximum input.                                                                                                                        |
| `minLabel`                 | `string \| null`                                   | `null`          | Override the minimum input's accessible name. Defaults to `minPlaceholder` when `null`.                                                                   |
| `maxLabel`                 | `string \| null`                                   | `null`          | Override the maximum input's accessible name. Defaults to `maxPlaceholder` when `null`.                                                                   |
| `resetLabel`               | `string`                                           | `'Reset range'` | `aria-label` for the reset (✕) button.                                                                                                                    |
| `resettable`               | `boolean`                                          | `true`          | Show the reset (✕) button when a value is present.                                                                                                        |
| `minReadonly`              | `boolean`                                          | `false`         | Make the minimum input read-only while the maximum remains editable.                                                                                      |
| `maxReadonly`              | `boolean`                                          | `false`         | Mirror of `minReadonly` for the maximum input.                                                                                                            |
| `step`                     | `number \| string \| null`                         | `null`          | Native `step` attribute forwarded to both inputs (e.g. `0.5`).                                                                                            |
| `autocomplete`             | `string \| null`                                   | `null`          | Native `autocomplete` attribute forwarded to both inputs (e.g. `'off'`).                                                                                  |
| `minName` / `maxName`      | `string \| null`                                   | `null`          | Per-side native `name` attribute — useful inside a native `<form>`.                                                                                       |
| `minMin` / `minMax`        | `number \| string \| null`                         | `null`          | Per-side native HTML `min` / `max` attributes for the **minimum** input. Steers the browser spinner only — schema validation remains the source of truth. |
| `maxMin` / `maxMax`        | `number \| string \| null`                         | `null`          | Per-side native HTML `min` / `max` for the **maximum** input.                                                                                             |
| `value` (schema-driven)    | `INumericRange \| null`                            | `null`          | Composite value. Two-way via `[(value)]` or through `form()`.                                                                                             |
| `disabled` (schema-driven) | `boolean`                                          | `false`         | Disable both inputs.                                                                                                                                      |
| `readonly` (schema-driven) | `boolean`                                          | `false`         | Render both inputs read-only.                                                                                                                             |
| `required` (schema-driven) | `boolean`                                          | `false`         | Show the required marker on the label. Visual flag — the actual validity comes from your `form()` schema.                                                 |
| `touched` (schema-driven)  | `boolean`                                          | `false`         | Marks the field as touched — flips the invalid styling on when paired with `errors`.                                                                      |
| `errors` (schema-driven)   | `readonly ValidationError.WithOptionalFieldTree[]` | `[]`            | Error list. Non-empty + touched paints the field red.                                                                                                     |

## Schema validators

The lib ships four helpers that compose into any `form()` schema. Unless noted
otherwise they treat a `null` on either side as "not yet set" and pass in that
case — pair them with `required(p)` or `numericRangeBothFilled(p)` when
"half-filled" should be rejected.

### `numericRangeOrderValid(path)`

Fails with `{ kind: 'invalidRange' }` when `maximum < minimum`.

![invalid range](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-numeric-range-form-field/screenshots/04-error-invalid-range.png)

```typescript
import { numericRangeOrderValid } from 'ngx-numeric-range-form-field'

rangeForm = form<INumericRange | null>(this.rangeValue, p => {
  numericRangeOrderValid(p)
})
```

### `numericRangeBounds(path, { min, max })`

Keeps both sides within consumer-supplied bounds. Emits
`{ kind: 'min', message: 'Minimum must be at least …' }` when a side is below
the floor and `{ kind: 'max', message: 'Maximum must not exceed …' }` when a
side is above the ceiling. Pass `min` or `max` alone for one-sided bounds.

![bounds error](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-numeric-range-form-field/screenshots/05-error-bounds.png)

```typescript
import { numericRangeBounds } from 'ngx-numeric-range-form-field'

rangeForm = form<INumericRange | null>(this.rangeValue, p => {
  numericRangeBounds(p, { min: 1, max: 10 })
})
```

### `numericRangeBothFilled(path)`

Fails with `{ kind: 'incomplete' }` until **both** sides are populated.
`required(p)` alone only checks that the composite value is not `null`, so
`{ minimum: 5, maximum: null }` passes it — use this helper when you need the
stronger guarantee.

```typescript
import { numericRangeBothFilled } from 'ngx-numeric-range-form-field'

rangeForm = form<INumericRange | null>(this.rangeValue, p => {
  numericRangeBothFilled(p)
})
```

### `numericRangeWidth(path, { min, max })`

Constrains the _span_ of the range (`maximum - minimum`), not the endpoints.
Emits `{ kind: 'minWidth' }` when the span is below `bounds.min` and
`{ kind: 'maxWidth' }` when it exceeds `bounds.max`; both carry a readable
`message`. Skipped while either side is `null` or the range is mis-ordered (let
`numericRangeOrderValid` own that case).

```typescript
import { numericRangeWidth } from 'ngx-numeric-range-form-field'

rangeForm = form<INumericRange | null>(this.rangeValue, p => {
  numericRangeWidth(p, { min: 5, max: 30 })
})
```

Reading errors in a template:

```html
@for (err of rangeForm().errors(); track $index) {
<p class="error">{{ err.message || err.kind }}</p>
}
```

### Typed error-kind contract

Filter errors by typed constants instead of duplicating string literals:

```typescript
import { NumericRangeErrorKind } from 'ngx-numeric-range-form-field'

const hasOrderError = rangeForm()
  .errors()
  .some(e => e.kind === NumericRangeErrorKind.OutOfOrder)
```

| Constant                           | Emitted by                         | `kind` value     |
| ---------------------------------- | ---------------------------------- | ---------------- |
| `NumericRangeErrorKind.OutOfOrder` | `numericRangeOrderValid`           | `'invalidRange'` |
| `NumericRangeErrorKind.BoundsMin`  | `numericRangeBounds` (lower bound) | `'min'`          |
| `NumericRangeErrorKind.BoundsMax`  | `numericRangeBounds` (upper bound) | `'max'`          |
| `NumericRangeErrorKind.Incomplete` | `numericRangeBothFilled`           | `'incomplete'`   |
| `NumericRangeErrorKind.WidthMin`   | `numericRangeWidth` (lower span)   | `'minWidth'`     |
| `NumericRangeErrorKind.WidthMax`   | `numericRangeWidth` (upper span)   | `'maxWidth'`     |

The string values match the kinds the validators emit today, so existing
comparisons against the raw strings keep working.

## Accessibility

When `label` is set the component wires the visible label to the `role="group"`
via `aria-labelledby` using stable per-instance IDs, and each input's
`aria-label` composes `<group label> <side label>` — a screen reader announces
e.g. _"Price range From"_ and _"Price range To"_ instead of just _"From"_ /
_"To"_. Override the per-side announcement with `minLabel` / `maxLabel`, or the
reset button announcement with `resetLabel`.

## Styling

The component ships a minimal outlined field. Override these custom properties
on the host (or anywhere in the cascade) to restyle:

| Property                        | Default               |
| ------------------------------- | --------------------- |
| `--ngx-nrff-font-family`        | `inherit`             |
| `--ngx-nrff-font-size`          | `0.95rem`             |
| `--ngx-nrff-label-font-size`    | `0.8rem`              |
| `--ngx-nrff-label-color`        | `rgba(0, 0, 0, 0.6)`  |
| `--ngx-nrff-text-color`         | `rgba(0, 0, 0, 0.87)` |
| `--ngx-nrff-placeholder-color`  | `rgba(0, 0, 0, 0.4)`  |
| `--ngx-nrff-border-color`       | `rgba(0, 0, 0, 0.23)` |
| `--ngx-nrff-border-hover-color` | `rgba(0, 0, 0, 0.52)` |
| `--ngx-nrff-focus-color`        | `#1976d2`             |
| `--ngx-nrff-error-color`        | `#b3261e`             |
| `--ngx-nrff-background`         | `transparent`         |
| `--ngx-nrff-disabled-color`     | `rgba(0, 0, 0, 0.38)` |
| `--ngx-nrff-radius`             | `6px`                 |
| `--ngx-nrff-padding-y`          | `10px`                |
| `--ngx-nrff-padding-x`          | `12px`                |
| `--ngx-nrff-gap`                | `8px`                 |

## License

MIT License — Copyright (c) 2022-2026 Dino Klicek
