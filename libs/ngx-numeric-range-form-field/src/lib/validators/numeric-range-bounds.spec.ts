import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'
import { numericRangeBounds, NumericRangeBounds } from './numeric-range-bounds'

function makeField(
  initial: INumericRange | null,
  bounds: NumericRangeBounds
): {
  value: WritableSignal<INumericRange | null>
  field: Field<INumericRange | null>
} {
  const value = signal<INumericRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<INumericRange | null>(value, p => {
      numericRangeBounds(p, bounds)
    })
  )
  return { value, field }
}

describe('numericRangeBounds', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null, { min: 1, max: 10 })
    expect(field().valid()).toBe(true)
  })

  it('passes when both sides are within bounds', () => {
    const { field } = makeField({ minimum: 2, maximum: 8 }, { min: 1, max: 10 })
    expect(field().valid()).toBe(true)
  })

  it('passes at the exact bounds', () => {
    const { field } = makeField(
      { minimum: 1, maximum: 10 },
      { min: 1, max: 10 }
    )
    expect(field().valid()).toBe(true)
  })

  it('emits kind "min" when minimum is below the floor', () => {
    const { field } = makeField({ minimum: 0, maximum: 5 }, { min: 1, max: 10 })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('min')
  })

  it('emits kind "max" when maximum is above the ceiling', () => {
    const { field } = makeField(
      { minimum: 5, maximum: 11 },
      { min: 1, max: 10 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('max')
  })

  it('emits both kinds when both sides are out of bounds', () => {
    const { field } = makeField(
      { minimum: -1, maximum: 99 },
      { min: 0, max: 10 }
    )
    const kinds = field()
      .errors()
      .map(e => e.kind)
    expect(kinds).toContain('min')
    expect(kinds).toContain('max')
  })

  it('treats a null side as not-yet-set and only checks the populated side', () => {
    const { field } = makeField(
      { minimum: null, maximum: 20 },
      { min: 0, max: 10 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toEqual(['max'])
  })

  it('honours a one-sided bound (min only)', () => {
    const { field } = makeField({ minimum: -5, maximum: 100 }, { min: 0 })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('min')

    const { field: okField } = makeField(
      { minimum: 0, maximum: 1000 },
      { min: 0 }
    )
    expect(okField().valid()).toBe(true)
  })

  it('honours a one-sided bound (max only)', () => {
    const { field } = makeField({ minimum: -100, maximum: 50 }, { max: 10 })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('max')
  })

  it('recovers to valid when the value moves back within bounds', () => {
    const { value, field } = makeField(
      { minimum: 0, maximum: 50 },
      { min: 1, max: 10 }
    )
    expect(field().valid()).toBe(false)

    value.set({ minimum: 1, maximum: 10 })
    expect(field().valid()).toBe(true)
  })

  it('emits "min" when only the maximum side is below the floor', () => {
    const { field } = makeField(
      { minimum: 5, maximum: 0 },
      { min: 1, max: 100 }
    )
    expect(field().valid()).toBe(false)
    const errs = field().errors()
    expect(errs.some(e => e.kind === 'min')).toBe(true)
  })

  it('emits "max" when only the minimum side is above the ceiling', () => {
    const { field } = makeField(
      { minimum: 99, maximum: 100 },
      { min: 0, max: 50 }
    )
    expect(field().valid()).toBe(false)
    const errs = field().errors()
    expect(errs.some(e => e.kind === 'max')).toBe(true)
  })
})
