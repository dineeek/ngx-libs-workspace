import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPassCodeModule } from '../ngx-pass-code.module';

import { PassCodeComponent } from './pass-code.component';
import spyOn = jest.spyOn;

@Component({
  template: `<ngx-pass-code
    [length]="7"
    type="text"
    [uppercase]="true"
    [formControl]="control"
  ></ngx-pass-code>`,
})
class HostComponent {
  @ViewChild(PassCodeComponent) passCodeComponent!: PassCodeComponent;
  control = new FormControl<string | number | null>('mypass1', {
    validators: Validators.required,
  });
}

describe('PassCodeComponent - type text + validation', () => {
  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;
  const codeLength = 7;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgxPassCodeModule],
      declarations: [HostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  beforeEach(waitForAsync(() => {
    // async as initial value is set in timeout
    hostFixture.whenStable().then(() => {
      hostFixture.detectChanges();
    });
  }));

  afterEach(() => {
    hostFixture.destroy();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(hostComponent.passCodeComponent).toBeTruthy();

    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const inputs = component.querySelectorAll('input');
    expect(inputs.length).toStrictEqual(codeLength);
  });

  it('should set the initial value in the ui', () => {
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      'm',
      'y',
      'p',
      'a',
      's',
      's',
      '1',
    ]);
  });

  it('should update value based on same size set/patched formControl value', () => {
    const value = 'test123';
    hostComponent.control.patchValue(value);

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value,
    ]);
  });

  it('should update value based on smaller set/patched formControl value', () => {
    hostComponent.control.patchValue('cat');

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      'c',
      'a',
      't',
      null,
      null,
      null,
      null,
    ]);
  });

  it('should update value based on bigger set/patched formControl value', () => {
    const value = 'dogsareawesome';
    hostComponent.control.patchValue(value);

    // it will only take how much is needed by length property
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value.substring(0, codeLength),
    ]);
  });

  it('should send a new value to parent when view value changes', () => {
    const value = 'newvals';
    hostComponent.passCodeComponent.passCodes.patchValue([...value]);

    expect(hostComponent.control.value).toStrictEqual(value.toUpperCase());
  });

  it('should send a touch event when input interaction', () => {
    expect(hostComponent.control.touched).toBe(false); // initially

    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    component.querySelector('input').dispatchEvent(new Event('blur'));
    hostFixture.detectChanges();

    expect(hostComponent.control.touched).toBe(true);
    expect(component.classList.contains('ng-touched')).toBe(true);
  });

  it('should set invalid class when field is required and send null value', () => {
    expect(hostComponent.control.valid).toBe(true); // initially

    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const compiledInput = component.querySelector('input');

    expect(component.classList.contains('ng-invalid')).toBe(false);
    expect(compiledInput.classList.contains('invalid-input')).toBe(false); // custom validation class

    // clearing value in ui
    hostComponent.passCodeComponent.passCodes.setValue([
      ...new Array(codeLength).fill(null),
    ]);

    hostFixture.detectChanges();

    expect(hostComponent.control.value).toStrictEqual(null);
    expect(component.classList.contains('ng-invalid')).toBe(true);
    expect(compiledInput.classList.contains('invalid-input')).toBe(true);
  });

  it('should disable/enable ui on control disable', () => {
    expect(hostComponent.control.enabled).toStrictEqual(true);
    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      true
    );

    hostComponent.control.disable();

    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      false
    );

    hostComponent.control.enable();

    expect(hostComponent.passCodeComponent.passCodes.enabled).toStrictEqual(
      true
    );
  });
});

@Component({
  template: `<ngx-pass-code
    [length]="5"
    type="number"
    [formControl]="control"
  ></ngx-pass-code>`,
})
class Host2Component {
  @ViewChild(PassCodeComponent) passCodeComponent!: PassCodeComponent;
  control = new FormControl<string | number | null>(null);
}

describe('PassCodeComponent - type numbers', () => {
  let hostComponent: Host2Component;
  let hostFixture: ComponentFixture<Host2Component>;
  const codeLength = 5;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgxPassCodeModule],
      declarations: [Host2Component],
    }).compileComponents();

    hostFixture = TestBed.createComponent(Host2Component);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  beforeEach(waitForAsync(() => {
    // async as initial value is set in timeout
    hostFixture.whenStable().then(() => {
      hostFixture.detectChanges();
    });
  }));

  afterEach(() => {
    hostFixture.destroy();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(hostComponent.passCodeComponent).toBeTruthy();

    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const inputs = component.querySelectorAll('input');
    expect(inputs.length).toStrictEqual(codeLength);
  });

  it('should set the initial value in the ui', () => {
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual(
      new Array(codeLength).fill(null)
    );
  });

  it('should update value based on same size set/patched formControl value', () => {
    const value = 52647;
    hostComponent.control.patchValue(value);

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value.toString(),
    ]);
  });

  it('should update value based on smaller set/patched formControl value', () => {
    hostComponent.control.patchValue(666);

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      '6',
      '6',
      '6',
      null,
      null,
    ]);
  });

  it('should update value based on bigger set/patched formControl value', () => {
    const value = 6351232;
    hostComponent.control.patchValue(value);

    // it will only take how much is needed by length property
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value.toString().substring(0, codeLength),
    ]);
  });

  it('should send a new value to parent when view value changes', () => {
    const value = 95123;
    hostComponent.passCodeComponent.passCodes.patchValue([...value.toString()]);
    expect(hostComponent.control.value).toStrictEqual(value);
  });

  it('should not set invalid class when field is not required and send null value', () => {
    expect(hostComponent.control.valid).toBe(true); // initially

    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const compiledInput = component.querySelector('input');

    expect(component.classList.contains('ng-invalid')).toBe(false);
    expect(compiledInput.classList.contains('invalid-input')).toBe(false); // custom validation class

    // clearing value in ui
    hostComponent.passCodeComponent.passCodes.setValue([
      ...new Array(codeLength).fill(null),
    ]);

    hostFixture.detectChanges();

    expect(hostComponent.control.value).toStrictEqual(null);
    expect(component.classList.contains('ng-invalid')).toBe(false);
    expect(compiledInput.classList.contains('invalid-input')).toBe(false);
  });

  it('should move to previous input element', () => {
    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const inputs = component.querySelectorAll('input');

    const firstInput = inputs[0] as HTMLInputElement;
    const secondInput = inputs[1] as HTMLInputElement;

    const firstInputSpy = spyOn(firstInput, 'focus');
    const secondInputSpy = spyOn(secondInput, 'focus');

    secondInput.focus();
    hostFixture.detectChanges();

    expect(secondInputSpy).toHaveBeenCalled();

    secondInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 8 })); // backspace - moves to previous element
    hostFixture.detectChanges();

    expect(firstInputSpy).toHaveBeenCalled();
  });

  it('should move to next input element', () => {
    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const inputs = component.querySelectorAll('input');

    const firstInput = inputs[0] as HTMLInputElement;
    const secondInput = inputs[1] as HTMLInputElement;

    const firstInputSpy = spyOn(firstInput, 'focus');
    const secondInputSpy = spyOn(secondInput, 'focus');

    firstInput.focus();
    hostFixture.detectChanges();

    expect(firstInputSpy).toHaveBeenCalled();

    firstInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 9 })); // tab key - moves to next element
    hostFixture.detectChanges();

    expect(secondInputSpy).toHaveBeenCalled();
  });

  it('should not move to next input element if previous input is empty', () => {
    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const inputs = component.querySelectorAll('input');

    const firstInput = inputs[0] as HTMLInputElement;
    const secondInput = inputs[1] as HTMLInputElement;

    const firstInputSpy = spyOn(firstInput, 'focus');
    const secondInputSpy = spyOn(secondInput, 'focus');

    expect(firstInput.value).toStrictEqual(''); // first input is empty

    firstInput.focus();
    hostFixture.detectChanges();

    expect(firstInputSpy).toHaveBeenCalled();

    firstInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 50 })); // 2 key number
    hostFixture.detectChanges();

    expect(secondInputSpy).not.toHaveBeenCalled();
  });

  it('should move to next input element if input is not empty', () => {
    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const inputs = component.querySelectorAll('input');

    const firstInput = inputs[0] as HTMLInputElement;
    const secondInput = inputs[1] as HTMLInputElement;

    const firstInputSpy = spyOn(firstInput, 'focus');
    const secondInputSpy = spyOn(secondInput, 'focus');

    firstInput.value = '1';
    expect(firstInput.value).toStrictEqual('1'); // first input is not empty

    firstInput.focus();
    hostFixture.detectChanges();

    expect(firstInputSpy).toHaveBeenCalled();

    firstInput.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 50 })); // 2 key number
    hostFixture.detectChanges();

    expect(secondInputSpy).toHaveBeenCalled();
  });

  it('should do actions on keydown', () => {
    const compiled = hostFixture.debugElement.nativeElement;
    const component = compiled.querySelector('ngx-pass-code');
    const firstInput = component.querySelector('input');

    expect(firstInput.value).toStrictEqual('');
    firstInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 })); // spacebar
    expect(firstInput.value).toStrictEqual(''); // spacebar ignored - value is the same
  });
});
