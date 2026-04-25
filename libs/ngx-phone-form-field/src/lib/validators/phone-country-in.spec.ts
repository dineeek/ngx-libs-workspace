import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import type { CountryCode } from 'libphonenumber-js/max'
import { phoneCountryIn } from './phone-country-in'

function makeField(
  initial: string | null,
  allowed: readonly CountryCode[]
): {
  value: WritableSignal<string | null>
  field: Field<string | null>
} {
  const value = signal<string | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<string | null>(value, p => {
      phoneCountryIn(p, allowed)
    })
  )
  return { value, field }
}

describe('phoneCountryIn', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null, ['US', 'GB'])
    expect(field().valid()).toBe(true)
  })

  it('passes when the parsed country is allowed', () => {
    const { field } = makeField('+12015550123', ['US', 'GB'])
    expect(field().valid()).toBe(true)
  })

  it('fails when the parsed country is not allowed', () => {
    const { field } = makeField('+442079460000', ['US', 'DE'])
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('disallowedCountry')
  })

  it('fails for an unparseable string', () => {
    const { field } = makeField('not-a-number', ['US'])
    expect(field().valid()).toBe(false)
  })

  it('recovers to valid when the value is repaired to an allowed country', () => {
    const { value, field } = makeField('+442079460000', ['US'])
    expect(field().valid()).toBe(false)
    value.set('+12015550123')
    expect(field().valid()).toBe(true)
  })
})
