import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'
import { numericRangeBothFilled } from './numeric-range-both-filled'

function makeField(initial: INumericRange | null): {
  value: WritableSignal<INumericRange | null>
  field: Field<INumericRange | null>
} {
  const value = signal<INumericRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<INumericRange | null>(value, p => {
      numericRangeBothFilled(p)
    })
  )
  return { value, field }
}

describe('numericRangeBothFilled', () => {
  it('fails when value is null', () => {
    const { field } = makeField(null)
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('incomplete')
  })

  it('fails when minimum is null', () => {
    const { field } = makeField({ minimum: null, maximum: 10 })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('incomplete')
  })

  it('fails when maximum is null', () => {
    const { field } = makeField({ minimum: 1, maximum: null })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('incomplete')
  })

  it('passes when both sides are populated', () => {
    const { field } = makeField({ minimum: 1, maximum: 10 })
    expect(field().valid()).toBe(true)
  })

  it('passes when both sides are zero', () => {
    const { field } = makeField({ minimum: 0, maximum: 0 })
    expect(field().valid()).toBe(true)
  })

  it('recovers to valid once the missing side is filled in', () => {
    const { value, field } = makeField({ minimum: 1, maximum: null })
    expect(field().valid()).toBe(false)

    value.set({ minimum: 1, maximum: 10 })
    expect(field().valid()).toBe(true)
  })
})
