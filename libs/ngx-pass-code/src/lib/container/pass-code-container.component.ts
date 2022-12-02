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
import { map, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'ngx-pass-code',
  templateUrl: './pass-code-container.component.html',
  styleUrls: ['./pass-code-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCodeContainerComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  @Input() passCodeLength = 0;

  passCodes!: FormArray<FormControl>;

  private unsubscribe$ = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (value: string) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  constructor(private controlDirective: NgControl) {
    this.controlDirective.valueAccessor = this;
  }

  ngOnInit(): void {
    this.passCodes = new FormArray(
      [...new Array(this.passCodeLength)].map(() => new FormControl(''))
    );

    this.propagateValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(value: string): void {
    // TODO - split by char and assign value
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

  private propagateValueChanges(): void {
    this.passCodes.valueChanges
      .pipe(
        map(codes => codes.join('')),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value: string) => this.onChange(value));
  }
}
