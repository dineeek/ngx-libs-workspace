import { Injectable } from '@angular/core'
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms'
import { NumericRangeFormGroup } from './model/numeric-range-field.model'
import { numericRangeValues } from './numeric-range.validator'

@Injectable()
export class NumericRangeFormService {
  private form: NumericRangeFormGroup = new FormGroup(
    {
      minimum: new FormControl<number | null>(null, { updateOn: 'blur' }),
      maximum: new FormControl<number | null>(null, { updateOn: 'blur' })
    },
    { validators: numericRangeValues }
  ) as NumericRangeFormGroup

  get minimumControl(): FormControl<number> {
    return this.form.get('minimum') as FormControl<number>
  }

  get maximumControl(): FormControl<number> {
    return this.form.get('maximum') as FormControl<number>
  }

  get formGroup(): NumericRangeFormGroup {
    return this.form
  }

  setDynamicValidators(validators: ValidatorFn | ValidatorFn[]): void {
    if (!validators) {
      return
    }

    this.minimumControl.setErrors(null)
    this.maximumControl.setErrors(null)

    this.minimumControl.setValidators(validators)
    this.maximumControl.setValidators(validators)

    this.minimumControl.updateValueAndValidity({ emitEvent: false })
    this.maximumControl.updateValueAndValidity({ emitEvent: false })
  }

  setSyncValidators(validator: ValidatorFn | null): void {
    if (!validator) {
      return
    }

    this.minimumControl.addValidators(validator)
    this.maximumControl.addValidators(validator)
    this.formGroup.updateValueAndValidity()
  }

  setAsyncValidators(asyncValidator: AsyncValidatorFn | null): void {
    if (!asyncValidator) {
      return
    }

    this.minimumControl.addAsyncValidators(asyncValidator)
    this.maximumControl.addAsyncValidators(asyncValidator)
    this.formGroup.updateValueAndValidity()
  }
}
