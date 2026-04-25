import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  disabled,
  form,
  FormField,
  readonly,
  required,
  ValidationError
} from '@angular/forms/signals'
import { NumericRangeFormFieldComponent } from './numeric-range-form-field.component'
import { INumericRange } from './numeric-range.model'
import { numericRangeOrderValid } from './validators/numeric-range-order'

@Component({
  standalone: true,
  imports: [NumericRangeFormFieldComponent],
  template: `
    <ngx-numeric-range-form-field
      [(value)]="value"
      [label]="label()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [minReadonly]="minReadonly()"
      [maxReadonly]="maxReadonly()"
      [resettable]="resettable()"
      [required]="required()"
      [errors]="errors()"
      [minLabel]="minLabel()"
      [maxLabel]="maxLabel()"
      [resetLabel]="resetLabel()"
      [(touched)]="touched"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DirectHostComponent {
  value = signal<INumericRange | null>(null)
  touched = signal(false)
  label = signal('')
  disabled = signal(false)
  readonly = signal(false)
  minReadonly = signal(false)
  maxReadonly = signal(false)
  resettable = signal(true)
  required = signal(false)
  errors = signal<readonly ValidationError.WithOptionalFieldTree[]>([])
  minLabel = signal<string | null>(null)
  maxLabel = signal<string | null>(null)
  resetLabel = signal('Reset range')
}

@Component({
  standalone: true,
  imports: [NumericRangeFormFieldComponent, FormField],
  template: `
    <ngx-numeric-range-form-field [formField]="field" label="range" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class RequiredHostComponent {
  value = signal<INumericRange | null>(null)
  field = form<INumericRange | null>(this.value, p => {
    required(p)
    numericRangeOrderValid(p)
  })
}

@Component({
  standalone: true,
  imports: [NumericRangeFormFieldComponent, FormField],
  template: `
    <ngx-numeric-range-form-field [formField]="field" label="range" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ReadonlyHostComponent {
  value = signal<INumericRange | null>({ minimum: 1, maximum: 9 })
  field = form<INumericRange | null>(this.value, p => {
    readonly(p, () => true)
  })
}

@Component({
  standalone: true,
  imports: [NumericRangeFormFieldComponent, FormField],
  template: `
    <ngx-numeric-range-form-field [formField]="field" label="range" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DisabledHostComponent {
  value = signal<INumericRange | null>({ minimum: 1, maximum: 9 })
  flag = signal(true)
  field = form<INumericRange | null>(this.value, p => {
    disabled(p, () => this.flag())
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
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll('input')
  )
}

function typeInto(input: HTMLInputElement, raw: string): void {
  input.value = raw
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

function blur(input: HTMLInputElement): void {
  input.dispatchEvent(new Event('blur', { bubbles: true }))
}

describe('NumericRangeFormFieldComponent — direct binding', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
  })

  it('renders two inputs', () => {
    const fixture = createDirect()
    expect(inputsOf(fixture)).toHaveLength(2)
  })

  it('shows the label when provided', () => {
    const fixture = createDirect(h => h.label.set('Range'))
    const label = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__label'
    )
    expect(label?.textContent?.trim()).toContain('Range')
  })

  it('renders the required asterisk when required=true', () => {
    const fixture = createDirect(h => {
      h.label.set('Range')
      h.required.set(true)
    })
    const marker = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__required'
    )
    expect(marker).not.toBeNull()
  })

  it('writes value from minimum input typing', () => {
    const fixture = createDirect()
    const [min] = inputsOf(fixture)
    typeInto(min, '42')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toEqual({
      minimum: 42,
      maximum: null
    })
  })

  it('writes value from maximum input typing', () => {
    const fixture = createDirect()
    const [, max] = inputsOf(fixture)
    typeInto(max, '99')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toEqual({
      minimum: null,
      maximum: 99
    })
  })

  it('rejects Infinity as input — emits null for that side', () => {
    const fixture = createDirect()
    const [min] = inputsOf(fixture)
    typeInto(min, 'Infinity')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('rejects -Infinity as input — emits null for that side', () => {
    const fixture = createDirect()
    const [, max] = inputsOf(fixture)
    typeInto(max, '-Infinity')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('emits null when both inputs are cleared', () => {
    const fixture = createDirect(h => h.value.set({ minimum: 1, maximum: 2 }))
    const [min, max] = inputsOf(fixture)
    typeInto(min, '')
    typeInto(max, '')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('reflects incoming value on the inputs', () => {
    const fixture = createDirect(h => h.value.set({ minimum: 10, maximum: 50 }))
    const [min, max] = inputsOf(fixture)
    expect(min.value).toBe('10')
    expect(max.value).toBe('50')
  })

  it('does not re-write the DOM when an input event arrives with an unchanged numeric value', () => {
    // Simulates the transient "1." state during decimal typing: the string
    // changed but Number("1.") === Number("1") so the signal shouldn't move.
    // The effect must not clobber the user's in-flight text.
    const fixture = createDirect()
    const [, max] = inputsOf(fixture)

    typeInto(max, '1')
    fixture.detectChanges()
    expect(max.value).toBe('1')

    // Force the DOM into a string state jsdom can hold (type='number'
    // normalizes "1."), then fire an input event that parses to the same
    // numeric value. Nothing should re-write the DOM.
    max.value = '01'
    max.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()
    expect(max.value).toBe('01')
    expect(fixture.componentInstance.value()).toEqual({
      minimum: null,
      maximum: 1
    })
  })

  it('marks touched on blur', () => {
    const fixture = createDirect()
    blur(inputsOf(fixture)[0])
    fixture.detectChanges()
    expect(fixture.componentInstance.touched()).toBe(true)
  })

  it('propagates disabled to inputs', () => {
    const fixture = createDirect(h => h.disabled.set(true))
    for (const input of inputsOf(fixture)) {
      expect(input.disabled).toBe(true)
    }
  })

  it('propagates readonly to inputs and hides the reset button', () => {
    const fixture = createDirect(h => {
      h.readonly.set(true)
      h.value.set({ minimum: 1, maximum: 2 })
    })
    for (const input of inputsOf(fixture)) {
      expect(input.readOnly).toBe(true)
    }
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset).toBeNull()
  })

  it('shows the reset button when value is present and resettable', () => {
    const fixture = createDirect(h => h.value.set({ minimum: 1, maximum: 2 }))
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    ) as HTMLButtonElement | null
    expect(reset).not.toBeNull()
  })

  it('hides the reset button when resettable=false', () => {
    const fixture = createDirect(h => {
      h.value.set({ minimum: 1, maximum: 2 })
      h.resettable.set(false)
    })
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset).toBeNull()
  })

  it('clears value and touched when reset button is clicked', () => {
    const fixture = createDirect(h => {
      h.value.set({ minimum: 1, maximum: 2 })
      h.touched.set(true)
    })
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    ) as HTMLButtonElement
    reset.click()
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
    expect(fixture.componentInstance.touched()).toBe(false)
  })

  it('adds field--invalid class when touched with errors', () => {
    const fixture = createDirect(h => {
      h.errors.set([
        { kind: 'invalidRange' } as ValidationError.WithoutFieldTree
      ])
      h.touched.set(true)
    })
    const field = (fixture.nativeElement as HTMLElement).querySelector('.field')
    expect(field?.classList.contains('field--invalid')).toBe(true)
  })

  it('does not add field--invalid class when errors exist but untouched', () => {
    const fixture = createDirect(h =>
      h.errors.set([
        { kind: 'invalidRange' } as ValidationError.WithoutFieldTree
      ])
    )
    const field = (fixture.nativeElement as HTMLElement).querySelector('.field')
    expect(field?.classList.contains('field--invalid')).toBe(false)
  })

  it('falls back to placeholders for input aria-labels by default', () => {
    const fixture = createDirect()
    const [min, max] = inputsOf(fixture)
    expect(min.getAttribute('aria-label')).toBe('From')
    expect(max.getAttribute('aria-label')).toBe('To')
  })

  it('uses resetLabel as the reset button aria-label', () => {
    const fixture = createDirect(h => h.value.set({ minimum: 1, maximum: 2 }))
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset?.getAttribute('aria-label')).toBe('Reset range')
  })

  it('honours custom minLabel / maxLabel / resetLabel overrides', () => {
    const fixture = createDirect(h => {
      h.value.set({ minimum: 1, maximum: 2 })
      h.minLabel.set('Lower bound')
      h.maxLabel.set('Upper bound')
      h.resetLabel.set('Clear range')
    })
    const [min, max] = inputsOf(fixture)
    expect(min.getAttribute('aria-label')).toBe('Lower bound')
    expect(max.getAttribute('aria-label')).toBe('Upper bound')
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset?.getAttribute('aria-label')).toBe('Clear range')
  })
})

describe('NumericRangeFormFieldComponent — schema-driven [formField]', () => {
  it('reports invalid when required and value is null', async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(RequiredHostComponent)
    fixture.detectChanges()

    expect(fixture.componentInstance.field().valid()).toBe(false)
  })

  it('reports invalidRange when max < min', async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(RequiredHostComponent)
    fixture.componentInstance.value.set({ minimum: 10, maximum: 5 })
    fixture.detectChanges()

    const kinds = fixture.componentInstance
      .field()
      .errors()
      .map(e => e.kind)
    expect(kinds).toContain('invalidRange')
  })

  it('honours schema-driven readonly', async () => {
    await TestBed.configureTestingModule({
      imports: [ReadonlyHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(ReadonlyHostComponent)
    fixture.detectChanges()

    for (const input of inputsOf(fixture)) {
      expect(input.readOnly).toBe(true)
    }
  })

  it('honours schema-driven disabled', async () => {
    await TestBed.configureTestingModule({
      imports: [DisabledHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(DisabledHostComponent)
    fixture.detectChanges()

    for (const input of inputsOf(fixture)) {
      expect(input.disabled).toBe(true)
    }

    fixture.componentInstance.flag.set(false)
    fixture.detectChanges()
    for (const input of inputsOf(fixture)) {
      expect(input.disabled).toBe(false)
    }
  })
})
