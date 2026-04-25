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
import { TimeRangeFormFieldComponent } from './time-range-form-field.component'
import { ITimeRange } from './time-range.model'
import { timeRangeOrderValid } from './validators/time-range-order'

@Component({
  standalone: true,
  imports: [TimeRangeFormFieldComponent],
  template: `
    <ngx-time-range-form-field
      [(value)]="value"
      [label]="label()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [startReadonly]="startReadonly()"
      [endReadonly]="endReadonly()"
      [resettable]="resettable()"
      [required]="required()"
      [errors]="errors()"
      [startLabel]="startLabel()"
      [endLabel]="endLabel()"
      [resetLabel]="resetLabel()"
      [(touched)]="touched"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DirectHostComponent {
  value = signal<ITimeRange | null>(null)
  touched = signal(false)
  label = signal('')
  disabled = signal(false)
  readonly = signal(false)
  startReadonly = signal(false)
  endReadonly = signal(false)
  resettable = signal(true)
  required = signal(false)
  errors = signal<readonly ValidationError.WithOptionalFieldTree[]>([])
  startLabel = signal<string | null>(null)
  endLabel = signal<string | null>(null)
  resetLabel = signal('Reset range')
}

@Component({
  standalone: true,
  imports: [TimeRangeFormFieldComponent, FormField],
  template: ` <ngx-time-range-form-field [formField]="field" label="range" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class RequiredHostComponent {
  value = signal<ITimeRange | null>(null)
  field = form<ITimeRange | null>(this.value, p => {
    required(p)
    timeRangeOrderValid(p)
  })
}

@Component({
  standalone: true,
  imports: [TimeRangeFormFieldComponent, FormField],
  template: ` <ngx-time-range-form-field [formField]="field" label="range" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ReadonlyHostComponent {
  value = signal<ITimeRange | null>({ start: '09:00', end: '17:00' })
  field = form<ITimeRange | null>(this.value, p => {
    readonly(p, () => true)
  })
}

@Component({
  standalone: true,
  imports: [TimeRangeFormFieldComponent, FormField],
  template: ` <ngx-time-range-form-field [formField]="field" label="range" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DisabledHostComponent {
  value = signal<ITimeRange | null>({ start: '09:00', end: '17:00' })
  flag = signal(true)
  field = form<ITimeRange | null>(this.value, p => {
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

describe('TimeRangeFormFieldComponent — direct binding', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
  })

  it('renders two inputs', () => {
    const fixture = createDirect()
    expect(inputsOf(fixture)).toHaveLength(2)
  })

  it('renders both inputs as type="time"', () => {
    const fixture = createDirect()
    for (const input of inputsOf(fixture)) {
      expect(input.getAttribute('type')).toBe('time')
    }
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

  it('writes value from start input typing', () => {
    const fixture = createDirect()
    const [start] = inputsOf(fixture)
    typeInto(start, '09:30')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toEqual({
      start: '09:30',
      end: null
    })
  })

  it('writes value from end input typing', () => {
    const fixture = createDirect()
    const [, end] = inputsOf(fixture)
    typeInto(end, '17:45')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toEqual({
      start: null,
      end: '17:45'
    })
  })

  it('accepts HH:mm:ss precision', () => {
    const fixture = createDirect()
    const [start] = inputsOf(fixture)
    typeInto(start, '09:30:45')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toEqual({
      start: '09:30:45',
      end: null
    })
  })

  it('rejects malformed times — emits null for that side', () => {
    const fixture = createDirect()
    const [start] = inputsOf(fixture)
    typeInto(start, '25:99')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('rejects non-time strings — emits null for that side', () => {
    const fixture = createDirect()
    const [, end] = inputsOf(fixture)
    typeInto(end, 'not a time')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('emits null when both inputs are cleared', () => {
    const fixture = createDirect(h =>
      h.value.set({ start: '09:00', end: '17:00' })
    )
    const [start, end] = inputsOf(fixture)
    typeInto(start, '')
    typeInto(end, '')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('reflects incoming value on the inputs', () => {
    const fixture = createDirect(h =>
      h.value.set({ start: '09:00', end: '17:00' })
    )
    const [start, end] = inputsOf(fixture)
    expect(start.value).toBe('09:00')
    expect(end.value).toBe('17:00')
  })

  it('does not re-write the DOM when an input event arrives with an unchanged value', () => {
    // The lastEmitted bookkeeping should keep the effect from clobbering the
    // DOM when a parsed value matches what we just observed from the input.
    const fixture = createDirect()
    const [, end] = inputsOf(fixture)

    typeInto(end, '17:00')
    fixture.detectChanges()
    expect(end.value).toBe('17:00')

    // Patch the same value externally — the effect should treat it as a no-op
    // for the DOM input since lastEndEmitted already matches.
    fixture.componentInstance.value.set({ start: null, end: '17:00' })
    fixture.detectChanges()
    expect(end.value).toBe('17:00')
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
      h.value.set({ start: '09:00', end: '17:00' })
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
    const fixture = createDirect(h =>
      h.value.set({ start: '09:00', end: '17:00' })
    )
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    ) as HTMLButtonElement | null
    expect(reset).not.toBeNull()
  })

  it('hides the reset button when resettable=false', () => {
    const fixture = createDirect(h => {
      h.value.set({ start: '09:00', end: '17:00' })
      h.resettable.set(false)
    })
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset).toBeNull()
  })

  it('clears value and touched when reset button is clicked', () => {
    const fixture = createDirect(h => {
      h.value.set({ start: '09:00', end: '17:00' })
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
    const [start, end] = inputsOf(fixture)
    expect(start.getAttribute('aria-label')).toBe('Start')
    expect(end.getAttribute('aria-label')).toBe('End')
  })

  it('uses resetLabel as the reset button aria-label', () => {
    const fixture = createDirect(h =>
      h.value.set({ start: '09:00', end: '17:00' })
    )
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset?.getAttribute('aria-label')).toBe('Reset range')
  })

  it('forwards step / autocomplete / per-side min,max,name attributes to the inputs', async () => {
    @Component({
      standalone: true,
      imports: [TimeRangeFormFieldComponent],
      template: `
        <ngx-time-range-form-field
          [step]="1"
          autocomplete="off"
          startMin="09:00"
          startMax="17:00"
          endMin="09:00"
          endMax="17:00"
          startName="rangeStart"
          endName="rangeEnd"
        />
      `,
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    class AttrHostComponent {}

    await TestBed.configureTestingModule({
      imports: [AttrHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(AttrHostComponent)
    fixture.detectChanges()

    const [start, end] = inputsOf(fixture)
    expect(start.getAttribute('step')).toBe('1')
    expect(start.getAttribute('autocomplete')).toBe('off')
    expect(start.getAttribute('min')).toBe('09:00')
    expect(start.getAttribute('max')).toBe('17:00')
    expect(start.getAttribute('name')).toBe('rangeStart')
    expect(end.getAttribute('name')).toBe('rangeEnd')
  })

  it('omits step / autocomplete / min / max / name attributes by default', () => {
    const fixture = createDirect()
    const [start, end] = inputsOf(fixture)
    for (const attr of ['step', 'autocomplete', 'min', 'max', 'name']) {
      expect(start.getAttribute(attr)).toBeNull()
      expect(end.getAttribute(attr)).toBeNull()
    }
  })

  it('associates the visible label with the group via aria-labelledby and composes per-input aria-labels', () => {
    const fixture = createDirect(h => h.label.set('Working hours'))
    const group = (fixture.nativeElement as HTMLElement).querySelector(
      '.field'
    ) as HTMLElement
    const labelEl = group.querySelector('.field__label')

    expect(labelEl?.id).toBeTruthy()
    expect(group.getAttribute('aria-labelledby')).toBe(labelEl?.id ?? '')

    const [start, end] = inputsOf(fixture)
    expect(start.id).toBe(`${labelEl?.id}-start`)
    expect(end.id).toBe(`${labelEl?.id}-end`)
    expect(start.getAttribute('aria-label')).toBe('Working hours Start')
    expect(end.getAttribute('aria-label')).toBe('Working hours End')
  })

  it('does not set aria-labelledby on the group when no visible label is given', () => {
    const fixture = createDirect()
    const group = (fixture.nativeElement as HTMLElement).querySelector('.field')
    expect(group?.getAttribute('aria-labelledby')).toBeNull()
  })

  it('startReadonly disables only the start input and hides the reset button', () => {
    const fixture = createDirect(h => {
      h.startReadonly.set(true)
      h.value.set({ start: '09:00', end: '17:00' })
    })
    const [start, end] = inputsOf(fixture)
    expect(start.readOnly).toBe(true)
    expect(end.readOnly).toBe(false)
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset).toBeNull()
  })

  it('endReadonly disables only the end input and hides the reset button', () => {
    const fixture = createDirect(h => {
      h.endReadonly.set(true)
      h.value.set({ start: '09:00', end: '17:00' })
    })
    const [start, end] = inputsOf(fixture)
    expect(start.readOnly).toBe(false)
    expect(end.readOnly).toBe(true)
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset).toBeNull()
  })

  it('reset button stays visible when neither side is readonly and a value exists', () => {
    const fixture = createDirect(h =>
      h.value.set({ start: '09:00', end: '17:00' })
    )
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset).not.toBeNull()
  })

  it('hides the reset button when the field is disabled', () => {
    const fixture = createDirect(h => {
      h.value.set({ start: '09:00', end: '17:00' })
      h.disabled.set(true)
    })
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset).toBeNull()
  })

  it('composes <group> <custom side> when both a visible label and per-side overrides are set', () => {
    const fixture = createDirect(h => {
      h.label.set('Working hours')
      h.startLabel.set('Open')
      h.endLabel.set('Close')
    })
    const [start, end] = inputsOf(fixture)
    expect(start.getAttribute('aria-label')).toBe('Working hours Open')
    expect(end.getAttribute('aria-label')).toBe('Working hours Close')
  })

  it('honours custom startLabel / endLabel / resetLabel overrides', () => {
    const fixture = createDirect(h => {
      h.value.set({ start: '09:00', end: '17:00' })
      h.startLabel.set('Open')
      h.endLabel.set('Close')
      h.resetLabel.set('Clear hours')
    })
    const [start, end] = inputsOf(fixture)
    expect(start.getAttribute('aria-label')).toBe('Open')
    expect(end.getAttribute('aria-label')).toBe('Close')
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    )
    expect(reset?.getAttribute('aria-label')).toBe('Clear hours')
  })
})

describe('TimeRangeFormFieldComponent — schema-driven [formField]', () => {
  it('reports invalid when required and value is null', async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(RequiredHostComponent)
    fixture.detectChanges()

    expect(fixture.componentInstance.field().valid()).toBe(false)
  })

  it('reports invalidRange when end < start', async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(RequiredHostComponent)
    fixture.componentInstance.value.set({ start: '17:00', end: '09:00' })
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
