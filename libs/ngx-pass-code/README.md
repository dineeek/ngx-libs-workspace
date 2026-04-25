# ngx-pass-code

A reactive Angular custom form control for **OTP / pass-code** input — one box
per character, with validation, autofocus, autoblur and paste-anywhere support.
Built on **Angular 21 Signal Forms** (`FormValueControl`) with no
`ControlValueAccessor`, no Angular Material, no third-party runtime
dependencies.

![ngx-pass-code](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/screenshots/02-text-filled.png)

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-pass-code.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-pass-code.svg?style=flat-square"></a>
</p>

[![CI](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

**[Live demo](https://dineeek.github.io/ngx-libs-workspace/ngx-pass-code)** ·
**[Stackblitz](https://stackblitz.com/edit/ngx-pass-code)** ·
**[Changelog](./CHANGELOG.md)**

## Features

- One input box per character
- Plug & play with Angular **Signal Forms** via `FormValueControl`
  (`[formField]`)
- Ships `passCodeComplete(path, length)` — opinionated exact-length validator
  composable into any `form()` schema
- Schema-driven validation (`required`, `pattern`, `validate`, …) owned by the
  consumer's `form()`
- Keyboard navigation: auto next/previous, backspace, arrow keys
- Paste anywhere — fills left-to-right, sanitizes per `type`, truncates to
  `length`, focuses the first empty slot (or blurs when `autoblur`)
- Autofocus the first input, autoblur the last input on completion
- Three input modes: `text`, `number`, `password` (masked)
- Standalone component — no NgModule required in consumer apps
- Tree-shakable (`sideEffects: false`)
- Zero runtime dependencies

> `@angular/forms/signals` is marked `@experimental 21.0.0`. Consumers of
> `ngx-pass-code@2.x` adopt the same experimental surface.

## At a glance

|                                                                                                                                           |                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Empty (autofocused)**<br/>![empty](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/screenshots/01-empty.png) | **Text code**<br/>![text](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/screenshots/02-text-filled.png)          |
| **Number PIN**<br/>![number](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/screenshots/03-number.png)        | **Password (masked)**<br/>![password](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/screenshots/04-password.png) |

## Install

```shell
npm install ngx-pass-code
```

## Angular compatibility

| Library version | Angular    | Forms API                               |
| --------------- | ---------- | --------------------------------------- |
| `1.x`           | `>=12 <18` | Reactive Forms (`ControlValueAccessor`) |
| `2.x`           | `>=21 <22` | Signal Forms (`FormValueControl`)       |

Peer dependencies for `2.x`: `@angular/common`, `@angular/core`,
`@angular/forms` `>=21.0.0 <22.0.0`, `rxjs ^7.8.0`.

## Usage

`PassCodeComponent` implements the Signal Forms
`FormValueControl<string | number | null>` contract. Bind it with `[formField]`
to a field produced by `form()`:

```typescript
import { Component, signal } from '@angular/core'
import { form, pattern, FormField } from '@angular/forms/signals'
import { PassCodeComponent, passCodeComplete } from 'ngx-pass-code'

@Component({
  selector: 'app-login',
  imports: [PassCodeComponent, FormField],
  template: `
    <ngx-pass-code
      [formField]="codeForm"
      [length]="5"
      type="text"
      [uppercase]="true"
      [autofocus]="true"
    />
  `
})
export class LoginComponent {
  protected readonly code = signal<string | number | null>(null)
  protected readonly codeForm = form<string | number | null>(this.code, p => {
    passCodeComplete(p, 5)
    pattern(p as never, /^[A-Z0-9]{5}$/)
  })
}
```

The component does not run validators itself; it forwards the field's `errors`
and `touched` state to the UI and flips to the `invalid-input` class only once
both are present. Validation rules (`passCodeComplete`, `pattern`, custom
`validate(...)`) live in your `form()` schema.

## Inputs

All inputs are signal inputs (`input()`):

| Input          | Type                                                                                  | Default  | Description                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `length`       | `number` (required)                                                                   | —        | Number of individual input boxes to render.                                                                                                            |
| `type`         | `'text' \| 'number' \| 'password'`                                                    | `'text'` | Input type. `'password'` hides inserted characters. Used to cast the emitted control value.                                                            |
| `uppercase`    | `boolean`                                                                             | `false`  | Uppercase-transform displayed value and control value.                                                                                                 |
| `autofocus`    | `boolean`                                                                             | `false`  | Focus the first input on render.                                                                                                                       |
| `autoblur`     | `boolean`                                                                             | `false`  | Remove focus from the last input once it is filled.                                                                                                    |
| `autocomplete` | `string`                                                                              | `''`     | Mirrored to the `autocomplete` attribute on every slot. Use `'one-time-code'` to opt into Safari/iOS SMS-OTP autofill. Empty string = no attribute.    |
| `inputmode`    | `'text' \| 'numeric' \| 'decimal' \| 'tel' \| 'search' \| 'email' \| 'url' \| 'none'` | `''`     | Mirrored to the `inputmode` attribute on every slot. Use `'numeric'` to get the digits-only on-screen keyboard on mobile. Empty string = no attribute. |

The `value` (model signal), `touched` (model signal), `disabled`, and `errors`
properties are bound automatically by the `[formField]` directive from the
parent `form()`. You can still bind `[(value)]` directly if you are not using
Signal Forms.

### SMS one-time-code autofill

```html
<ngx-pass-code
  [formField]="codeForm"
  [length]="6"
  type="text"
  inputmode="numeric"
  autocomplete="one-time-code"
/>
```

`autocomplete="one-time-code"` lets Safari/iOS surface the OTP straight from the
SMS notification. Pair with `inputmode="numeric"` on mobile to get the digit
keypad without forcing `type="number"` (which drops leading zeros — see note
below).

### Numeric mode and leading zeros

`type="number"` casts the control value to a JavaScript `number`, so a code like
`01234` is emitted as `1234` and re-rendered into 4 slots, not 5. For PIN or OTP
flows where leading zeros must be preserved, prefer:

```html
<ngx-pass-code
  [formField]="codeForm"
  [length]="6"
  type="text"
  inputmode="numeric"
  autocomplete="one-time-code"
/>
```

`type="text"` keeps the value a `string` (`'012345'`), `inputmode="numeric"`
still gives the digit-only keypad on mobile, and paste-anywhere stripping is
unchanged for the text mode.

## Theming

All visual properties of the slot inputs are exposed as CSS custom properties on
the component host. Override them with any CSS selector that targets
`ngx-pass-code` — no `::ng-deep` needed.

| Custom property                  | Default                               |
| -------------------------------- | ------------------------------------- |
| `--ngx-pass-code-slot-width`     | `44px`                                |
| `--ngx-pass-code-slot-min-width` | `32px`                                |
| `--ngx-pass-code-slot-height`    | `54px`                                |
| `--ngx-pass-code-slot-gap`       | `4px`                                 |
| `--ngx-pass-code-slot-radius`    | `6px`                                 |
| `--ngx-pass-code-slot-bg`        | `transparent`                         |
| `--ngx-pass-code-color`          | `#0c0c0d`                             |
| `--ngx-pass-code-border-color`   | `#aeaeb5`                             |
| `--ngx-pass-code-border-width`   | `2px`                                 |
| `--ngx-pass-code-invalid-color`  | `#b90d0d`                             |
| `--ngx-pass-code-font-family`    | `'Helvetica Neue', Arial, sans-serif` |
| `--ngx-pass-code-font-size`      | `1.75rem`                             |
| `--ngx-pass-code-font-weight`    | `400`                                 |

```css
ngx-pass-code {
  --ngx-pass-code-slot-width: 56px;
  --ngx-pass-code-slot-height: 64px;
  --ngx-pass-code-border-color: #4a90e2;
  --ngx-pass-code-invalid-color: #e94e3b;
}
```

## Validation

Validation is entirely driven by the consumer's `form()` schema. The library
ships `passCodeComplete(path, length)` for the common "every slot must be
filled" rule — Signal Forms' `required` only checks non-nullish, so a partially
filled control would otherwise report `Valid`.

![incomplete state](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/screenshots/05-incomplete.png)

```typescript
import { passCodeComplete } from 'ngx-pass-code'
import { form, pattern } from '@angular/forms/signals'

form(code, p => {
  passCodeComplete(p, 5) // all 5 slots filled
  pattern(p as never, /^[A-Z0-9]{5}$/) // charset
})
```

`passCodeComplete` emits a `{ kind: 'incomplete' }` error when the concatenated
value is shorter than `length`.

## Public directives

`PassCodeComponent` is the recommended entry point — it imports the directives
below internally. They are also exported from the package barrel for advanced
use cases (e.g. building your own slot layout):

| Symbol                            | Selector                   | Purpose                                                                                                         |
| --------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `AutofocusFirstInputDirective`    | `[autofocusFirstInput]`    | On `AfterViewInit`, focuses the first descendant `<input>` when its `autofocus` input is `true`.                |
| `FocusNextPreviousInputDirective` | `[focusNextPreviousInput]` | Per-slot keyboard navigation — advances on filled, retreats on Backspace/Delete/ArrowLeft, optional `autoblur`. |
| `TransformInputValueDirective`    | `[transformInputValue]`    | Toggles `text-transform: uppercase` on the host input when its `uppercase` input is `true`.                     |

These directives assume sibling `<input>` elements with `maxlength="1"`. Any
restructuring of the slot layout must preserve that contract.

## Contributing

Development happens in the parent monorepo — see
[ngx-libs-workspace](https://github.com/dineeek/ngx-libs-workspace) for setup,
local commands, and contribution guidelines.

## Releasing

Releases are automated via
[release-please](https://github.com/googleapis/release-please) driven by
Conventional Commits. Merging a `feat:` / `fix:` / `feat!:` commit to `main`
opens or updates a release PR; merging the release PR creates a GitHub Release +
tag `ngx-pass-code@x.y.z` which triggers
[`publish-ngx-pass-code.yml`](../../.github/workflows/publish-ngx-pass-code.yml)
to run `npm publish --provenance --access public`.

Local dry-run:

```shell
pnpm ngx-pass-code:publish:dry-run
```

## License

MIT © Dino Klicek
