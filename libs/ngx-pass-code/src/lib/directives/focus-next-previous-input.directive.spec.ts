import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FocusNextPreviousInputDirective } from './focus-next-previous-input.directive'

@Component({
  standalone: true,
  imports: [FocusNextPreviousInputDirective],
  template: `
    <input
      class="slot"
      [type]="type()"
      [autoblur]="autoblur()"
      maxlength="1"
      focusNextPreviousInput
    />
    <input
      class="slot"
      [type]="type()"
      [autoblur]="autoblur()"
      maxlength="1"
      focusNextPreviousInput
    />
    <input
      class="slot"
      [type]="type()"
      [autoblur]="autoblur()"
      maxlength="1"
      focusNextPreviousInput
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
  type = signal<'text' | 'number' | 'password'>('text')
  autoblur = signal(false)
}

function inputs(fixture: ComponentFixture<HostComponent>): HTMLInputElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
      'input.slot'
    )
  )
}

describe('FocusNextPreviousInputDirective', () => {
  let fixture: ComponentFixture<HostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents()
    fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
  })

  it('keyup on a filled slot focuses the next sibling', () => {
    const [first, second] = inputs(fixture)
    const spy = jest.spyOn(second, 'focus')
    first.value = 'x'
    first.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 88 }))
    expect(spy).toHaveBeenCalled()
  })

  it('keyup on an empty slot does not advance focus', () => {
    const [first, second] = inputs(fixture)
    const spy = jest.spyOn(second, 'focus')
    expect(first.value).toBe('')
    first.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 88 }))
    expect(spy).not.toHaveBeenCalled()
  })

  it('Backspace keyup focuses the previous sibling', () => {
    const [first, second] = inputs(fixture)
    const spy = jest.spyOn(first, 'focus')
    second.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 8 }))
    expect(spy).toHaveBeenCalled()
  })

  it('Delete keyup focuses the previous sibling', () => {
    const [first, second] = inputs(fixture)
    const spy = jest.spyOn(first, 'focus')
    second.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 46 }))
    expect(spy).toHaveBeenCalled()
  })

  it('Left-arrow keyup focuses the previous sibling', () => {
    const [first, second] = inputs(fixture)
    const spy = jest.spyOn(first, 'focus')
    second.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 37 }))
    expect(spy).toHaveBeenCalled()
  })

  it('Tab keyup is a no-op (does not steal focus)', () => {
    const [first, second] = inputs(fixture)
    const spy = jest.spyOn(second, 'focus')
    first.value = 'x'
    first.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 9 }))
    expect(spy).not.toHaveBeenCalled()
  })

  it('autoblur=true: filling the last slot blurs it', () => {
    fixture.componentInstance.autoblur.set(true)
    fixture.detectChanges()
    const all = inputs(fixture)
    const last = all[all.length - 1]
    const spy = jest.spyOn(last, 'blur')
    last.value = 'z'
    last.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 90 }))
    expect(spy).toHaveBeenCalled()
  })

  it('autoblur=false: filling the last slot leaves focus alone', () => {
    fixture.componentInstance.autoblur.set(false)
    fixture.detectChanges()
    const all = inputs(fixture)
    const last = all[all.length - 1]
    const spy = jest.spyOn(last, 'blur')
    last.value = 'z'
    last.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 90 }))
    expect(spy).not.toHaveBeenCalled()
  })

  it('Space keydown is suppressed (preventDefault)', () => {
    const [first] = inputs(fixture)
    const event = new KeyboardEvent('keydown', {
      keyCode: 32,
      cancelable: true
    })
    first.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('type=number: digit keydown clears the slot before re-input', () => {
    fixture.componentInstance.type.set('number')
    fixture.detectChanges()
    const [first] = inputs(fixture)
    first.value = '5'
    first.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 49 }))
    expect(first.value).toBe('')
  })

  it('type=number: Backspace keydown does not clear the slot', () => {
    fixture.componentInstance.type.set('number')
    fixture.detectChanges()
    const [first] = inputs(fixture)
    first.value = '5'
    first.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8 }))
    expect(first.value).toBe('5')
  })
})
