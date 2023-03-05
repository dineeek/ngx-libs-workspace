import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { NgxPassCodeModule } from '../ngx-pass-code.module'

import { PassCodeComponent } from './pass-code.component'
import spyOn = jest.spyOn

@Component({
  template: `<ngx-pass-code
    [length]="7"
    type="text"
    [uppercase]="true"
    [formControl]="control"
    [autofocus]="true"
  ></ngx-pass-code>`
})
class HostTextCodeComponent {
  @ViewChild(PassCodeComponent) passCodeComponent!: PassCodeComponent
  control = new FormControl<string | number | null>(
    { value: 'mypass1', disabled: false },
    {
      validators: Validators.required
    }
  )
}

describe('PassCodeComponent - type text + validation', () => {
  let hostComponent: HostTextCodeComponent
  let hostFixture: ComponentFixture<HostTextCodeComponent>
  const codeLength = 7

  const getAllInputs = (): HTMLInputElement[] => {
    const compiled = hostFixture.debugElement.nativeElement
    const component = compiled.querySelector('ngx-pass-code')
    return component.querySelectorAll('input')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgxPassCodeModule],
      declarations: [HostTextCodeComponent]
    }).compileComponents()

    hostFixture = TestBed.createComponent(HostTextCodeComponent)
    hostComponent = hostFixture.componentInstance
    hostFixture.detectChanges()
  })

  beforeEach(waitForAsync(() => {
    // async as initial value is set in timeout
    hostFixture.whenStable().then(() => {
      hostFixture.detectChanges()
    })
  }))

  afterEach(() => {
    hostFixture.destroy()
  })

  it('should create', () => {
    expect(hostComponent).toBeTruthy()
    expect(hostComponent.passCodeComponent).toBeTruthy()
    expect(getAllInputs().length).toStrictEqual(codeLength)
  })

  it('should set the initial value in the ui', () => {
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      'm',
      'y',
      'p',
      'a',
      's',
      's',
      '1'
    ])
  })

  it('should update value based on same size set/patched formControl value', () => {
    const value = 'test123'
    hostComponent.control.patchValue(value)

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value
    ])
  })

  it('should update value based on smaller set/patched formControl value', () => {
    hostComponent.control.patchValue('cat')

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      'c',
      'a',
      't',
      null,
      null,
      null,
      null
    ])
  })

  it('should update value based on bigger set/patched formControl value', () => {
    const value = 'dogsareawesome'
    hostComponent.control.patchValue(value)

    // it will only take how much is needed by length property
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value.substring(0, codeLength)
    ])
  })

  it('should send a new value to parent when view value changes', () => {
    const value = 'newvals'
    hostComponent.passCodeComponent.passCodes.patchValue([...value])

    expect(hostComponent.control.value).toStrictEqual(value.toUpperCase())
  })

  it('should send a lowercase value to parent when view value changes', () => {
    const value = 'newvals'
    hostComponent.passCodeComponent.uppercase = false
    hostComponent.passCodeComponent.passCodes.patchValue([...value])

    expect(hostComponent.control.value).toStrictEqual(value)
  })

  it('should send a touch event when input interaction', () => {
    expect(hostComponent.control.touched).toBe(false) // initially

    const compiled = hostFixture.debugElement.nativeElement
    const component = compiled.querySelector('ngx-pass-code')
    component.querySelector('input').dispatchEvent(new Event('blur'))
    hostFixture.detectChanges()

    expect(hostComponent.control.touched).toBe(true)
    expect(component.classList.contains('ng-touched')).toBe(true)
  })

  it('should set invalid class when field is required and send null value', () => {
    expect(hostComponent.control.valid).toBe(true) // initially

    const compiled = hostFixture.debugElement.nativeElement
    const component = compiled.querySelector('ngx-pass-code')
    const compiledInput = component.querySelector('input')

    expect(component.classList.contains('ng-invalid')).toBe(false)
    expect(compiledInput.classList.contains('invalid-input')).toBe(false) // custom validation class

    // clearing value in ui
    hostComponent.passCodeComponent.passCodes.setValue([
      ...new Array(codeLength).fill(null).map(() => null)
    ])
    // mark every control dirty
    hostComponent.passCodeComponent.passCodes.controls.forEach(c =>
      c.markAsDirty()
    )
    hostComponent.passCodeComponent.passCodes.updateValueAndValidity()

    hostFixture.detectChanges()

    expect(hostComponent.control.value).toStrictEqual(null)
    expect(component.classList.contains('ng-invalid')).toBe(true)
    expect(compiledInput.classList.contains('invalid-input')).toBe(true)
  })

  it('should disable/enable ui on control disable', () => {
    expect(hostComponent.control.enabled).toStrictEqual(true)
    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      true
    )

    hostComponent.control.disable()

    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      false
    )

    hostComponent.control.enable()

    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      true
    )
  })
})

@Component({
  template: `<ngx-pass-code
    [length]="5"
    type="number"
    [formControl]="control"
    [autoblur]="true"
  ></ngx-pass-code>`
})
class HostNumbersCodeComponent {
  @ViewChild(PassCodeComponent) passCodeComponent!: PassCodeComponent
  control = new FormControl<string | number | null>(null)
}

describe('PassCodeComponent - type numbers', () => {
  let hostComponent: HostNumbersCodeComponent
  let hostFixture: ComponentFixture<HostNumbersCodeComponent>
  const codeLength = 5

  const getAllInputs = (): HTMLInputElement[] => {
    const compiled = hostFixture.debugElement.nativeElement
    const component = compiled.querySelector('ngx-pass-code')
    return component.querySelectorAll('input')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgxPassCodeModule],
      declarations: [HostNumbersCodeComponent]
    }).compileComponents()

    hostFixture = TestBed.createComponent(HostNumbersCodeComponent)
    hostComponent = hostFixture.componentInstance
    hostFixture.detectChanges()
  })

  beforeEach(waitForAsync(() => {
    // async as initial value is set in timeout
    hostFixture.whenStable().then(() => {
      hostFixture.detectChanges()
    })
  }))

  afterEach(() => {
    hostFixture.destroy()
  })

  it('should create', () => {
    expect(hostComponent).toBeTruthy()
    expect(hostComponent.passCodeComponent).toBeTruthy()
    expect(getAllInputs().length).toStrictEqual(codeLength)
  })

  it('should set the initial value in the ui', () => {
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual(
      new Array(codeLength).fill(null)
    )
  })

  it('should update value based on same size set/patched formControl value', () => {
    const value = 52647
    hostComponent.control.patchValue(value)

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value.toString()
    ])
  })

  it('should update value based on smaller set/patched formControl value', () => {
    hostComponent.control.patchValue(666)

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      '6',
      '6',
      '6',
      null,
      null
    ])
  })

  it('should throw error if value type does not match provided type property', () => {
    expect(() => hostComponent.control.patchValue('ADSD5')).toThrow(TypeError)
  })

  it('should update value based on bigger set/patched formControl value', () => {
    const value = 6351232
    hostComponent.control.patchValue(value)

    // it will only take how much is needed by length property
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value.toString().substring(0, codeLength)
    ])
  })

  it('should send a new value to parent when view value changes', () => {
    const value = 95123
    hostComponent.passCodeComponent.passCodes.patchValue([...value.toString()])
    expect(hostComponent.control.value).toStrictEqual(value)
  })

  it('should not set invalid class when field is not required and send null value', () => {
    expect(hostComponent.control.valid).toBe(true) // initially

    const compiled = hostFixture.debugElement.nativeElement
    const component = compiled.querySelector('ngx-pass-code')
    const compiledInput = component.querySelector('input')

    expect(component.classList.contains('ng-invalid')).toBe(false)
    expect(compiledInput.classList.contains('invalid-input')).toBe(false) // custom validation class

    // clearing value in ui
    hostComponent.passCodeComponent.passCodes.setValue([
      ...new Array(codeLength).fill(null)
    ])

    hostFixture.detectChanges()

    expect(hostComponent.control.value).toStrictEqual(null)
    expect(component.classList.contains('ng-invalid')).toBe(false)
    expect(compiledInput.classList.contains('invalid-input')).toBe(false)
  })

  it('should move to previous input element', () => {
    const inputs = getAllInputs()

    const firstInput = inputs[0]
    const secondInput = inputs[1]

    const firstInputSpy = spyOn(firstInput, 'focus')
    const secondInputSpy = spyOn(secondInput, 'focus')

    secondInput.focus()
    hostFixture.detectChanges()

    expect(secondInputSpy).toHaveBeenCalled()

    secondInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 8 })) // backspace - moves to previous element
    hostFixture.detectChanges()

    expect(firstInputSpy).toHaveBeenCalled()
  })

  it('should move to next input element if previous has value', () => {
    const inputs = getAllInputs()

    const firstInput = inputs[0]
    const secondInput = inputs[1]

    const firstInputSpy = spyOn(firstInput, 'focus')
    const secondInputSpy = spyOn(secondInput, 'focus')

    firstInput.focus()
    firstInput.value = '2'
    hostFixture.detectChanges()

    expect(firstInputSpy).toHaveBeenCalled()

    firstInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 53 }))
    hostFixture.detectChanges()

    expect(secondInputSpy).toHaveBeenCalled()
  })

  it('should not move to next input element if previous input is empty', () => {
    const inputs = getAllInputs()

    const firstInput = inputs[0]
    const secondInput = inputs[1]

    const firstInputSpy = spyOn(firstInput, 'focus')
    const secondInputSpy = spyOn(secondInput, 'focus')

    expect(firstInput.value).toStrictEqual('') // first input is empty

    firstInput.focus()
    hostFixture.detectChanges()

    expect(firstInputSpy).toHaveBeenCalled()

    firstInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 50 })) // 2 key number
    hostFixture.detectChanges()

    expect(secondInputSpy).not.toHaveBeenCalled()
  })

  it('should move to next input element if input is not empty', () => {
    const inputs = getAllInputs()

    const firstInput = inputs[0] as HTMLInputElement
    const secondInput = inputs[1] as HTMLInputElement

    const firstInputSpy = spyOn(firstInput, 'focus')
    const secondInputSpy = spyOn(secondInput, 'focus')

    firstInput.value = '1'
    expect(firstInput.value).toStrictEqual('1') // first input is not empty

    firstInput.focus()
    hostFixture.detectChanges()

    expect(firstInputSpy).toHaveBeenCalled()

    firstInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 50 })) // 2 key number
    hostFixture.detectChanges()

    expect(secondInputSpy).toHaveBeenCalled()
  })

  it('should substring value on specific keys for number codes', () => {
    const compiled = hostFixture.debugElement.nativeElement
    const component = compiled.querySelector('ngx-pass-code')
    const firstInput = component.querySelector('input')

    firstInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 53 }))

    firstInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 })) // space key
    hostFixture.detectChanges()

    expect(firstInput.value).toStrictEqual('') // space key ignored - value is the same

    firstInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 })) // tab key
    hostFixture.detectChanges()

    expect(firstInput.value).toStrictEqual('') // tab ignored - value is the same
  })

  it('should ignore tab key press', () => {
    const inputs = getAllInputs()

    const firstInput = inputs[0]
    const secondInput = inputs[1]

    const firstInputSpy = spyOn(firstInput, 'focus')
    const secondInputSpy = spyOn(secondInput, 'focus')

    expect(firstInput.value).toStrictEqual('')

    firstInput.focus()
    hostFixture.detectChanges()

    expect(firstInputSpy).toHaveBeenCalled()

    firstInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 9 })) // tab key
    hostFixture.detectChanges()

    expect(secondInputSpy).not.toHaveBeenCalled()
  })

  it('should blur out on last input if it has value', () => {
    const allInputs = getAllInputs()
    const lastInput = allInputs[allInputs.length - 1]

    const lastInputBlurSpy = spyOn(lastInput, 'blur')

    expect(lastInput.value).toStrictEqual('')

    lastInput.value = '2'
    lastInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 39 }))
    hostFixture.detectChanges()

    expect(lastInputBlurSpy).toHaveBeenCalled()
  })
})

@Component({
  template: `<ngx-pass-code
    [length]="6"
    type="password"
    [formControl]="control"
  ></ngx-pass-code>`
})
class HostPasswordCodeComponent {
  @ViewChild(PassCodeComponent) passCodeComponent!: PassCodeComponent
  control = new FormControl<string | number | null>({
    value: null,
    disabled: true
  })
}

describe('PassCodeComponent - type password + disabled', () => {
  let hostComponent: HostPasswordCodeComponent
  let hostFixture: ComponentFixture<HostPasswordCodeComponent>
  const codeLength = 6

  const getAllInputs = (): HTMLInputElement[] => {
    const compiled = hostFixture.debugElement.nativeElement
    const component = compiled.querySelector('ngx-pass-code')
    return component.querySelectorAll('input')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgxPassCodeModule],
      declarations: [HostPasswordCodeComponent]
    }).compileComponents()

    hostFixture = TestBed.createComponent(HostPasswordCodeComponent)
    hostComponent = hostFixture.componentInstance
    hostFixture.detectChanges()
  })

  beforeEach(waitForAsync(() => {
    // async as initial value is set in timeout
    hostFixture.whenStable().then(() => {
      hostFixture.detectChanges()
    })
  }))

  afterEach(() => {
    hostFixture.destroy()
  })

  it('should create', () => {
    expect(hostComponent).toBeTruthy()
    expect(hostComponent.passCodeComponent).toBeTruthy()
    expect(getAllInputs().length).toStrictEqual(codeLength)
  })

  it('should set the initial value in the ui', () => {
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual(
      new Array(codeLength).fill(null)
    )
  })

  it('should enable/disable ui on control disable', () => {
    expect(hostComponent.control.enabled).toStrictEqual(false)
    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      false
    )

    hostComponent.control.enable()

    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      true
    )

    hostComponent.control.disable()

    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      false
    )
  })
})
