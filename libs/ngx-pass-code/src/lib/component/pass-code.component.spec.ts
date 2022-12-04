import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxPassCodeModule } from '../ngx-pass-code.module';

import { PassCodeComponent } from './pass-code.component';

// model to view - parent control to cva - writeValue
// view to model - cva to parent control - registerOnChange

@Component({
  template: `<ngx-pass-code
    [length]="7"
    passType="text"
    [formControl]="control"
  ></ngx-pass-code>`,
})
class HostComponent {
  @ViewChild(PassCodeComponent) passCodeComponent!: PassCodeComponent;
  control = new FormControl('mypass1');
}

describe('PassCodeComponent', () => {
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
    // async as initial value is set in setTimeout
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

    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      ...value.substring(0, codeLength),
    ]);
  });

  it('should send a new value to paren when view changes value', () => {
    const value = 'newvals';
    hostComponent.passCodeComponent.passCodes.patchValue([...value]);
  });
});
