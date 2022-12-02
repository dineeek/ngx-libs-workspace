import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassCodeComponent } from './pass-code.component';

describe('PassCodeComponent', () => {
  let component: PassCodeComponent;
  let fixture: ComponentFixture<PassCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassCodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PassCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
