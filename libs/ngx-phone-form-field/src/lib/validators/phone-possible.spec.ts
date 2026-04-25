import { signal, WritableSignal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Field, form } from '@angular/forms/signals'
import { phonePossible } from './phone-possible'

function makeField(initial: string | null): {
  value: WritableSignal<string | null>
  field: Field<string | null>
} {
  const value = signal<string | null>(initial)
  const field = TestBed.runInInjectionContext(() =>
    form<string | null>(value, p => {
      phonePossible(p)
    })
  )
  return { value, field }
}

describe('phonePossible', () => {
  it('passes when value is null', () => {
    const { field } = makeField(null)
    expect(field().valid()).toBe(true)
  })

  it('passes for a possible US number length', () => {
    const { field } = makeField('+12015550123')
    expect(field().valid()).toBe(true)
  })

  it('fails when the length is impossible', () => {
    const { field } = makeField('+1234')
    expect(field().valid()).toBe(false)
    expect(
      field()
        .errors()
        .map(e => e.kind)
    ).toContain('notPossiblePhone')
  })

  it('fails for grossly oversized input', () => {
    const { field } = makeField('+12015550123456789012345')
    expect(field().valid()).toBe(false)
  })

  it('recovers to valid when the value is repaired', () => {
    const { value, field } = makeField('+1234')
    expect(field().valid()).toBe(false)
    value.set('+12015550123')
    expect(field().valid()).toBe(true)
  })
})
