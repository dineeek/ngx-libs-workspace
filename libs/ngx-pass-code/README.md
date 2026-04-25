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

| Input       | Type                               | Default  | Description                                                                                 |
| ----------- | ---------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `length`    | `number` (required)                | —        | Number of individual input boxes to render.                                                 |
| `type`      | `'text' \| 'number' \| 'password'` | `'text'` | Input type. `'password'` hides inserted characters. Used to cast the emitted control value. |
| `uppercase` | `boolean`                          | `false`  | Uppercase-transform displayed value and control value.                                      |
| `autofocus` | `boolean`                          | `false`  | Focus the first input on render.                                                            |
| `autoblur`  | `boolean`                          | `false`  | Remove focus from the last input once it is filled.                                         |

The `value` (model signal), `touched` (model signal), `disabled`, and `errors`
properties are bound automatically by the `[formField]` directive from the
parent `form()`. You can still bind `[(value)]` directly if you are not using
Signal Forms.

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
