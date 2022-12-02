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
} from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';

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
    this.passCodes = new FormArray(
      [...new Array(this.length)].map(() => new FormControl(''))
    );

    this.propagateValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(value: string): void {
    // issue - https://github.com/angular/angular/issues/29218
    setTimeout(() => {
      value?.toString() ? this.setValue(value) : this.resetValue();
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
    return this.passCodes.errors;
  }

  private setValue(value: string): void {
    const splitted = value.split('');
    this.passCodes.controls.forEach((control, i) =>
      control.setValue(splitted[i], { emitEvent: false })
    );
    this.passCodes.updateValueAndValidity();
  }

  private resetValue(): void {
    this.passCodes.controls.forEach((control, i) =>
      control.setValue(null, { emitEvent: false })
    );
    this.passCodes.updateValueAndValidity();
  }

  private propagateValueChanges(): void {
    this.passCodes.valueChanges
      .pipe(
        map(codes => {
          const code = codes.join('');

          if (!code) {
            return null;
          }

          return this.passType === 'text' ? code : parseInt(code);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value: string | number | null) => this.onChange(value));
  }
}
