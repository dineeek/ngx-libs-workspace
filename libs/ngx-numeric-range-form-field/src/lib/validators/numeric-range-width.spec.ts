import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { INumericRange } from '../numeric-range.model'
import {
  numericRangeWidth,
  NumericRangeWidthBounds
} from './numeric-range-width'

function makeField(
  initial: INumericRange | null,
  bounds: NumericRangeWidthBounds
): {
  value: WritableSignal<INumericRange | null>
  field: Field<INumericRange | null>
} {
  const value = signal<INumericRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<INumericRange | null>(value, p => {
      numericRangeWidth(p, bounds)
    })
  )
  return { value, field }
}

describe('numericRangeWidth', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null, { min: 5, max: 30 })
    expect(field().valid()).toBe(true)
  })

  it('passes when a side is null', () => {
    const { field } = makeField(
      { minimum: 1, maximum: null },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(true)
  })

  it('skips when max < min (order validator owns that case)', () => {
    const { field } = makeField(
      { minimum: 10, maximum: 5 },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(true)
  })

  it('passes when the span is within bounds', () => {
    const { field } = makeField(
      { minimum: 10, maximum: 20 },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(true)
  })

  it('passes at the exact minimum span', () => {
    const { field } = makeField(
      { minimum: 10, maximum: 15 },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(true)
  })

  it('passes at the exact maximum span', () => {
    const { field } = makeField(
      { minimum: 0, maximum: 30 },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(true)
  })

  it('emits kind "minWidth" when the span is too small', () => {
    const { field } = makeField(
      { minimum: 10, maximum: 12 },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('minWidth')
  })

  it('emits kind "maxWidth" when the span is too large', () => {
    const { field } = makeField(
      { minimum: 0, maximum: 100 },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('maxWidth')
  })

  it('honours a one-sided bound (min only)', () => {
    const { field } = makeField({ minimum: 0, maximum: 1000 }, { min: 10 })
    expect(field().valid()).toBe(true)

    const { field: tooNarrow } = makeField(
      { minimum: 0, maximum: 5 },
      { min: 10 }
    )
    expect(tooNarrow().valid()).toBe(false)
    expect(
      tooNarrow()
        .errors()
        .map(e => e.kind)
    ).toContain('minWidth')
  })

  it('honours a one-sided bound (max only)', () => {
    const { field } = makeField({ minimum: 0, maximum: 50 }, { max: 30 })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('maxWidth')
  })

  it('recovers to valid when the span moves back within bounds', () => {
    const { value, field } = makeField(
      { minimum: 0, maximum: 100 },
      { min: 5, max: 30 }
    )
    expect(field().valid()).toBe(false)

    value.set({ minimum: 10, maximum: 20 })
    expect(field().valid()).toBe(true)
  })
})
