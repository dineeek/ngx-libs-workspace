import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  NgControl,
  ValidationErrors,
  Validator
} from '@angular/forms'
import { distinctUntilChanged, map, Subject, takeUntil, tap } from 'rxjs'

@Component({
  selector: 'ngx-pass-code',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassCodeComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  @Input() length = 0
  @Input() type: 'text' | 'number' | 'password' = 'text'
  @Input() uppercase = false
  @Input() autofocus = false // set focus on first input
  @Input() autoblur = false // remove focus from last input when filled

  passCodes!: FormArray<FormControl>
  isCodeInvalid = false // validation is triggered only if all controls are invalid

  private initialized = false
  private unsubscribe$ = new Subject<void>()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (value: string | number | null) => {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor(
    private controlDirective: NgControl,
    private cdRef: ChangeDetectorRef
  ) {
    this.controlDirective.valueAccessor = this
  }

  ngOnInit(): void {
    this.passCodes = new FormArray(
      [...new Array(this.length)].map(() => new FormControl(''))
    )

    this.setSyncValidatorsFromParent()
    this.updateParentControlValidation()
    this.propagateViewValueToModel()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  writeValue(value: string): void {
    const stringifyTrimmedValue = value?.toString().trim()
    if (!this.initialized) {
      // issue - https://github.com/angular/angular/issues/29218 - have to know length property before writing any value
      setTimeout(() => {
        this.initialized = true
        this.propagateModelValueToView(stringifyTrimmedValue)
      })
    } else {
      this.propagateModelValueToView(stringifyTrimmedValue)
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    if (!this.initialized) {
      setTimeout(() => {
        this.disableControls(isDisabled)
      })

      return
    }

    this.disableControls(isDisabled)
  }

  validate(): ValidationErrors | null {
    if (this.passCodes.valid) {
      return null
    }

    const errors = this.passCodes.controls
      .map(control => control.errors)
      .filter(error => error !== null)

    return errors.length ? errors : null
  }

  private setSyncValidatorsFromParent(): void {
    const parentValidators = this.controlDirective.control?.validator

    if (!parentValidators) {
      return
    }

    this.passCodes.controls.forEach(control => {
      control.setValidators(parentValidators)
    })
    this.passCodes.updateValueAndValidity({ emitEvent: false })
  }

  private updateParentControlValidation(): void {
    const parentControl = this.controlDirective.control

    if (!parentControl) {
      return
    }

    parentControl.setValidators(this.validate.bind(this))
    parentControl.updateValueAndValidity({ emitEvent: false })
  }

  private propagateModelValueToView(value: string): void {
    value ? this.setValue(value) : this.resetValue()
    this.updateCodeValidity()
    this.cdRef.markForCheck()
  }

  private setValue(value: string): void {
    if (this.type === 'number' && isNaN(parseInt(value))) {
      throw new TypeError(
        'Provided value does not match provided type property number!'
      )
    }

    const splittedValue = value.substring(0, this.length).split('') // remove chars after specified length and split

    if (splittedValue.length < this.length) {
      this.resetValue()
    }

    this.passCodes.patchValue(splittedValue, { emitEvent: false })
  }

  private resetValue(): void {
    const nullValues = Array(this.length).fill(null)
    this.passCodes.patchValue(nullValues, { emitEvent: false })
  }

  private propagateViewValueToModel(): void {
    this.passCodes.valueChanges
      .pipe(
        tap(() => this.updateCodeValidity()),
        map(codes => {
          const code = codes.join('')

          if (this.passCodes.invalid || !code) {
            return null
          }

          if (this.type === 'number') {
            return parseInt(code)
          }

          return this.uppercase ? code.toUpperCase() : code
        }),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value: string | number | null) => this.onChange(value))
  }

  private updateCodeValidity(): void {
    const allControlsAreInvalid = this.validate()?.['length'] === this.length
    this.isCodeInvalid = allControlsAreInvalid && this.passCodes.dirty
    this.controlDirective.control?.updateValueAndValidity({ emitEvent: false })
  }

  private disableControls(isDisabled: boolean): void {
    isDisabled
      ? this.passCodes.disable({ emitEvent: false })
      : this.passCodes.enable({ emitEvent: false })

    this.controlDirective.control?.updateValueAndValidity({ emitEvent: false })
  }
}
