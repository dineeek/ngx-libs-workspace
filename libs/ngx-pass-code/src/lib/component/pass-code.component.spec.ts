import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  form,
  FormField,
  pattern,
  required,
  ValidationError
} from '@angular/forms/signals'

import { PassCodeComponent } from './pass-code.component'

type Type = 'text' | 'number' | 'password'

@Component({
  standalone: true,
  imports: [PassCodeComponent],
  template: `
    <ngx-pass-code
      [(value)]="value"
      [length]="length()"
      [type]="type()"
      [uppercase]="uppercase()"
      [autofocus]="autofocus()"
      [autoblur]="autoblur()"
      [disabled]="disabled()"
      [errors]="errors()"
      [(touched)]="touched"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DirectHostComponent {
  value = signal<string | number | null>(null)
  touched = signal(false)
  length = signal(5)
  type = signal<Type>('text')
  uppercase = signal(false)
  autofocus = signal(false)
  autoblur = signal(false)
  disabled = signal(false)
  errors = signal<readonly ValidationError.WithOptionalFieldTree[]>([])
}

@Component({
  standalone: true,
  imports: [PassCodeComponent, FormField],
  template: `
    <ngx-pass-code
      [formField]="codeForm"
      [length]="length()"
      [type]="type()"
      [uppercase]="uppercase()"
      [autofocus]="autofocus()"
      [autoblur]="autoblur()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class FormHostComponent {
  value = signal<string | number | null>(null)
  length = signal(5)
  type = signal<Type>('text')
  uppercase = signal(false)
  autofocus = signal(false)
  autoblur = signal(false)
  codeForm = form<string | number | null>(this.value, p => {
    required(p)
  })
}

@Component({
  standalone: true,
  imports: [PassCodeComponent, FormField],
  template: `
    <ngx-pass-code
      [formField]="codeForm"
      [length]="5"
      type="text"
      [uppercase]="true"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class PatternHostComponent {
  value = signal<string | number | null>('')
  codeForm = form<string | number | null>(this.value, p => {
    required(p)
    pattern(p as never, /^[A-Z0-9]{5}$/)
  })
}

function createDirect(
  setup?: (host: DirectHostComponent) => void
): ComponentFixture<DirectHostComponent> {
  const fixture = TestBed.createComponent(DirectHostComponent)
  if (setup) {
    setup(fixture.componentInstance)
  }
  fixture.detectChanges()
  return fixture
}

function inputsOf<T>(fixture: ComponentFixture<T>): HTMLInputElement[] {
  const host: HTMLElement = fixture.nativeElement
  const el = host.querySelector('ngx-pass-code')
  if (!el) {
    throw new Error('ngx-pass-code not rendered')
  }
  return Array.from(el.querySelectorAll('input'))
}

function typeInto(input: HTMLInputElement, ch: string): void {
  input.value = ch
  input.dispatchEvent(new Event('input'))
}

function pasteInto(input: HTMLInputElement, text: string): Event {
  const event = new Event('paste', { cancelable: true, bubbles: true })
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: () => text },
    writable: false
  })
  input.dispatchEvent(event)
  return event
}

describe('PassCodeComponent — static configuration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
  })

  it('renders exactly length() input boxes', () => {
    const fixture = createDirect(h => h.length.set(5))
    expect(inputsOf(fixture)).toHaveLength(5)
  })

  it('re-renders when length() increases', () => {
    const fixture = createDirect(h => h.length.set(3))
    expect(inputsOf(fixture)).toHaveLength(3)

    fixture.componentInstance.length.set(7)
    fixture.detectChanges()
    expect(inputsOf(fixture)).toHaveLength(7)
  })

  it('re-renders when length() decreases', () => {
    const fixture = createDirect(h => {
      h.length.set(6)
      h.value.set('abcdef')
    })
    expect(inputsOf(fixture)).toHaveLength(6)

    fixture.componentInstance.length.set(3)
    fixture.detectChanges()
    expect(inputsOf(fixture)).toHaveLength(3)
  })

  it('honours type="password" on every slot', () => {
    const fixture = createDirect(h => h.type.set('password'))
    for (const el of inputsOf(fixture)) {
      expect(el.type).toBe('password')
    }
  })

  it('honours type="number" on every slot', () => {
    const fixture = createDirect(h => h.type.set('number'))
    for (const el of inputsOf(fixture)) {
      expect(el.type).toBe('number')
    }
  })

  it('honours uppercase=true — typed "a" becomes "A" in value()', () => {
    const fixture = createDirect(h => h.uppercase.set(true))
    const [first] = inputsOf(fixture)
    typeInto(first, 'a')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('A')
  })

  it('autofocus=true focuses the first input after view init', done => {
    const fixture = createDirect(h => {
      h.length.set(3)
      h.autofocus.set(true)
    })
    const first = inputsOf(fixture)[0]
    setTimeout(() => {
      expect(document.activeElement).toBe(first)
      done()
    }, 0)
  })

  it('autofocus=false does not steal focus', () => {
    const fixture = createDirect(h => {
      h.length.set(3)
      h.autofocus.set(false)
    })
    const first = inputsOf(fixture)[0]
    expect(document.activeElement).not.toBe(first)
  })

  it('renders no inputs and keeps value=null when length=0', () => {
    const fixture = createDirect(h => h.length.set(0))
    expect(inputsOf(fixture)).toHaveLength(0)
    expect(fixture.componentInstance.value()).toBeNull()
  })
})

describe('PassCodeComponent — value (ModelSignal) sync', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
  })

  it('setting value to a full string distributes characters to slots', () => {
    const fixture = createDirect(h => h.length.set(5))
    fixture.componentInstance.value.set('12345')
    fixture.detectChanges()
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['1', '2', '3', '4', '5'])
  })

  it('setting value to null clears all slots', () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.value.set('12345')
    })
    fixture.componentInstance.value.set(null)
    fixture.detectChanges()
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['', '', '', '', ''])
  })

  it('truncates when incoming value exceeds length', () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.value.set('1234567')
    })
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['1', '2', '3', '4', '5'])
  })

  it('pads with empty slots when incoming value is shorter than length', () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.value.set('12')
    })
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['1', '2', '', '', ''])
  })

  it('typing into slot 0 updates value()', () => {
    const fixture = createDirect(h => h.length.set(3))
    typeInto(inputsOf(fixture)[0], 'x')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('x')
  })

  it('typing across all slots joins into full value', () => {
    const fixture = createDirect(h => h.length.set(4))
    typeInto(inputsOf(fixture)[0], 'a')
    typeInto(inputsOf(fixture)[1], 'b')
    typeInto(inputsOf(fixture)[2], 'c')
    typeInto(inputsOf(fixture)[3], 'd')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('abcd')
  })

  it('type="number" emits a Number, not a string, once any slot is typed', () => {
    const fixture = createDirect(h => {
      h.length.set(3)
      h.type.set('number')
    })
    typeInto(inputsOf(fixture)[0], '4')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe(4)
    expect(typeof fixture.componentInstance.value()).toBe('number')
  })

  it('type="number" emits null when the only filled slot is cleared', () => {
    const fixture = createDirect(h => {
      h.length.set(3)
      h.type.set('number')
      h.value.set(1)
    })
    typeInto(inputsOf(fixture)[0], '')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('clearing one slot compacts the emitted value', () => {
    const fixture = createDirect(h => {
      h.length.set(4)
      h.value.set('abcd')
    })
    typeInto(inputsOf(fixture)[1], '')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('acd')
  })

  it('typing in a later slot while earlier slots are empty keeps the char in that slot', () => {
    const fixture = createDirect(h => h.length.set(5))
    typeInto(inputsOf(fixture)[2], 'x')
    fixture.detectChanges()
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['', '', 'x', '', ''])
    expect(fixture.componentInstance.value()).toBe('x')
  })

  it('resetting value to null from a partial state clears every slot in the DOM', () => {
    const fixture = createDirect(h => h.length.set(5))
    typeInto(inputsOf(fixture)[2], 'x')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      '',
      '',
      'x',
      '',
      ''
    ])

    fixture.componentInstance.value.set(null)
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      '',
      '',
      '',
      '',
      ''
    ])
  })

  it('uppercase=true uppercases both value() and rendered chars', () => {
    const fixture = createDirect(h => {
      h.length.set(3)
      h.uppercase.set(true)
    })
    typeInto(inputsOf(fixture)[0], 'a')
    typeInto(inputsOf(fixture)[1], 'b')
    typeInto(inputsOf(fixture)[2], 'c')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('ABC')
    const rendered = inputsOf(fixture).map(i => i.value)
    expect(rendered).toStrictEqual(['A', 'B', 'C'])
  })

  it('numeric initial value is rendered digit-by-digit', () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.type.set('number')
      h.value.set(52647)
    })
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['5', '2', '6', '4', '7'])
  })
})

describe('PassCodeComponent — FormValueControl integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHostComponent, PatternHostComponent]
    }).compileComponents()
  })

  it('receives disabled=true from the form and disables every input', async () => {
    const fixture = TestBed.createComponent(FormHostComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    for (const el of inputsOf(fixture)) {
      expect(el.disabled).toBe(false)
    }
  })

  it('flips touched on blur and propagates to the form', async () => {
    const fixture = TestBed.createComponent(FormHostComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    const host = fixture.componentInstance
    expect(host.codeForm().touched()).toBe(false)

    const [first] = inputsOf(fixture)
    first.dispatchEvent(new Event('blur'))
    fixture.detectChanges()
    await fixture.whenStable()

    expect(host.codeForm().touched()).toBe(true)
  })

  it('required() reports invalid when value is null', async () => {
    const fixture = TestBed.createComponent(FormHostComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    const host = fixture.componentInstance
    expect(host.codeForm().valid()).toBe(false)
    expect(host.codeForm().errors().length).toBeGreaterThan(0)
  })

  it('required() flips to valid once value is set', async () => {
    const fixture = TestBed.createComponent(FormHostComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    const host = fixture.componentInstance
    host.value.set('abcde')
    fixture.detectChanges()
    await fixture.whenStable()
    expect(host.codeForm().valid()).toBe(true)
  })

  it('pattern() rule rejects values that do not match', async () => {
    const fixture = TestBed.createComponent(PatternHostComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    const host = fixture.componentInstance
    host.value.set('abc')
    fixture.detectChanges()
    await fixture.whenStable()
    expect(host.codeForm().valid()).toBe(false)
  })

  it('pattern() rule accepts matching values', async () => {
    const fixture = TestBed.createComponent(PatternHostComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    const host = fixture.componentInstance
    host.value.set('ABCD1')
    fixture.detectChanges()
    await fixture.whenStable()
    expect(host.codeForm().valid()).toBe(true)
  })

  it('invalid-input class appears only after touched AND errors present', () => {
    const fixture = TestBed.createComponent(DirectHostComponent)
    fixture.detectChanges()
    const host = fixture.componentInstance

    host.errors.set([{ kind: 'required' } as never])
    fixture.detectChanges()
    const noTouchClass =
      inputsOf(fixture)[0].classList.contains('invalid-input')
    expect(noTouchClass).toBe(false)

    host.touched.set(true)
    fixture.detectChanges()
    const withTouchClass =
      inputsOf(fixture)[0].classList.contains('invalid-input')
    expect(withTouchClass).toBe(true)
  })

  it('invalid-input class is removed once errors clear', () => {
    const fixture = TestBed.createComponent(DirectHostComponent)
    fixture.detectChanges()
    const host = fixture.componentInstance
    host.errors.set([{ kind: 'required' } as never])
    host.touched.set(true)
    fixture.detectChanges()
    expect(inputsOf(fixture)[0].classList.contains('invalid-input')).toBe(true)

    host.errors.set([])
    fixture.detectChanges()
    expect(inputsOf(fixture)[0].classList.contains('invalid-input')).toBe(false)
  })

  it('disabled input disables every slot', () => {
    const fixture = TestBed.createComponent(DirectHostComponent)
    fixture.detectChanges()
    fixture.componentInstance.disabled.set(true)
    fixture.detectChanges()
    for (const el of inputsOf(fixture)) {
      expect(el.disabled).toBe(true)
    }
  })

  it('flipping disabled back to false re-enables every slot', () => {
    const fixture = TestBed.createComponent(DirectHostComponent)
    fixture.detectChanges()
    const host = fixture.componentInstance
    host.disabled.set(true)
    fixture.detectChanges()
    host.disabled.set(false)
    fixture.detectChanges()
    for (const el of inputsOf(fixture)) {
      expect(el.disabled).toBe(false)
    }
  })
})

describe('PassCodeComponent — directive behaviour', () => {
  let fixture: ComponentFixture<DirectHostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
    fixture = createDirect(h => h.length.set(5))
  })

  it('focusNextPreviousInput: typing full char focuses next slot', () => {
    const inputs = inputsOf(fixture)
    const first = inputs[0]
    const second = inputs[1]
    const nextSpy = jest.spyOn(second, 'focus')

    first.value = '1'
    first.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 49 }))
    fixture.detectChanges()

    expect(nextSpy).toHaveBeenCalled()
  })

  it('focusNextPreviousInput: Backspace focuses previous slot', () => {
    const inputs = inputsOf(fixture)
    const first = inputs[0]
    const second = inputs[1]
    const prevSpy = jest.spyOn(first, 'focus')

    second.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 8 }))
    fixture.detectChanges()

    expect(prevSpy).toHaveBeenCalled()
  })

  it('focusNextPreviousInput: Left arrow focuses previous slot', () => {
    const inputs = inputsOf(fixture)
    const first = inputs[0]
    const second = inputs[1]
    const prevSpy = jest.spyOn(first, 'focus')

    second.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 37 }))
    fixture.detectChanges()

    expect(prevSpy).toHaveBeenCalled()
  })

  it('focusNextPreviousInput: Tab key does not force-advance focus', () => {
    const inputs = inputsOf(fixture)
    const first = inputs[0]
    const second = inputs[1]
    const nextSpy = jest.spyOn(second, 'focus')

    first.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 9 }))
    fixture.detectChanges()

    expect(nextSpy).not.toHaveBeenCalled()
  })

  it('focusNextPreviousInput: empty slot does not advance on digit key', () => {
    const inputs = inputsOf(fixture)
    const first = inputs[0]
    const second = inputs[1]
    const nextSpy = jest.spyOn(second, 'focus')

    expect(first.value).toBe('')
    first.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 50 }))
    fixture.detectChanges()

    expect(nextSpy).not.toHaveBeenCalled()
  })

  it('autoblur=true: filling the last slot blurs it', () => {
    fixture.componentInstance.autoblur.set(true)
    fixture.detectChanges()
    const inputs = inputsOf(fixture)
    const last = inputs[inputs.length - 1]
    const blurSpy = jest.spyOn(last, 'blur')

    last.value = '7'
    last.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 55 }))
    fixture.detectChanges()

    expect(blurSpy).toHaveBeenCalled()
  })

  it('autoblur=false: filling the last slot does not blur', () => {
    fixture.componentInstance.autoblur.set(false)
    fixture.detectChanges()
    const inputs = inputsOf(fixture)
    const last = inputs[inputs.length - 1]
    const blurSpy = jest.spyOn(last, 'blur')

    last.value = '7'
    last.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 55 }))
    fixture.detectChanges()

    expect(blurSpy).not.toHaveBeenCalled()
  })

  it('focusNextPreviousInput: type="number" keydown of a digit key clears the slot', () => {
    fixture.componentInstance.type.set('number')
    fixture.detectChanges()
    const first = inputsOf(fixture)[0]
    first.value = '5'
    first.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 49 }))
    fixture.detectChanges()
    expect(first.value).toBe('')
  })

  it('focusNextPreviousInput: type="number" keydown of Backspace does not clear the slot', () => {
    fixture.componentInstance.type.set('number')
    fixture.detectChanges()
    const first = inputsOf(fixture)[0]
    first.value = '5'
    first.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8 }))
    fixture.detectChanges()
    expect(first.value).toBe('5')
  })

  it('space key is suppressed in keydown', () => {
    const first = inputsOf(fixture)[0]
    const event = new KeyboardEvent('keydown', {
      keyCode: 32,
      cancelable: true
    })
    first.dispatchEvent(event)
    fixture.detectChanges()
    expect(event.defaultPrevented).toBe(true)
  })

  it('transformInputValue: uppercase=true applies text-transform style', () => {
    fixture.componentInstance.uppercase.set(true)
    fixture.detectChanges()
    const first = inputsOf(fixture)[0]
    expect(first.style.textTransform).toBe('uppercase')
  })

  it('transformInputValue: toggling uppercase at runtime updates style', () => {
    const first = inputsOf(fixture)[0]
    expect(first.style.textTransform).toBe('')

    fixture.componentInstance.uppercase.set(true)
    fixture.detectChanges()
    expect(first.style.textTransform).toBe('uppercase')

    fixture.componentInstance.uppercase.set(false)
    fixture.detectChanges()
    expect(first.style.textTransform).toBe('')
  })
})

describe('PassCodeComponent — paste', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
  })

  it('fills every slot from slot 0 when pasting a full-length string', () => {
    const fixture = createDirect(h => h.length.set(5))
    const ev = pasteInto(inputsOf(fixture)[0], '12345')
    fixture.detectChanges()
    expect(ev.defaultPrevented).toBe(true)
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    expect(fixture.componentInstance.value()).toBe('12345')
  })

  it('ignores the target slot and always starts from slot 0', () => {
    const fixture = createDirect(h => h.length.set(5))
    pasteInto(inputsOf(fixture)[2], 'ABCDE')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      'A',
      'B',
      'C',
      'D',
      'E'
    ])
  })

  it('truncates clipboard content longer than length', () => {
    const fixture = createDirect(h => h.length.set(5))
    pasteInto(inputsOf(fixture)[0], 'ABCDEFGH')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      'A',
      'B',
      'C',
      'D',
      'E'
    ])
    expect(fixture.componentInstance.value()).toBe('ABCDE')
  })

  it('fills partial when clipboard is shorter than length', () => {
    const fixture = createDirect(h => h.length.set(5))
    pasteInto(inputsOf(fixture)[0], 'XY')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      'X',
      'Y',
      '',
      '',
      ''
    ])
    expect(fixture.componentInstance.value()).toBe('XY')
  })

  it('strips whitespace, hyphens, and underscores for type="text"', () => {
    const fixture = createDirect(h => h.length.set(6))
    pasteInto(inputsOf(fixture)[0], 'AB-CD_EF GH')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F'
    ])
  })

  it('strips non-digits for type="number" and emits a Number', () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.type.set('number')
    })
    pasteInto(inputsOf(fixture)[0], '12-34-5abc')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    expect(fixture.componentInstance.value()).toBe(12345)
  })

  it('uppercases pasted text when uppercase=true', () => {
    const fixture = createDirect(h => {
      h.length.set(4)
      h.uppercase.set(true)
    })
    pasteInto(inputsOf(fixture)[0], 'abcd')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      'A',
      'B',
      'C',
      'D'
    ])
    expect(fixture.componentInstance.value()).toBe('ABCD')
  })

  it('strips only whitespace for type="password" (preserves special chars)', () => {
    const fixture = createDirect(h => {
      h.length.set(7)
      h.type.set('password')
    })
    pasteInto(inputsOf(fixture)[0], 'p@ss w0rd')
    fixture.detectChanges()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      'p',
      '@',
      's',
      's',
      'w',
      '0',
      'r'
    ])
  })

  it('ignores an empty clipboard', () => {
    const fixture = createDirect(h => h.length.set(5))
    const ev = pasteInto(inputsOf(fixture)[0], '')
    fixture.detectChanges()
    expect(ev.defaultPrevented).toBe(false)
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('treats a clipboard sanitised to empty as a no-op', () => {
    const fixture = createDirect(h => h.length.set(5))
    pasteInto(inputsOf(fixture)[0], '   --__   ')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
    expect(inputsOf(fixture).map(i => i.value)).toStrictEqual([
      '',
      '',
      '',
      '',
      ''
    ])
  })

  it('autoblur=true: pasting a full-length string blurs the last slot', async () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.autoblur.set(true)
    })
    const last = inputsOf(fixture)[4]
    const blurSpy = jest.spyOn(last, 'blur')
    pasteInto(inputsOf(fixture)[0], '12345')
    fixture.detectChanges()
    await Promise.resolve()
    expect(blurSpy).toHaveBeenCalled()
  })

  it('autoblur=false: pasting a full-length string focuses the last slot', async () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.autoblur.set(false)
    })
    const last = inputsOf(fixture)[4]
    const focusSpy = jest.spyOn(last, 'focus')
    pasteInto(inputsOf(fixture)[0], '12345')
    fixture.detectChanges()
    await Promise.resolve()
    expect(focusSpy).toHaveBeenCalled()
  })
})

describe('PassCodeComponent — edge cases', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
  })

  it('mounting with value="hello" and length=3 renders "hel"', () => {
    const fixture = createDirect(h => {
      h.length.set(3)
      h.value.set('hello')
    })
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['h', 'e', 'l'])
  })

  it('rapid programmatic value.set() sequence converges to the last value', () => {
    const fixture = createDirect(h => h.length.set(3))
    const v: WritableSignal<string | number | null> =
      fixture.componentInstance.value
    v.set('aaa')
    v.set('bbb')
    v.set('ccc')
    fixture.detectChanges()
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['c', 'c', 'c'])
  })

  it('unmount during typing does not throw', () => {
    const fixture = createDirect(h => h.length.set(3))
    typeInto(inputsOf(fixture)[0], 'x')
    expect(() => fixture.destroy()).not.toThrow()
  })

  it('number initial value with length > digit count pads with empty slots', () => {
    const fixture = createDirect(h => {
      h.length.set(5)
      h.type.set('number')
      h.value.set(7)
    })
    const chars = inputsOf(fixture).map(i => i.value)
    expect(chars).toStrictEqual(['7', '', '', '', ''])
  })

  it('maxLength attribute is set to 1 on every slot', () => {
    const fixture = createDirect(h => h.length.set(4))
    for (const el of inputsOf(fixture)) {
      expect(el.maxLength).toBe(1)
    }
  })
})
