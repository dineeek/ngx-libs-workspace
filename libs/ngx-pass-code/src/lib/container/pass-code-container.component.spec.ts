import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassCodeContainerComponent } from './pass-code-container.component';

describe('PassCodeContainerComponent', () => {
  let component: PassCodeContainerComponent;
  let fixture: ComponentFixture<PassCodeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassCodeContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PassCodeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
