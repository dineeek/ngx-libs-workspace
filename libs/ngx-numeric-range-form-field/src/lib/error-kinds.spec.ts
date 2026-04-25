import { signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { form, required } from '@angular/forms/signals'
import { NumericRangeErrorKind } from './error-kinds'
import { INumericRange } from './numeric-range.model'
import { numericRangeBothFilled } from './validators/numeric-range-both-filled'
import { numericRangeBounds } from './validators/numeric-range-bounds'
import { numericRangeOrderValid } from './validators/numeric-range-order'
import { numericRangeWidth } from './validators/numeric-range-width'

describe('NumericRangeErrorKind', () => {
  it('OutOfOrder matches the kind emitted by numericRangeOrderValid', () => {
    const value = signal<INumericRange | null>({ minimum: 9, maximum: 1 })
    const field = TestBed.runInInjectionContext(() =>
      form<INumericRange | null>(value, p => {
        numericRangeOrderValid(p)
      })
    )
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain(NumericRangeErrorKind.OutOfOrder)
  })

  it('BoundsMin / BoundsMax match the kinds emitted by numericRangeBounds', () => {
    const value = signal<INumericRange | null>({ minimum: -5, maximum: 50 })
    const field = TestBed.runInInjectionContext(() =>
      form<INumericRange | null>(value, p => {
        numericRangeBounds(p, { min: 0, max: 10 })
      })
    )
    const kinds = field()
      .errors()
      .map(e => e.kind)
    expect(kinds).toContain(NumericRangeErrorKind.BoundsMin)
    expect(kinds).toContain(NumericRangeErrorKind.BoundsMax)
  })

  it('Incomplete matches the kind emitted by numericRangeBothFilled', () => {
    const value = signal<INumericRange | null>({ minimum: 1, maximum: null })
    const field = TestBed.runInInjectionContext(() =>
      form<INumericRange | null>(value, p => {
        numericRangeBothFilled(p)
      })
    )
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain(NumericRangeErrorKind.Incomplete)
  })

  it('WidthMin / WidthMax match the kinds emitted by numericRangeWidth', () => {
    const minValue = signal<INumericRange | null>({ minimum: 1, maximum: 2 })
    const minField = TestBed.runInInjectionContext(() =>
      form<INumericRange | null>(minValue, p => {
        numericRangeWidth(p, { min: 10 })
      })
    )
    expect(
      minField()
        .errors()
        .map(e => e.kind)
    ).toContain(NumericRangeErrorKind.WidthMin)

    const maxValue = signal<INumericRange | null>({ minimum: 1, maximum: 100 })
    const maxField = TestBed.runInInjectionContext(() =>
      form<INumericRange | null>(maxValue, p => {
        numericRangeWidth(p, { max: 10 })
      })
    )
    expect(
      maxField()
        .errors()
        .map(e => e.kind)
    ).toContain(NumericRangeErrorKind.WidthMax)
  })

  it('coexists with the existing required() rule without overlapping kinds', () => {
    const value = signal<INumericRange | null>(null)
    const field = TestBed.runInInjectionContext(() =>
      form<INumericRange | null>(value, p => {
        required(p)
      })
    )
    const kinds = field()
      .errors()
      .map(e => e.kind)
    expect(kinds).toContain('required')
    // None of the library-defined kinds collide with `required`.
    expect(Object.values(NumericRangeErrorKind)).not.toContain('required')
  })
})
