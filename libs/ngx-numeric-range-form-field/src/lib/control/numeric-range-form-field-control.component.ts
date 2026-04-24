import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  EventEmitter,
  HostBinding,
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
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  Validator,
  ValidatorFn
} from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { MatFormFieldControl } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import {
  INumericRange,
  NumericRangeFormGroup
} from '../form/model/numeric-range-field.model'
import { NumericRangeFormService } from '../form/numeric-range-form.service'
import { NumericRangeStateMatcher } from '../form/numeric-range-state-matcher'

@Component({
  selector: 'ngx-numeric-range-form-field-control',
  templateUrl: './numeric-range-form-field-control.component.html',
  styleUrls: ['./numeric-range-form-field-control.component.scss'],
  imports: [ReactiveFormsModule, MatInputModule],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: NumericRangeFormFieldControlComponent
    },
    {
      provide: ErrorStateMatcher,
      useClass: NumericRangeStateMatcher
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumericRangeFormFieldControlComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    OnDestroy,
    MatFormFieldControl<INumericRange>,
    ControlValueAccessor,
    Validator
{
  static nextId = 0

  readonly ngControl = inject(NgControl, { self: true })
  private readonly formService = inject(NumericRangeFormService, {
    skipSelf: true
  })

  get value(): INumericRange {
    return this.formGroup.getRawValue() as INumericRange
  }

  @Input()
  set value(value: INumericRange) {
    this.formGroup.patchValue(value)
    this.stateChanges.next()
  }

  get placeholder(): string {
    return this._placeholder
  }

  @Input() set placeholder(value: string) {
    this._placeholder = value
    this.stateChanges.next()
  }

  @Input() minPlaceholder = ''
  @Input() maxPlaceholder = ''
  @Input() readonly = false
  @Input() minReadonly = false
  @Input() maxReadonly = false
  @Input() required = false
  @Input() disabled = false
  @Input() errorStateMatcher!: ErrorStateMatcher
  @Input() autofilled?: boolean
  @Input() dynamicSyncValidators: ValidatorFn | ValidatorFn[] | null = null

  @Output() blurred = new EventEmitter<void>()
  @Output() enterPressed = new EventEmitter<void>()
  @Output() numericRangeChanged = new EventEmitter<INumericRange | null>()

  @HostBinding('class.floated')
  get shouldLabelFloat(): boolean {
    return true
  }

  @HostBinding('attr.aria-describedby')
  userAriaDescribedBy = ''

  @HostBinding()
  id =
    `numeric-range-form-control-id-${NumericRangeFormFieldControlComponent.nextId++}`

  get empty(): boolean {
    return !this.value.minimum && !this.value.maximum
  }

  get errorState(): boolean {
    return this.numericRangeErrorMatcher.isErrorState(
      this.ngControl.control as FormControl,
      this.formGroup
    )
  }

  get minimumControl(): FormControl<number> {
    return this.formService.minimumControl
  }

  get maximumControl(): FormControl<number> {
    return this.formService.maximumControl
  }

  formGroup: NumericRangeFormGroup = this.formService.formGroup

  stateChanges = new Subject<void>()

  focused = false

  controlType = 'numeric-range-form-control'

  numericRangeErrorMatcher = new NumericRangeStateMatcher()

  private unsubscribe$ = new Subject<void>()

  private _placeholder = ''

  onTouched: () => void = () => {}

  constructor() {
    this.ngControl.valueAccessor = this
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dynamicSyncValidators']) {
      this.formService.setDynamicValidators(
        this.dynamicSyncValidators as ValidatorFn | ValidatorFn[]
      )
    }
  }

  ngOnInit(): void {
    const parent = this.ngControl.control
    if (!parent) {
      return
    }

    this.formService.setSyncValidators(parent.validator)
    this.formService.setAsyncValidators(parent.asyncValidator)

    parent.setValidators([this.validate.bind(this)])
    parent.updateValueAndValidity({ emitEvent: false })
  }

  ngDoCheck(): void {
    this.formGroup.markAllAsTouched()
  }

  ngOnDestroy(): void {
    this.stateChanges.complete()
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  writeValue(value: INumericRange | null): void {
    value === null
      ? this.formGroup.reset()
      : this.formGroup.setValue(value, { emitEvent: false })
  }

  registerOnChange(fn: (value: Partial<INumericRange>) => void): void {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(fn)
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
    isDisabled ? this.formGroup.disable() : this.formGroup.enable()

    this.stateChanges.next()
  }

  setDescribedByIds(ids: string[]): void {
    this.userAriaDescribedBy = ids.join(' ')
  }

  onContainerClick(): void {}

  validate(control: AbstractControl) {
    return control.errors
  }

  onEnterPressed(): void {
    if (
      !this.formGroup.errors &&
      !this.minimumControl.errors &&
      !this.maximumControl.errors
    ) {
      this.enterPressed.emit()
    }
  }

  onBlur(): void {
    this.onTouched()
    this.blurred.emit()
  }

  onRangeValuesChanged(): void {
    this.formGroup.errors ||
    this.minimumControl.errors ||
    this.maximumControl.errors
      ? this.numericRangeChanged.emit(null)
      : this.numericRangeChanged.emit(
          this.formGroup.getRawValue() as INumericRange
        )
  }
}
