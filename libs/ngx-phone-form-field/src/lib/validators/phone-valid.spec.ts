import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { phoneValid } from './phone-valid'

function makeField(initial: string | null): {
  value: WritableSignal<string | null>
  field: Field<string | null>
} {
  const value = signal<string | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<string | null>(value, p => {
      phoneValid(p)
    })
  )
  return { value, field }
}

describe('phoneValid', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null)
    expect(field().valid()).toBe(true)
  })

  it('passes when value is empty string', () => {
    const { field } = makeField('')
    expect(field().valid()).toBe(true)
  })

  it('passes for a valid US number', () => {
    const { field } = makeField('+12015550123')
    expect(field().valid()).toBe(true)
  })

  it('passes for a valid UK number', () => {
    const { field } = makeField('+442079460000')
    expect(field().valid()).toBe(true)
  })

  it('fails with kind "invalidPhone" for an unparseable string', () => {
    const { field } = makeField('not-a-number')
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('invalidPhone')
  })

  it('fails for a number with the wrong length for the country', () => {
    const { field } = makeField('+1201555')
    expect(field().valid()).toBe(false)
  })

  it('recovers to valid when the value is repaired', () => {
    const { value, field } = makeField('not-a-number')
    expect(field().valid()).toBe(false)
    value.set('+12015550123')
    expect(field().valid()).toBe(true)
  })
})
