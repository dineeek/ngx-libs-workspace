import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { ITimeRange } from '../time-range.model'
import { timeRangeBothFilled } from './time-range-both-filled'

function makeField(initial: ITimeRange | null): {
  value: WritableSignal<ITimeRange | null>
  field: Field<ITimeRange | null>
} {
  const value = signal<ITimeRange | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<ITimeRange | null>(value, p => {
      timeRangeBothFilled(p)
    })
  )
  return { value, field }
}

describe('timeRangeBothFilled', () => {
  it('fails when value is null', () => {
    const { field } = makeField(null)
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('incomplete')
  })

  it('fails when start is null', () => {
    const { field } = makeField({ start: null, end: '17:00' })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('incomplete')
  })

  it('fails when end is null', () => {
    const { field } = makeField({ start: '09:00', end: null })
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('incomplete')
  })

  it('passes when both sides are populated', () => {
    const { field } = makeField({ start: '09:00', end: '17:00' })
    expect(field().valid()).toBe(true)
  })

  it('passes when both sides are 00:00', () => {
    const { field } = makeField({ start: '00:00', end: '00:00' })
    expect(field().valid()).toBe(true)
  })

  it('recovers to valid once the missing side is filled in', () => {
    const { value, field } = makeField({ start: '09:00', end: null })
    expect(field().valid()).toBe(false)

    value.set({ start: '09:00', end: '17:00' })
    expect(field().valid()).toBe(true)
  })
})
