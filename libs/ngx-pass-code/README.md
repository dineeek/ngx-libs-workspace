# ngx-pass-code

This library was generated with [Nx](https://nx.dev).

Reactive Angular custom form control component for inserting (OTP) code or
password. Supports Angular version 12+.

![Ngx_pass_code](https://github.com/dineeek/ngx-libs-workspace/blob/main/libs/ngx-pass-code/ngx_pass_code_example.gif)

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-pass-code.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-pass-code.svg?style=flat-square"></a>
</p>

[![Build Status](https://app.travis-ci.com/dineeek/ngx-libs-workspace.svg?branch=main)](https://app.travis-ci.com/dineeek/ngx-libs-workspace)
[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=setup-codecov)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdineeek%2Fngx-libs-workspace.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdineeek%2Fngx-libs-workspace?ref=badge_shield)

# Feature

- Individual character input box.
- Reactive form control.
- Plug & play by providing form control.
- Supports sync validation.
- No 3rd party dependencies.

**[Live demo.](https://dineeek.github.io/ngx-libs-workspace)**

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

  Represents needed length of code.Defaulted to 0.

- #### type

  Represents input type property: 'text' | 'number' |'password'. Type 'password'
  is hiding inserted values. Defined type is also used for casting control
  value. Defaulted to 'text'.

- #### uppercase

  Represent the property to transform user input to uppercase. Defaulted to
  false.

# License

MIT License

Copyright (c) 2022 Dino Klicek
