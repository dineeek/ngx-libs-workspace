# ngx-pass-code

Reactive Angular custom form control for OTP / pass-code input — one box per
character, with validation, autofocus, and autoblur.

![Ngx_pass_code](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/ngx_pass_code_example.gif)

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-pass-code.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-pass-code.svg?style=flat-square"></a>
</p>

[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

**[Live demo](https://dineeek.github.io/ngx-libs-workspace)** ·
**[Stackblitz](https://stackblitz.com/edit/ngx-pass-code)** ·
**[Changelog](./CHANGELOG.md)**

## Features

- Individual character input box
- Plug & play with Angular Reactive Forms (`ControlValueAccessor`)
- Sync validator support (via `Validators.pattern`, `Validators.required`, …)
- Keyboard navigation: auto next/previous, backspace, arrow keys
- Autofocus first input, autoblur last input
- Standalone component — no NgModule required in consumer apps
- Tree-shakable (`sideEffects: false`)
- No 3rd-party runtime dependencies

## Install

```shell
npm install ngx-pass-code
# or
pnpm add ngx-pass-code
# or
yarn add ngx-pass-code
```

## Angular compatibility

| Library version | Angular    |
| --------------- | ---------- |
| `1.x`           | `>=12 <18` |
| `2.x`           | `>=21 <22` |

Peer dependencies for `2.x`: `@angular/common`, `@angular/core`,
`@angular/forms` `>=21.0.0 <22.0.0`, `rxjs ^7.8.0`.

## Usage

### Standalone component (recommended, v2+)

```typescript
import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { PassCodeComponent } from 'ngx-pass-code'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, PassCodeComponent],
  template: `
    <ngx-pass-code
      [formControl]="codeControl"
      [length]="5"
      type="text"
      [uppercase]="true"
      [autofocus]="true"
    ></ngx-pass-code>
  `
})
export class LoginComponent {
  codeControl = new FormControl('', {
    validators: [Validators.required, Validators.pattern('[a-zA-Z0-9]{1}')]
  })
}
```

### NgModule (backward-compatible)

`NgxPassCodeModule` is kept as a thin re-export shim so existing NgModule-based
apps keep working without changes.

```typescript
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { NgxPassCodeModule } from 'ngx-pass-code'

@NgModule({
  imports: [ReactiveFormsModule, NgxPassCodeModule]
})
export class FeatureModule {}
```

## Inputs

| Input       | Type                               | Default  | Description                                                                                 |
| ----------- | ---------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `length`    | `number`                           | `0`      | Number of individual input boxes to render.                                                 |
| `type`      | `'text' \| 'number' \| 'password'` | `'text'` | Input type. `'password'` hides inserted characters. Used to cast the emitted control value. |
| `uppercase` | `boolean`                          | `false`  | Uppercase-transform displayed value and control value.                                      |
| `autofocus` | `boolean`                          | `false`  | Focus the first input on render.                                                            |
| `autoblur`  | `boolean`                          | `false`  | Remove focus from the last input once it is filled.                                         |

### Pattern validation

Use Angular's built-in `Validators.pattern` when creating the form control. The
`{1}` quantifier must match the single-character nature of each box:

```typescript
new FormControl('', {
  validators: Validators.pattern('[a-zA-Z0-9]{1}')
})
```

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
