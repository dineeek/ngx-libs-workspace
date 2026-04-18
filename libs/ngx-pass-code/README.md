# ngx-pass-code

This library was generated with [Nx](https://nx.dev).

Reactive Angular custom form control component for inserting (OTP) code or
password. Supports Angular version 12+.

![Ngx_pass_code](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/ngx_pass_code_example.gif)

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-pass-code.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-pass-code.svg?style=flat-square"></a>
</p>

[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Feature

- Individual character input box.
- Reactive form control.
- Plug & play by providing form control.
- Supports sync validation.
- No 3rd party dependencies.

**[Live workspace demo](https://dineeek.github.io/ngx-libs-workspace)**

**[Stackblitz](https://stackblitz.com/edit/ngx-pass-code)**

# Install

```shell
npm install ngx-pass-code@latest
```

# Usage

```typescript
@NgModule({
  ...,
  imports: [
    ...,
    NgxPassCodeModule
  ],
})
export class FeatureModule {}
```

```html
<ngx-pass-code
  formControlName="codeControl"
  [length]="5"
  type="text"
  [uppercase]="true"
></ngx-pass-code>
```

### Input property decorators:

- #### length

  Set length of the code (number of inputs). Defaulted to 0.

- #### type

  Set input type property: 'text' | 'number' |'password'. Type 'password' is
  hiding inserted values. Defined type is also used for casting control value.
  Defaulted to 'text'.

- #### uppercase

  Set uppercase inputs value transformation. Defaulted to false.

- #### patterns

  To set pattern validation use Angular Validators.pattern when defining form
  control. Example: new FormControl('', {validators:
  Validators.pattern('[a-zA-z0-9]{1}')}). The `{1}` in pattern expression has to
  be set to 1 because individual inputs.

- #### autofocus - from v1.1.0

  Set focus on the first input code. Defaulted to false.

- #### autoblur - from v1.1.0

  Remove focus from the last input when it is filled. Defaulted to false.

# Angular compatibility

| Library version | Angular    |
| --------------- | ---------- |
| `1.x`           | `>=12 <18` |
| `2.x`           | `>=21 <22` |

# Contributing

Contributions are more than welcome!

# Releasing

Releases are automated via
[release-please](https://github.com/googleapis/release-please) driven by
[Conventional Commits](https://www.conventionalcommits.org/):

1. Merge commits to `main` using Conventional Commit messages (`feat:`, `fix:`,
   `feat!:`, etc.).
2. `release-please` opens/updates a release PR that bumps
   `libs/ngx-pass-code/package.json` and maintains `CHANGELOG.md`.
3. Merging the release PR creates a GitHub Release + tag `ngx-pass-code@x.y.z`.
4. The tag triggers `.github/workflows/publish-ngx-pass-code.yml`, which builds
   the library and runs `npm publish --provenance --access public` using the
   `NPM_TOKEN` repo secret.

To sanity-check a build locally:

```shell
pnpm ngx-pass-code:publish:dry-run
```

# License

MIT License

Copyright (c) 2022 Dino Klicek
