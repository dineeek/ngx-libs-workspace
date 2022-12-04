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
    // async as value is set in setTimeout
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

  it('should update value based on same size set/patched formControl value', fakeAsync(() => {
    hostComponent.control.patchValue('test123');

    tick();
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      't',
      'e',
      's',
      't',
      '1',
      '2',
      '3',
    ]);
  }));

  it('should update value based on smaller set/patched formControl value', fakeAsync(() => {
    hostComponent.control.patchValue('cat');

    tick();
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      'c',
      'a',
      't',
      null,
      null,
      null,
      null,
    ]);
  }));

  it('should update value based on bigger set/patched formControl value', fakeAsync(() => {
    hostComponent.control.patchValue('dogsareawesome');

    tick();
    expect(hostComponent.passCodeComponent.passCodes.value).toStrictEqual([
      'd',
      'o',
      'g',
      's',
      'a',
      'r',
      'e',
    ]);
  }));
});
