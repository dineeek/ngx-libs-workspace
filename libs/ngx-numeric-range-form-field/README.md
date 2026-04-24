# ngx-numeric-range-form-field

An Angular Material UI numeric range input form field. Implementation is based
on a custom form field and control value accessor which allows inserting range
numbers — minimum and maximum.

<p align="start">
    <a href="https://www.npmjs.com/package/ngx-numeric-range-form-field"><img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/ngx-numeric-range-form-field.svg?style=flat-square"></a>
    <a href="https://www.npmjs.com/package/ngx-numeric-range-form-field"><img alt="npm version" src="https://img.shields.io/npm/v/ngx-numeric-range-form-field.svg?style=flat-square"></a>
</p>

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

**[Live demo](https://dineeek.github.io/ngx-libs-workspace)**

## Features

- Two inputs as one field
- Reactive form field — works via `formControl` / `formControlName`
- Auto range validation + custom sync / async validators
- Standalone component — no NgModule required in consumer apps
- Tree-shakable (`sideEffects: false`)

## Install

```shell
npm install ngx-numeric-range-form-field @angular/material @angular/cdk
```

## Usage

Template:

```html
<form [formGroup]="form">
  <ngx-numeric-range-form-field
    formControlName="range"
    label="Numeric range"
    (blurred)="onBlur()"
    (enterPressed)="onEnter()"
    (numericRangeChanged)="onNumericRangeChanged($event)"
  ></ngx-numeric-range-form-field>
</form>
```

Component:

```typescript
import { Component } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import {
  INumericRange,
  NumericRangeFormFieldContainerComponent
} from 'ngx-numeric-range-form-field'

@Component({
  selector: 'app-range-demo',
  standalone: true,
  imports: [ReactiveFormsModule, NumericRangeFormFieldContainerComponent],
  templateUrl: './range-demo.component.html'
})
export class RangeDemoComponent {
  form = new FormGroup({
    range: new FormControl<INumericRange | null>(
      { minimum: 10, maximum: 100 },
      [Validators.required, Validators.min(10), Validators.max(100)]
    )
  })

  onBlur(): void {
    console.log('Value', this.form.controls.range.value)
  }

  onEnter(): void {
    console.log('Enter pressed!')
  }

  onNumericRangeChanged(value: INumericRange | null): void {
    console.log('Changed value:', value)
  }
}
```

The value emitted matches:

```typescript
type INumericRange = {
  minimum: number
  maximum: number
}
```

### Inputs

- **label** — Field label.
- **appearance** — `MatFormFieldAppearance` (defaults to `outline`).
- **floatLabel** — `FloatLabelType` (defaults to `always`).
- **minPlaceholder / maxPlaceholder** — Placeholders for min / max inputs
  (default `From` / `To`).
- **readonly** — Mark the whole field readonly.
- **minReadonly / maxReadonly** — Mark just one end readonly.
- **resettable** — Show reset icon when value exists (default `true`).
- **required** — Mark the field required.
- **requiredErrorMessage / minimumErrorMessage / maximumErrorMessage /
  invalidRangeErrorMessage** — Customize error copy.
- **dynamicSyncValidators** — Apply sync validators at runtime.

### Outputs

- **blurred** — Emitted on blur.
- **enterPressed** — Emitted on Enter key (only when range is valid).
- **numericRangeChanged** — Emitted on value change. Emits `null` when the range
  is invalid.

## License

MIT License — Copyright (c) 2022 Dino Klicek
