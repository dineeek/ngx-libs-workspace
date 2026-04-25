# ngx-phone-form-field

A reactive Angular custom form control for **international phone numbers** —
country picker with flags + national-number input rendered as a single field,
exposed as one E.164 string. Built on **Angular 21 Signal Forms**
(`FormValueControl`) with no `ControlValueAccessor`, no Angular Material, no
CDK.

![ngx-phone-form-field](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-phone-form-field/screenshots/02-filled.png)

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-phone-form-field"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-phone-form-field.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-phone-form-field"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-phone-form-field.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/ngx-phone-form-field"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/ngx-phone-form-field?style=flat-square"></a>
</p>

[![CI](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

**[Live demo](https://dineeek.github.io/ngx-libs-workspace/ngx-phone-form-field)**
· **[Changelog](./CHANGELOG.md)**

## Features

- One composite field — country selector + national-number input — with a single
  E.164 string value (`'+12015550123'`)
- Plug & play with Angular **Signal Forms** via `FormValueControl`
  (`[formField]`)
- **AsYouType formatting** powered by `libphonenumber-js/max` (full metadata,
  line-type aware)
- **Country auto-detect** from `navigator.language` — overridable per field with
  `initialCountry`
- **Custom country list** — pass a `[countries]` subset (e.g. only the countries
  you ship to) and the picker filters automatically
- Built-in **search-by-name / dial-code** popover with full keyboard navigation
  — no Material, no CDK
- Ships four composable validator helpers — `phoneValid`, `phonePossible`,
  `phoneCountryIn`, `phoneTypeIn`
- Schema-driven validation (`required`, `readonly`, `disabled`, `validate`, …)
  owned by the consumer's `form()` definition
- Custom outlined field styling — reskin via CSS custom properties without
  `::ng-deep`
- SVG flags via
  [`country-flag-icons`](https://www.npmjs.com/package/country-flag-icons)
- Tree-shakable (`sideEffects: false`)

> `@angular/forms/signals` is marked `@experimental 21.0.0`. Consumers of
> `ngx-phone-form-field@1.x` adopt the same experimental surface.

## At a glance

|                                                                                                                                                    |                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Empty**<br/>![empty](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-phone-form-field/screenshots/01-empty.png)                 | **Filled (formatted)**<br/>![filled](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-phone-form-field/screenshots/02-filled.png) |
| **Country picker**<br/>![picker](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-phone-form-field/screenshots/03-picker-open.png) | **Type to search**<br/>![search](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-phone-form-field/screenshots/04-search.png)     |

## Install

```shell
npm install ngx-phone-form-field
```

`libphonenumber-js` and `country-flag-icons` are bundled as runtime dependencies
— no extra install needed.

Peer dependencies: `@angular/common`, `@angular/core`, `@angular/forms` (all
`>=21.0.0 <22.0.0`).

## Usage

```typescript
import { Component, signal } from '@angular/core'
import { form, FormField, required } from '@angular/forms/signals'
import { PhoneFormFieldComponent, phoneValid } from 'ngx-phone-form-field'

@Component({
  selector: 'app-phone-demo',
  standalone: true,
  imports: [PhoneFormFieldComponent, FormField],
  template: `
    <ngx-phone-form-field
      [formField]="phoneForm"
      label="Mobile number"
      initialCountry="US"
    />
  `
})
export class PhoneDemoComponent {
  readonly phoneValue = signal<string | null>(null)

  readonly phoneForm = form<string | null>(this.phoneValue, p => {
    required(p)
    phoneValid(p)
  })
}
```

The emitted value type is `string | null`:

- **Empty input** — `null`.
- **Fully valid** — a real [E.164](https://en.wikipedia.org/wiki/E.164) string
  (e.g. `'+12015550123'`).
- **In-progress typing** — a partial `+<dialcode><digits>` string while the user
  is still entering enough digits for `libphonenumber-js` to recognise a number
  (e.g. `'+12'` after typing the second digit). This lets consumers observe
  progress in real time; pair the component with the `phoneValid()` validator
  below if you need strict E.164 validity before accepting the value.

If `initialCountry` is omitted, the field auto-detects the country from
`navigator.language` and falls back to `'US'`.

## Country codes & line types

Anywhere this lib accepts a country (the `[countries]` input, `initialCountry`,
the `phoneCountryIn` validator) it expects an **ISO 3166-1 alpha-2** code typed
as `CountryCode` from
[`libphonenumber-js`](https://www.npmjs.com/package/libphonenumber-js) — that's
the same alphabet libphonenumber understands when it parses numbers, so the lib
doesn't fork or re-define the set.

Both types are **re-exported** from this package so you don't need to add
`libphonenumber-js` as a direct dependency of your app:

```typescript
import { CountryCode, NumberType } from 'ngx-phone-form-field'
//                                       ^ originally from libphonenumber-js/max

const ALLOWED: readonly CountryCode[] = ['US', 'GB', 'DE', 'FR', 'JP', 'HR']
const PHONE_TYPES: readonly NumberType[] = ['MOBILE', 'FIXED_LINE_OR_MOBILE']
```

| Type          | Re-exported from        | Used by                                                                                            |
| ------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `CountryCode` | `libphonenumber-js/max` | `[countries]`, `initialCountry`, `phoneCountryIn(path, countries)`, the `IPhoneCountry.iso2` field |
| `NumberType`  | `libphonenumber-js/max` | `phoneTypeIn(path, types)` — values like `'MOBILE'`, `'FIXED_LINE'`, `'TOLL_FREE'`, etc.           |

If you'd rather import directly from libphonenumber-js (e.g. you already use it
elsewhere),
`import type { CountryCode, NumberType } from 'libphonenumber-js/max'` is
interchangeable.

## Restricting the country list

The picker shows the full curated country list by default. Pass `[countries]` to
expose only the subset you support — the validator helper
[`phoneCountryIn`](#phonecountryinpath-countries) enforces the same constraint
on values that arrive from outside the picker (e.g. paste, autofill,
patchValue).

```typescript
import {
  CountryCode,
  PhoneFormFieldComponent,
  phoneCountryIn,
  phoneValid
} from 'ngx-phone-form-field'

const ALLOWED: readonly CountryCode[] = ['US', 'GB', 'DE', 'FR', 'JP', 'HR']

@Component({
  imports: [PhoneFormFieldComponent, FormField],
  template: `
    <ngx-phone-form-field
      [formField]="phoneForm"
      [countries]="allowed"
      label="Phone (US, GB, DE, FR, JP, HR)"
      initialCountry="GB"
    />
  `
})
export class RestrictedPhoneComponent {
  readonly allowed = ALLOWED
  readonly phoneValue = signal<string | null>(null)
  readonly phoneForm = form<string | null>(this.phoneValue, p => {
    phoneValid(p)
    phoneCountryIn(p, ALLOWED)
  })
}
```

Need a longer subset? Filter the curated list directly:

```typescript
import { getDefaultCountries } from 'ngx-phone-form-field'

// Every European country libphonenumber-js knows about.
const europe = getDefaultCountries()
  .filter(c =>
    [
      'AD',
      'AL',
      'AT',
      'BA',
      'BE',
      'BG',
      'BY',
      'CH',
      'CY',
      'CZ',
      'DE',
      'DK',
      'EE',
      'ES',
      'FI',
      'FR',
      'GB',
      'GR',
      'HR',
      'HU',
      'IE',
      'IS',
      'IT',
      'LI',
      'LT',
      'LU',
      'LV',
      'MC',
      'MD',
      'ME',
      'MK',
      'MT',
      'NL',
      'NO',
      'PL',
      'PT',
      'RO',
      'RS',
      'RU',
      'SE',
      'SI',
      'SK',
      'SM',
      'UA',
      'VA'
    ].includes(c.iso2)
  )
  .map(c => c.iso2)
```

## Schema validators

All four helpers compose into any `form()` schema. They treat `null` / empty as
"not yet set" and pass — pair with `required(p)` when a value is mandatory.

### `phoneValid(path)`

Fails with `{ kind: 'invalidPhone' }` when the value isn't a fully valid phone
number for its detected country (wrong length, wrong prefix, unparseable). Use
this for the strictest check.

```typescript
import { phoneValid } from 'ngx-phone-form-field'

phoneForm = form<string | null>(this.phoneValue, p => {
  phoneValid(p)
})
```

### `phonePossible(path)`

Looser variant — checks that the digit count is _possible_ for some country
without confirming the prefix is in service. Cheaper than `phoneValid` and more
permissive (e.g. accepts numbers in number ranges that aren't yet allocated).
Fails with `{ kind: 'notPossiblePhone' }`.

```typescript
import { phonePossible } from 'ngx-phone-form-field'

phoneForm = form<string | null>(this.phoneValue, p => {
  phonePossible(p)
})
```

### `phoneCountryIn(path, countries)`

Restricts the parsed country to a whitelist of
[`CountryCode`](#country-codes--line-types) values. Fails with
`{ kind: 'disallowedCountry' }`. Combine with `[countries]` on the component to
also constrain the picker.

**Note:** unparseable input (e.g. random text) is treated as "no detected
country, therefore not allowed" and also fails with `disallowedCountry`. If
you'd prefer unparseable values to surface as `invalidPhone` instead, compose
this validator with `phoneValid(p)` first — `phoneValid` will own the
parseability check and `phoneCountryIn` will only see input it can reason about.

![disallowed-country error](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-phone-form-field/screenshots/06-error-disallowed-country.png)

```typescript
import { phoneCountryIn } from 'ngx-phone-form-field'

phoneForm = form<string | null>(this.phoneValue, p => {
  phoneCountryIn(p, ['US', 'GB', 'DE', 'FR', 'JP', 'HR'])
})
```

> When an external value sets a country outside the allowed list, the picker
> shows a neutral globe placeholder — the validator surfaces the rejection in
> `field().errors()` for your error UI.

### `phoneTypeIn(path, types)`

Restricts the phone-line type — useful for "mobile only" fields, or excluding
premium-rate / shared-cost numbers. Fails with
`{ kind: 'disallowedPhoneType' }`. Backed by `libphonenumber-js/max`'s line
metadata.

![phone-type error](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-phone-form-field/screenshots/05-error-line-type.png)

```typescript
import { phoneTypeIn } from 'ngx-phone-form-field'

phoneForm = form<string | null>(this.phoneValue, p => {
  required(p)
  phoneValid(p)
  phoneTypeIn(p, ['MOBILE'])
})
```

Allowed `NumberType` values: `'MOBILE'`, `'FIXED_LINE'`,
`'FIXED_LINE_OR_MOBILE'`, `'PREMIUM_RATE'`, `'SHARED_COST'`,
`'PERSONAL_NUMBER'`, `'TOLL_FREE'`, `'VOICEMAIL'`, `'VOIP'`, `'UAN'`.

Reading errors in a template:

```html
@for (err of phoneForm().errors(); track $index) {
<p class="error">{{ err.message || err.kind }}</p>
}
```

## Inputs

All inputs are signal inputs. Inputs marked **(schema-driven)** are
automatically written by the `FormField` directive from the attached `form()`
schema — bind them directly only when using the component without `[formField]`.

| Input                      | Type                                               | Default            | Description                                                                                |
| -------------------------- | -------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `label`                    | `string`                                           | `''`               | Label rendered above the field.                                                            |
| `placeholder`              | `string`                                           | `''`               | Placeholder for the national-number input.                                                 |
| `initialCountry`           | `CountryCode \| null`                              | `null`             | ISO2 country pre-selected on first render. `null` ⇒ auto-detect from `navigator.language`. |
| `countries`                | `readonly CountryCode[] \| null`                   | `null` (= all)     | Subset of countries to expose in the picker.                                               |
| `format`                   | `boolean`                                          | `true`             | Format the displayed value as the user types (AsYouType). The emitted E.164 is unaffected. |
| `searchPlaceholder`        | `string`                                           | `'Search country'` | Placeholder for the country-picker search input.                                           |
| `resettable`               | `boolean`                                          | `true`             | Show the reset (✕) button when a value is present.                                         |
| `value` (schema-driven)    | `string \| null`                                   | `null`             | E.164 value. Two-way via `[(value)]` or through `form()`.                                  |
| `disabled` (schema-driven) | `boolean`                                          | `false`            | Disable the input and the country picker.                                                  |
| `readonly` (schema-driven) | `boolean`                                          | `false`            | Render read-only — locks the input and the picker, hides the reset button.                 |
| `required` (schema-driven) | `boolean`                                          | `false`            | Show the required marker on the label.                                                     |
| `touched` (schema-driven)  | `boolean`                                          | `false`            | Marks the field as touched — flips the invalid styling on when paired with `errors`.       |
| `errors` (schema-driven)   | `readonly ValidationError.WithOptionalFieldTree[]` | `[]`               | Error list. Non-empty + touched paints the field red.                                      |

## Public API

```typescript
import {
  PhoneFormFieldComponent,
  phoneValid,
  phonePossible,
  phoneCountryIn,
  phoneTypeIn,
  getDefaultCountries,
  detectCountry,
  type IPhoneCountry,
  type CountryCode,
  type NumberType
} from 'ngx-phone-form-field'
```

`getDefaultCountries()` returns the curated list (memoized). Each entry:

```typescript
type IPhoneCountry = {
  readonly iso2: CountryCode // 'US', 'GB', 'HR', …
  readonly name: string // English display name via Intl.DisplayNames
  readonly dialCode: string // '1', '44', '385', … (no leading +)
}
```

## Styling

The component ships a minimal outlined field. Override these custom properties
on the host (or anywhere in the cascade) to restyle:

| Property                       | Default                          |
| ------------------------------ | -------------------------------- |
| `--ngx-pff-font-family`        | `inherit`                        |
| `--ngx-pff-font-size`          | `0.95rem`                        |
| `--ngx-pff-label-font-size`    | `0.8rem`                         |
| `--ngx-pff-label-color`        | `rgba(0, 0, 0, 0.6)`             |
| `--ngx-pff-text-color`         | `rgba(0, 0, 0, 0.87)`            |
| `--ngx-pff-placeholder-color`  | `rgba(0, 0, 0, 0.4)`             |
| `--ngx-pff-border-color`       | `rgba(0, 0, 0, 0.23)`            |
| `--ngx-pff-border-hover-color` | `rgba(0, 0, 0, 0.52)`            |
| `--ngx-pff-focus-color`        | `#1976d2`                        |
| `--ngx-pff-error-color`        | `#b3261e`                        |
| `--ngx-pff-background`         | `transparent`                    |
| `--ngx-pff-popover-background` | `#fff`                           |
| `--ngx-pff-popover-shadow`     | `0 8px 24px rgba(0, 0, 0, 0.12)` |
| `--ngx-pff-disabled-color`     | `rgba(0, 0, 0, 0.38)`            |
| `--ngx-pff-radius`             | `6px`                            |
| `--ngx-pff-padding-y`          | `10px`                           |
| `--ngx-pff-padding-x`          | `12px`                           |
| `--ngx-pff-gap`                | `10px`                           |
| `--ngx-pff-popover-max-height` | `280px`                          |

The flag size inside the picker trigger and options is governed by
`--ngx-pff-flag-width` (default `1.4em` in the picker) — override on the host to
scale flags up or down.

## Bundle notes

`libphonenumber-js/max` ships full metadata (~250 KB, line-type aware) — this is
required by `phoneTypeIn`. If you do not need line-type validation and want the
smaller `min` build, alias it via your bundler's `resolve.alias` (webpack/vite)
or `paths` (esbuild) — the rest of the lib's API surface is identical across the
metadata variants.

## License

MIT License — Copyright (c) 2026 Dino Klicek
