import { TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { NumericRangeFormService } from './numeric-range-form.service'

describe('NumericRangeFormService', () => {
  let service: NumericRangeFormService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [NumericRangeFormService]
    })
    service = TestBed.inject(NumericRangeFormService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should expose minimum and maximum controls', () => {
    expect(service.minimumControl).toBeTruthy()
    expect(service.maximumControl).toBeTruthy()
  })

  it('should flag invalid range when max < min', () => {
    service.formGroup.setValue({ minimum: 10, maximum: 5 })
    expect(service.formGroup.hasError('notValidRange')).toBe(true)
  })

  it('should not flag invalid range when max >= min', () => {
    service.formGroup.setValue({ minimum: 1, maximum: 10 })
    expect(service.formGroup.hasError('notValidRange')).toBe(false)
  })
})
