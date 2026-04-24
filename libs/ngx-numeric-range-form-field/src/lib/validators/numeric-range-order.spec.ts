import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'
import { numericRangeOrderValid } from './numeric-range-order'

function makeField(initial: INumericRange | null): {
  value: WritableSignal<INumericRange | null>
  field: Field<INumericRange | null>
} {
  const value = signal<INumericRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<INumericRange | null>(value, p => {
      numericRangeOrderValid(p)
    })
  )
  return { value, field }
}

describe('numericRangeOrderValid', () => {
  it('passes when the value is null', () => {
    const { field } = makeField(null)
    expect(field().valid()).toBe(true)
  })

  it('passes when minimum is null', () => {
    const { field } = makeField({ minimum: null, maximum: 10 })
    expect(field().valid()).toBe(true)
  })

  it('passes when maximum is null', () => {
    const { field } = makeField({ minimum: 1, maximum: null })
    expect(field().valid()).toBe(true)
  })

  it('passes when maximum equals minimum', () => {
    const { field } = makeField({ minimum: 5, maximum: 5 })
    expect(field().valid()).toBe(true)
  })

  it('passes when maximum is greater than minimum', () => {
    const { field } = makeField({ minimum: 1, maximum: 10 })
    expect(field().valid()).toBe(true)
  })

  it('fails with kind "invalidRange" when maximum is less than minimum', () => {
    const { field } = makeField({ minimum: 10, maximum: 5 })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('invalidRange')
  })

  it('recovers to valid when the value is repaired', () => {
    const { value, field } = makeField({ minimum: 10, maximum: 5 })
    expect(field().valid()).toBe(false)

    value.set({ minimum: 1, maximum: 10 })
    expect(field().valid()).toBe(true)
  })
})
