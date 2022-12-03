import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { distinctUntilChanged, map, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'ngx-pass-code',
  templateUrl: './pass-code.component.html',
  styleUrls: ['./pass-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCodeComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  @Input() length = 0;
  @Input() passType: 'text' | 'number' | 'password' = 'text';
  @Input() uppercase = false;

  passCodes!: FormArray<FormControl>;
  isInvalidCode = false; // currently validation is triggered only if all controls are invalid

  private unsubscribe$ = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (value: string | number | null) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  constructor(private controlDirective: NgControl) {
    this.controlDirective.valueAccessor = this;
  }

  ngOnInit(): void {
    if (!this.length) {
      return;
    }

    this.passCodes = new FormArray(
      [...new Array(this.length)].map(() => new FormControl(''))
    );

    this.setSyncValidatorsFromParent();
    this.updateParentValidation();
    this.propagateValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(value: string): void {
    // issue - https://github.com/angular/angular/issues/29218
    setTimeout(() => {
      value?.toString().trim() ? this.setValue(value) : this.resetValue();
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.passCodes.disable({ emitEvent: false })
      : this.passCodes.enable({ emitEvent: false });
  }

  validate(): ValidationErrors | null {
    const errors = this.passCodes.controls
      .map(control => control.errors)
      .filter(error => error !== null);

    return errors.length ? errors : null;
  }

  private setSyncValidatorsFromParent(): void {
    const parentValidators = this.controlDirective.control?.validator;

    if (!parentValidators) {
      return;
    }

    this.passCodes.controls.forEach(control => {
      control.setValidators(parentValidators);
    });
    this.passCodes.updateValueAndValidity({ emitEvent: false });
  }

  private updateParentValidation(): void {
    const parentControl = this.controlDirective.control;

    if (!parentControl) {
      return;
    }

    parentControl.setValidators(this.validate.bind(this));
    parentControl.updateValueAndValidity({ emitEvent: false });
  }

  private setValue(value: string): void {
    const splittedValue = value.split('');
    this.passCodes.patchValue(splittedValue, { emitEvent: false });
    this.passCodes.updateValueAndValidity();
  }

  private resetValue(): void {
    const nullValues = Array(this.length).fill(null);
    this.passCodes.patchValue(nullValues, { emitEvent: false });
    this.passCodes.updateValueAndValidity();
  }

  private propagateValueChanges(): void {
    this.passCodes.valueChanges
      .pipe(
        tap(() => {
          this.isInvalidCode = this.validate()?.['length'] === this.length;
        }),
        map(codes => {
          const code = codes.join('');

          if (this.passCodes.invalid || !code) {
            return null;
          }

          if (this.passType === 'number') {
            return parseInt(code);
          }

          return this.uppercase ? code.toUpperCase() : code;
        }),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value: string | number | null) => this.onChange(value));
  }
}
