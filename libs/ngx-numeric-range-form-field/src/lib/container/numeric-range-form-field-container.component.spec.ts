import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NumericRangeFormFieldControlComponent } from '../control/numeric-range-form-field-control.component'
import { INumericRange } from '../form/model/numeric-range-field.model'
import { NumericRangeFormFieldContainerComponent } from './numeric-range-form-field-container.component'

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NumericRangeFormFieldContainerComponent],
  template: `
    <ngx-numeric-range-form-field
      [formControl]="numericRangeControl"
      label="Numeric range input field"
      (enterPressed)="onNumericRangeEnterPressed()"
      (numericRangeChanged)="onNumericRangeChanged($event)"
      (blurred)="onRangeBlur()"
    >
    </ngx-numeric-range-form-field>
  `
})
class HostComponent {
  form = new FormGroup({
    numericRange: new FormControl<INumericRange | null>(
      { minimum: 0, maximum: 10 },
      [Validators.min(0), Validators.max(10)]
    )
  })

  get numericRangeControl(): FormControl {
    return this.form.controls.numericRange as unknown as FormControl
  }

  onRangeBlur(): void {}
  onNumericRangeChanged(_value: INumericRange | null): void {}
  onNumericRangeEnterPressed(): void {}

  disableRange(disable: boolean): void {
    disable
      ? this.numericRangeControl.disable()
      : this.numericRangeControl.enable()
  }
}

describe('NumericRangeFormFieldContainerComponent', () => {
  let component: HostComponent
  let fixture: ComponentFixture<HostComponent>

  const getInputs = (): HTMLInputElement[] =>
    fixture.debugElement
      .query(By.directive(NumericRangeFormFieldContainerComponent))
      .queryAll(By.css('input'))
      .map(el => el.nativeElement as HTMLInputElement)

  const getMinRangeField = () => getInputs()[0]
  const getMaxRangeField = () => getInputs()[1]

  const getNumericRangeComponent =
    (): NumericRangeFormFieldContainerComponent =>
      fixture.debugElement.query(
        By.directive(NumericRangeFormFieldContainerComponent)
      ).componentInstance

  const getNumericRangeControlComponent =
    (): NumericRangeFormFieldControlComponent =>
      fixture.debugElement.query(
        By.directive(NumericRangeFormFieldControlComponent)
      ).componentInstance

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HostComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    fixture.destroy()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(getMinRangeField()).toBeTruthy()
    expect(getMaxRangeField()).toBeTruthy()
  })

  it('should emit on enter pressed when range is valid', () => {
    const enterSpy = jest.spyOn(component, 'onNumericRangeEnterPressed')

    getMinRangeField().dispatchEvent(
      new KeyboardEvent('keyup', { key: 'enter' })
    )

    expect(enterSpy).toHaveBeenCalledTimes(1)
  })

  it('should not emit on enter when range is invalid', () => {
    const enterSpy = jest.spyOn(component, 'onNumericRangeEnterPressed')

    component.form.controls.numericRange.setValue({ minimum: 10, maximum: 9 })
    fixture.detectChanges()

    getMinRangeField().dispatchEvent(
      new KeyboardEvent('keyup', { key: 'enter' })
    )

    expect(enterSpy).not.toHaveBeenCalled()
  })

  it('should emit on blur event', () => {
    const blurSpy = jest.spyOn(component, 'onRangeBlur')
    getMinRangeField().dispatchEvent(new Event('blur'))
    expect(blurSpy).toHaveBeenCalled()
  })

  it('should emit on changed range value', () => {
    const rangeChangeSpy = jest.spyOn(component, 'onNumericRangeChanged')
    const control = getNumericRangeControlComponent()

    control.minimumControl.setValue(8)
    control.minimumControl.updateValueAndValidity()
    control.onRangeValuesChanged()

    expect(rangeChangeSpy).toHaveBeenCalledWith({ minimum: 8, maximum: 10 })
    expect(control.errorState).toBe(false)
  })

  it('should emit null when changed range is invalid', () => {
    const rangeChangeSpy = jest.spyOn(component, 'onNumericRangeChanged')
    const control = getNumericRangeControlComponent()

    control.minimumControl.setValue(8)
    control.maximumControl.setValue(6)
    control.formGroup.updateValueAndValidity()
    control.onRangeValuesChanged()

    expect(rangeChangeSpy).toHaveBeenCalledWith(null)
    expect(control.formGroup.errors).toEqual({ notValidRange: true })
  })

  it('should reset value via the reset icon', () => {
    expect(component.form.value).toEqual({
      numericRange: { minimum: 0, maximum: 10 }
    })

    const resetIcon = fixture.debugElement
      .query(By.directive(NumericRangeFormFieldContainerComponent))
      .query(By.css('mat-icon')).nativeElement as HTMLElement
    resetIcon.click()

    expect(component.form.value).toEqual({
      numericRange: { minimum: null, maximum: null }
    })
  })

  it('should toggle disabled state', () => {
    const numericRangeComponent = getNumericRangeComponent()

    component.disableRange(true)
    expect(component.numericRangeControl.disabled).toBe(true)
    expect(numericRangeComponent.formGroup.disabled).toBe(true)

    component.disableRange(false)
    expect(component.numericRangeControl.disabled).toBe(false)
    expect(numericRangeComponent.formGroup.disabled).toBe(false)
  })

  it('should have valid error state initially', () => {
    expect(getNumericRangeControlComponent().errorState).toBe(false)
  })

  it('should have invalid error state when range is not valid', () => {
    const control = getNumericRangeControlComponent()

    control.minimumControl.setValue(8)
    control.maximumControl.setValue(6)
    control.minimumControl.markAsTouched()
    control.minimumControl.markAsDirty()
    control.maximumControl.markAsDirty()
    control.formGroup.updateValueAndValidity()

    expect(control.errorState).toBe(true)
  })
})
