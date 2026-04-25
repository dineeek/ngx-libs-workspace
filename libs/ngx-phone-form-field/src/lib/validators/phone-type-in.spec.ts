import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import type { NumberType } from 'libphonenumber-js/max'
import { phoneTypeIn } from './phone-type-in'

function makeField(
  initial: string | null,
  allowed: readonly NumberType[]
): {
  value: WritableSignal<string | null>
  field: Field<string | null>
} {
  const value = signal<string | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<string | null>(value, p => {
      phoneTypeIn(p, allowed)
    })
  )
  return { value, field }
}

describe('phoneTypeIn', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null, ['MOBILE'])
    expect(field().valid()).toBe(true)
  })

  it('passes for a UK mobile when MOBILE is allowed', () => {
    // +44 7400 123456 — UK mobile range.
    const { field } = makeField('+447400123456', ['MOBILE'])
    expect(field().valid()).toBe(true)
  })

  it('fails for a UK fixed-line when only MOBILE is allowed', () => {
    // +44 20 7946 0000 — London landline.
    const { field } = makeField('+442079460000', ['MOBILE'])
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('disallowedPhoneType')
  })

  it('passes when both MOBILE and FIXED_LINE are allowed', () => {
    const { field } = makeField('+442079460000', ['MOBILE', 'FIXED_LINE'])
    expect(field().valid()).toBe(true)
  })

  it('passes for an unparseable string (no type to check)', () => {
    const { field } = makeField('not-a-number', ['MOBILE'])
    expect(field().valid()).toBe(true)
  })

  it('recovers to valid when the value moves to an allowed type', () => {
    const { value, field } = makeField('+442079460000', ['MOBILE'])
    expect(field().valid()).toBe(false)
    value.set('+447400123456')
    expect(field().valid()).toBe(true)
  })
})
