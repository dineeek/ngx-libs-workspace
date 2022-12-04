# ngx-pass-code

This library was generated with [Nx](https://nx.dev).

Angular custom control component for inserting code or password.

![Numeric range form field](https://github.com/dineeek/ngx-libs-workspace/blob/main/ngx-pass-code/ngx_pass_code_example.png)

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-numeric-range-form-field.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-pass-code"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-pass-code.svg?style=flat-square"></a>
</p>

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdineeek%2Fngx-pass-code.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdineeek%2Fngx-pass-code?ref=badge_shield)

# Feature

- Individual character input box.
- Plug & play by providing form control.
- Supports sync validation.
- No dependencies.

**[View live demo on StackBlitz.](https://ngx-pass-code.stackblitz.io)**

# Install

```shell
npm install ngx-pass-code
```

# Usage

```html
<ngx-pass-code
  formControlName="passCodeControl"
  [length]="5"
  type="text"
  [uppercase]="true"
></ngx-pass-code>
```

The component has several input decorators:

### length

Represents needed length of code.Defaulted to 0.

### type

Represents input type - 'text', 'number', 'password'. Type 'password' is hiding
inserted values. Defined type is also used for casting out form value. Defaulted
to 'text'.

### uppercase

Represent the property to transform user input to uppercase. Defaulted to false.

# License

MIT License

Copyright (c) 2022 Dino Klicek
