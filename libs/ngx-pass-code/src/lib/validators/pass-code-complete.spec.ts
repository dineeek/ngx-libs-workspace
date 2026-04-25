import { Injector, runInInjectionContext, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { form } from '@angular/forms/signals'

import { passCodeComplete } from './pass-code-complete'

type Value = string | number | null

function buildForm(initial: Value, length: number) {
  const injector = TestBed.inject(Injector)
  const value = signal<Value>(initial)
  const f = runInInjectionContext(injector, () =>
    form<Value>(value, p => passCodeComplete(p, length))
  )
  return { value, f }
}

describe('passCodeComplete', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('reports incomplete when value is null', () => {
    const { f } = buildForm(null, 5)
    expect(f().valid()).toBe(false)
    expect(
      f()
        .errors()
        .some(e => e.kind === 'incomplete')
    ).toBe(true)
  })

  it('reports incomplete when value is shorter than length', () => {
    const { f } = buildForm('123', 5)
    expect(f().valid()).toBe(false)
    expect(
      f()
        .errors()
        .some(e => e.kind === 'incomplete')
    ).toBe(true)
  })

  it('reports incomplete when string value is longer than length', () => {
    const { f } = buildForm('1234567', 5)
    expect(f().valid()).toBe(false)
    expect(
      f()
        .errors()
        .some(e => e.kind === 'incomplete')
    ).toBe(true)
  })

  it('passes when string value matches the exact length', () => {
    const { f } = buildForm('12345', 5)
    expect(f().valid()).toBe(true)
  })

  it('passes when numeric value stringifies to the exact length', () => {
    const { f } = buildForm(12345, 5)
    expect(f().valid()).toBe(true)
  })

  it('reactively updates as the value signal changes', () => {
    const { value, f } = buildForm(null, 4)
    expect(f().valid()).toBe(false)

    value.set('ab')
    expect(f().valid()).toBe(false)

    value.set('abcd')
    expect(f().valid()).toBe(true)

    value.set(null)
    expect(f().valid()).toBe(false)
  })
})
