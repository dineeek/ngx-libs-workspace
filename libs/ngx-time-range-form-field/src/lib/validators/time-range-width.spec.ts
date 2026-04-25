import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'
import { timeRangeWidth, TimeRangeWidthBounds } from './time-range-width'

function makeField(
  initial: ITimeRange | null,
  bounds: TimeRangeWidthBounds
): {
  value: WritableSignal<ITimeRange | null>
  field: Field<ITimeRange | null>
} {
  const value = signal<ITimeRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<ITimeRange | null>(value, p => {
      timeRangeWidth(p, bounds)
    })
  )
  return { value, field }
}

describe('timeRangeWidth', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null, { minMinutes: 30, maxMinutes: 480 })
    expect(field().valid()).toBe(true)
  })

  it('passes when a side is null', () => {
    const { field } = makeField(
      { start: '09:00', end: null },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(true)
  })

  it('skips when end < start (order validator owns that case)', () => {
    const { field } = makeField(
      { start: '17:00', end: '09:00' },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(true)
  })

  it('passes when the span is within bounds', () => {
    const { field } = makeField(
      { start: '09:00', end: '12:00' },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(true)
  })

  it('passes at the exact minimum span', () => {
    const { field } = makeField(
      { start: '09:00', end: '09:30' },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(true)
  })

  it('passes at the exact maximum span', () => {
    const { field } = makeField(
      { start: '09:00', end: '17:00' },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(true)
  })

  it('emits kind "minWidth" when the span is too short', () => {
    const { field } = makeField(
      { start: '09:00', end: '09:15' },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('minWidth')
  })

  it('emits kind "maxWidth" when the span is too long', () => {
    const { field } = makeField(
      { start: '00:00', end: '23:00' },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('maxWidth')
  })

  it('honours a one-sided bound (minMinutes only)', () => {
    const { field } = makeField(
      { start: '00:00', end: '23:00' },
      { minMinutes: 60 }
    )
    expect(field().valid()).toBe(true)

    const { field: tooNarrow } = makeField(
      { start: '09:00', end: '09:30' },
      { minMinutes: 60 }
    )
    expect(tooNarrow().valid()).toBe(false)
    expect(
      tooNarrow()
        .errors()
        .map(e => e.kind)
    ).toContain('minWidth')
  })

  it('honours a one-sided bound (maxMinutes only)', () => {
    const { field } = makeField(
      { start: '09:00', end: '17:00' },
      { maxMinutes: 60 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('maxWidth')
  })

  it('handles HH:mm:ss precision via fractional-minute spans', () => {
    // 30 seconds = 0.5 minutes — should fail a minMinutes: 1 bound.
    const { field } = makeField(
      { start: '09:00:00', end: '09:00:30' },
      { minMinutes: 1 }
    )
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('minWidth')
  })

  it('recovers to valid when the span moves back within bounds', () => {
    const { value, field } = makeField(
      { start: '00:00', end: '23:00' },
      { minMinutes: 30, maxMinutes: 480 }
    )
    expect(field().valid()).toBe(false)

    value.set({ start: '09:00', end: '12:00' })
    expect(field().valid()).toBe(true)
  })
})
