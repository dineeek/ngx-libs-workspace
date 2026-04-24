import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn
} from '@angular/forms'
import {
  FloatLabelType,
  MatFormFieldAppearance,
  MatFormFieldModule
} from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { NumericRangeFormFieldControlComponent } from '../control/numeric-range-form-field-control.component'
import {
  INumericRange,
  NumericRangeFormGroup
} from '../form/model/numeric-range-field.model'
import { NumericRangeFormService } from '../form/numeric-range-form.service'

@Component({
  selector: 'ngx-numeric-range-form-field',
  templateUrl: './numeric-range-form-field-container.component.html',
  styleUrls: ['./numeric-range-form-field-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    NumericRangeFormFieldControlComponent
  ],
  providers: [NumericRangeFormService]
})
export class NumericRangeFormFieldContainerComponent
  implements OnChanges, OnInit, OnDestroy, ControlValueAccessor, Validator
{
  private readonly controlDirective = inject(NgControl, { self: true })
  private readonly formService = inject(NumericRangeFormService, { host: true })
  private readonly changeDetectorRef = inject(ChangeDetectorRef)

  @Input() label = ''
  @Input() appearance: MatFormFieldAppearance = 'outline'
  @Input() floatLabel: FloatLabelType = 'always'

  @Input() minPlaceholder = 'From'
  @Input() maxPlaceholder = 'To'

  @Input() readonly = false
  @Input() minReadonly = false
  @Input() maxReadonly = false

  @Input() resettable = true

  @Input() required = false
  @Input() requiredErrorMessage = 'Field is required!'

  @Input() minimumErrorMessage = 'Minimum has been reached!'
  @Input() maximumErrorMessage = 'Maximum has exceeded!'
  @Input() invalidRangeErrorMessage = 'Inserted range is not valid!'
  @Input() dynamicSyncValidators: ValidatorFn | ValidatorFn[] | null = null

  @Output() blurred = new EventEmitter<void>()
  @Output() enterPressed = new EventEmitter<void>()
  @Output() numericRangeChanged = new EventEmitter<INumericRange | null>()

  formGroup: NumericRangeFormGroup = this.formService.formGroup
  control = new FormControl()

  private unsubscribe$ = new Subject<void>()

  onTouched: () => void = () => {}

  get minimumControl(): FormControl<number> {
    return this.formService.minimumControl
  }

  get maximumControl(): FormControl<number> {
    return this.formService.maximumControl
  }

  constructor() {
    this.controlDirective.valueAccessor = this
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dynamicSyncValidators']) {
      this.control.setErrors(null)
      this.control.setValidators(this.dynamicSyncValidators)
      this.control.updateValueAndValidity({ emitEvent: false })
    }
  }

  ngOnInit(): void {
    const parent = this.controlDirective.control
    if (!parent) {
      return
    }

    this.setSyncValidator(parent.validator)
    this.setAsyncValidator(parent.asyncValidator)

    parent.setValidators([this.validate.bind(this)])
    parent.updateValueAndValidity({ emitEvent: false })

    this.changeDetectorRef.detectChanges()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  writeValue(value: INumericRange | null): void {
    value === null
      ? this.control.reset()
      : this.control.setValue(value, { emitEvent: false })
  }

  registerOnChange(fn: (value: INumericRange | null) => void): void {
    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(fn)
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable()
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    const errors = {
      ...this.minimumControl.errors,
      ...this.maximumControl.errors
    }

    return Object.keys(errors).length ? errors : null
  }

  onEnterPressed(): void {
    this.enterPressed.emit()
  }

  onBlur(): void {
    this.onTouched()
    this.blurred.emit()
  }

  onRangeValuesChanged(value: INumericRange | null): void {
    this.numericRangeChanged.emit(value)
  }

  onReset(): void {
    this.formGroup.reset()
  }

  private setSyncValidator(validator: ValidatorFn | null): void {
    if (!validator) {
      return
    }

    this.control.addValidators(validator)
    this.control.updateValueAndValidity()
  }

  private setAsyncValidator(asyncValidator: AsyncValidatorFn | null): void {
    if (!asyncValidator) {
      return
    }

    this.control.addAsyncValidators(asyncValidator)
    this.control.updateValueAndValidity()
  }
}
