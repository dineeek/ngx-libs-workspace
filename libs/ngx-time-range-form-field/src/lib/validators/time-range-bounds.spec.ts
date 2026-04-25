import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'
import { timeRangeBounds, TimeRangeBounds } from './time-range-bounds'

function makeField(
  initial: ITimeRange | null,
  bounds: TimeRangeBounds
): {
  value: WritableSignal<ITimeRange | null>
  field: Field<ITimeRange | null>
} {
  const value = signal<ITimeRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<ITimeRange | null>(value, p => {
      timeRangeBounds(p, bounds)
    })
  )
  return { value, field }
}

describe('timeRangeBounds', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null, { min: '09:00', max: '17:00' })
    expect(field().valid()).toBe(true)
  })

  it('passes when both sides are within bounds', () => {
    const { field } = makeField(
      { start: '10:00', end: '16:00' },
      { min: '09:00', max: '17:00' }
    )
    expect(field().valid()).toBe(true)
  })

  it('passes at the exact bounds', () => {
    const { field } = makeField(
      { start: '09:00', end: '17:00' },
      { min: '09:00', max: '17:00' }
    )
    expect(field().valid()).toBe(true)
  })

  it('emits kind "min" when start is before the floor', () => {
    const { field } = makeField(
      { start: '08:00', end: '12:00' },
      { min: '09:00', max: '17:00' }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('min')
  })

  it('emits kind "max" when end is after the ceiling', () => {
    const { field } = makeField(
      { start: '12:00', end: '18:00' },
      { min: '09:00', max: '17:00' }
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
      { start: '07:00', end: '23:00' },
      { min: '09:00', max: '17:00' }
    )
    const kinds = field()
      .errors()
      .map(e => e.kind)
    expect(kinds).toContain('min')
    expect(kinds).toContain('max')
  })

  it('treats a null side as not-yet-set and only checks the populated side', () => {
    const { field } = makeField(
      { start: null, end: '20:00' },
      { min: '09:00', max: '17:00' }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toEqual(['max'])
  })

  it('honours a one-sided bound (min only)', () => {
    const { field } = makeField(
      { start: '06:00', end: '23:00' },
      { min: '09:00' }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('min')

    const { field: okField } = makeField(
      { start: '09:00', end: '23:59' },
      { min: '09:00' }
    )
    expect(okField().valid()).toBe(true)
  })

  it('honours a one-sided bound (max only)', () => {
    const { field } = makeField(
      { start: '00:00', end: '20:00' },
      { max: '17:00' }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('max')
  })

  it('recovers to valid when the value moves back within bounds', () => {
    const { value, field } = makeField(
      { start: '06:00', end: '20:00' },
      { min: '09:00', max: '17:00' }
    )
    expect(field().valid()).toBe(false)

    value.set({ start: '09:00', end: '17:00' })
    expect(field().valid()).toBe(true)
  })

  it('compares HH:mm:ss precision correctly against an HH:mm bound', () => {
    // After normalisation '09:00:00' equals '09:00:00', so this is in-bounds.
    const { field } = makeField(
      { start: '09:00:00', end: '17:00:00' },
      { min: '09:00', max: '17:00' }
    )
    expect(field().valid()).toBe(true)
  })

  it('compares HH:mm value precision correctly against an HH:mm:ss bound', () => {
    // Reverse case: bound has seconds, value does not.
    const { field } = makeField(
      { start: '09:00', end: '17:00' },
      { min: '09:00:00', max: '17:00:00' }
    )
    expect(field().valid()).toBe(true)
  })

  it('skips a side silently when it is malformed (leading whitespace)', () => {
    // Without the strict parser this would have lex-compared ' 09:00' < '08:00'
    // and produced a false `min` error. The strict parser must reject it.
    const { field } = makeField(
      { start: ' 09:00', end: '17:00' },
      { min: '08:00', max: '20:00' }
    )
    expect(field().valid()).toBe(true)
  })

  it('skips a side silently when it is out of range (e.g. 24:00)', () => {
    const { field } = makeField(
      { start: '24:00', end: '17:00' },
      { min: '00:00', max: '23:59' }
    )
    expect(field().valid()).toBe(true)
  })

  it('skips silently when a bound itself is malformed', () => {
    const { field } = makeField(
      { start: '09:00', end: '17:00' },
      { min: 'noon', max: '20:00' }
    )
    expect(field().valid()).toBe(true)
  })
})
