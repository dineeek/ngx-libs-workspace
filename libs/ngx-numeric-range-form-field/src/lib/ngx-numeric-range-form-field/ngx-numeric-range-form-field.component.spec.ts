import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NgxNumericRangeFormFieldComponent } from './ngx-numeric-range-form-field.component'

describe('NgxNumericRangeFormFieldComponent', () => {
  let component: NgxNumericRangeFormFieldComponent
  let fixture: ComponentFixture<NgxNumericRangeFormFieldComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxNumericRangeFormFieldComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(NgxNumericRangeFormFieldComponent)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
