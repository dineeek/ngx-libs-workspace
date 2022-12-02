import {
  ChangeDetectionStrategy,
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
  ValidatorFn,
} from '@angular/forms';
import { map, startWith, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ngx-pass-code',
  templateUrl: './pass-code-container.component.html',
  styleUrls: ['./pass-code-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCodeContainerComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  @Input() length = 0;
  @Input() passType: 'text' | 'number' = 'text';

  passCodes!: FormArray<FormControl>;

  private unsubscribe$ = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (value: string | number | null) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  constructor(private controlDirective: NgControl) {
    this.controlDirective.valueAccessor = this;
  }

  ngOnInit(): void {
    // TODO - move to next input after first is written
    // TODO - styling
    // TODO - validation styling
    // TODO - async validation

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
    isDisabled ? this.passCodes.disable() : this.passCodes.enable();
  }

  validate(): ValidationErrors | null {
    return this.passCodes.controls
      .map(control => control.errors)
      .filter(error => error !== null);
  }

  private setSyncValidatorsFromParent(): void {
    const parentValidators = this.controlDirective.control?.validator;

    console.log('PARENT VALIDATORS', parentValidators);
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
    this.passCodes.setValue(splittedValue, { emitEvent: false });
    this.passCodes.updateValueAndValidity({ emitEvent: false });
  }

  private resetValue(): void {
    this.passCodes.controls.forEach((control, i) =>
      control.setValue(null, { emitEvent: false })
    );
    this.passCodes.updateValueAndValidity({ emitEvent: false });
  }

  private propagateValueChanges(): void {
    this.passCodes.valueChanges
      .pipe(
        map(codes => {
          const code = codes.join('');

          if (!code) {
            return null;
          }

          if (this.passCodes.invalid) {
            return null;
          }

          return this.passType === 'text' ? code : parseInt(code);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value: string | number | null) => this.onChange(value));
  }
}
