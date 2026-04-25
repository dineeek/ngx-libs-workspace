import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'
import { timeRangeOrderValid } from './time-range-order'

function makeField(initial: ITimeRange | null): {
  value: WritableSignal<ITimeRange | null>
  field: Field<ITimeRange | null>
} {
  const value = signal<ITimeRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<ITimeRange | null>(value, p => {
      timeRangeOrderValid(p)
    })
  )
  return { value, field }
}

describe('timeRangeOrderValid', () => {
  it('passes when the value is null', () => {
    const { field } = makeField(null)
    expect(field().valid()).toBe(true)
  })

  it('passes when start is null', () => {
    const { field } = makeField({ start: null, end: '17:00' })
    expect(field().valid()).toBe(true)
  })

  it('passes when end is null', () => {
    const { field } = makeField({ start: '09:00', end: null })
    expect(field().valid()).toBe(true)
  })

  it('passes when end equals start', () => {
    const { field } = makeField({ start: '12:00', end: '12:00' })
    expect(field().valid()).toBe(true)
  })

  it('passes when end is later than start', () => {
    const { field } = makeField({ start: '09:00', end: '17:00' })
    expect(field().valid()).toBe(true)
  })

  it('passes when comparing mixed-precision strings (HH:mm vs HH:mm:ss)', () => {
    // '09:30' < '09:30:01' lexicographically, so the order is preserved.
    const { field } = makeField({ start: '09:30', end: '09:30:01' })
    expect(field().valid()).toBe(true)
  })

  it('fails with kind "invalidRange" when end is earlier than start', () => {
    const { field } = makeField({ start: '17:00', end: '09:00' })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('invalidRange')
  })

  it('recovers to valid when the value is repaired', () => {
    const { value, field } = makeField({ start: '17:00', end: '09:00' })
    expect(field().valid()).toBe(false)

    value.set({ start: '09:00', end: '17:00' })
    expect(field().valid()).toBe(true)
  })

  it('skips silently when a side is malformed (e.g. leading whitespace)', () => {
    // Whitespace-padded strings are a contract violation the component-side
    // parser rejects. The validator must not produce a misleading order
    // error from a corrupt comparison — it should pass instead.
    const { field } = makeField({ start: ' 09:00', end: '17:00' })
    expect(field().valid()).toBe(true)
  })

  it('skips silently when a side is out of range (e.g. 24:00)', () => {
    const { field } = makeField({ start: '24:00', end: '23:00' })
    expect(field().valid()).toBe(true)
  })

  it('treats HH:mm and HH:mm:ss as equal when the seconds are zero', () => {
    // Reverse mixed-precision case: start has seconds, end does not, but
    // they represent the same instant — must not flag as out-of-order.
    const { field } = makeField({ start: '09:00:00', end: '09:00' })
    expect(field().valid()).toBe(true)
  })
})
