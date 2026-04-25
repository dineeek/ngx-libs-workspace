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
import type { CountryCode } from 'libphonenumber-js/max'
import { PhoneFormFieldComponent } from './phone-form-field.component'
import { phoneValid } from './validators/phone-valid'

@Component({
  standalone: true,
  imports: [PhoneFormFieldComponent],
  template: `
    <ngx-phone-form-field
      [(value)]="value"
      [label]="label()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [resettable]="resettable()"
      [required]="required()"
      [errors]="errors()"
      [initialCountry]="initialCountry()"
      [countries]="countries()"
      [format]="format()"
      [(touched)]="touched"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DirectHostComponent {
  value = signal<string | null>(null)
  touched = signal(false)
  label = signal('')
  disabled = signal(false)
  readonly = signal(false)
  resettable = signal(true)
  required = signal(false)
  format = signal(true)
  errors = signal<readonly ValidationError.WithOptionalFieldTree[]>([])
  initialCountry = signal<CountryCode | null>('US')
  countries = signal<readonly CountryCode[] | null>(null)
}

@Component({
  standalone: true,
  imports: [PhoneFormFieldComponent, FormField],
  template: `
    <ngx-phone-form-field
      [formField]="field"
      label="phone"
      initialCountry="US"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class RequiredHostComponent {
  value = signal<string | null>(null)
  field = form<string | null>(this.value, p => {
    required(p)
    phoneValid(p)
  })
}

@Component({
  standalone: true,
  imports: [PhoneFormFieldComponent, FormField],
  template: `
    <ngx-phone-form-field
      [formField]="field"
      label="phone"
      initialCountry="US"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ReadonlyHostComponent {
  value = signal<string | null>('+12015550123')
  field = form<string | null>(this.value, p => {
    readonly(p, () => true)
  })
}

@Component({
  standalone: true,
  imports: [PhoneFormFieldComponent, FormField],
  template: `
    <ngx-phone-form-field
      [formField]="field"
      label="phone"
      initialCountry="US"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class DisabledHostComponent {
  value = signal<string | null>('+12015550123')
  flag = signal(true)
  field = form<string | null>(this.value, p => {
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

function numberInput(fixture: ComponentFixture<unknown>): HTMLInputElement {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '.field__input'
  ) as HTMLInputElement
}

function trigger(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '.picker__trigger'
  ) as HTMLButtonElement
}

function typeInto(input: HTMLInputElement, raw: string): void {
  input.value = raw
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('PhoneFormFieldComponent — direct binding', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostComponent]
    }).compileComponents()
  })

  it('renders the country picker trigger and the number input', () => {
    const fixture = createDirect()
    expect(trigger(fixture)).not.toBeNull()
    expect(numberInput(fixture)).not.toBeNull()
  })

  it('shows the label when provided', () => {
    const fixture = createDirect(h => h.label.set('Mobile'))
    const label = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__label'
    )
    expect(label?.textContent?.trim()).toContain('Mobile')
  })

  it('renders the required asterisk when required=true', () => {
    const fixture = createDirect(h => {
      h.label.set('Mobile')
      h.required.set(true)
    })
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.field__required')
    ).not.toBeNull()
  })

  it('starts with the initialCountry on the trigger', () => {
    const fixture = createDirect()
    const dial = trigger(fixture).querySelector('.picker__dial')
    expect(dial?.textContent?.trim()).toBe('+1')
  })

  it('emits a partial E.164 while the user types', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '201')
    fixture.detectChanges()
    const v = fixture.componentInstance.value()
    expect(v).toBeTruthy()
    expect(v!.startsWith('+1')).toBe(true)
  })

  it('emits a full E.164 when the typed number is valid', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '2015550123')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('+12015550123')
  })

  it('formats the input as the user types when format=true', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '2015550123')
    fixture.detectChanges()
    const input = numberInput(fixture)
    expect(input.value).toContain('(201)')
  })

  it('does not format the input when format=false', () => {
    const fixture = createDirect(h => h.format.set(false))
    typeInto(numberInput(fixture), '2015550123')
    fixture.detectChanges()
    const input = numberInput(fixture)
    expect(input.value).toBe('2015550123')
  })

  it('parses a pasted international E.164 and switches the country', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '+442079460000')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('+442079460000')
    const dial = trigger(fixture).querySelector('.picker__dial')
    expect(dial?.textContent?.trim()).toBe('+44')
  })

  it('clears value when the input is emptied', () => {
    const fixture = createDirect(h => h.value.set('+12015550123'))
    typeInto(numberInput(fixture), '')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('reflects an external value on the input', () => {
    const fixture = createDirect(h => h.value.set('+442079460000'))
    expect(numberInput(fixture).value.length).toBeGreaterThan(0)
    const dial = trigger(fixture).querySelector('.picker__dial')
    expect(dial?.textContent?.trim()).toBe('+44')
  })

  it('marks touched on blur', () => {
    const fixture = createDirect()
    numberInput(fixture).dispatchEvent(new Event('blur', { bubbles: true }))
    fixture.detectChanges()
    expect(fixture.componentInstance.touched()).toBe(true)
  })

  it('propagates disabled to the input', () => {
    const fixture = createDirect(h => h.disabled.set(true))
    expect(numberInput(fixture).disabled).toBe(true)
  })

  it('propagates readonly to the input and hides the reset button', () => {
    const fixture = createDirect(h => {
      h.value.set('+12015550123')
      h.readonly.set(true)
    })
    expect(numberInput(fixture).readOnly).toBe(true)
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.field__reset')
    ).toBeNull()
  })

  it('shows the reset button when value is present', () => {
    const fixture = createDirect(h => h.value.set('+12015550123'))
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.field__reset')
    ).not.toBeNull()
  })

  it('hides the reset button when resettable=false', () => {
    const fixture = createDirect(h => {
      h.value.set('+12015550123')
      h.resettable.set(false)
    })
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.field__reset')
    ).toBeNull()
  })

  it('clears value, touched and re-applies initial country on reset', () => {
    const fixture = createDirect(h => {
      h.value.set('+442079460000')
      h.touched.set(true)
    })
    fixture.detectChanges()
    const reset = (fixture.nativeElement as HTMLElement).querySelector(
      '.field__reset'
    ) as HTMLButtonElement
    reset.click()
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
    expect(fixture.componentInstance.touched()).toBe(false)
    const dial = trigger(fixture).querySelector('.picker__dial')
    expect(dial?.textContent?.trim()).toBe('+1') // back to initialCountry US
  })

  it('changes country and re-emits with the new dial code', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '2015550123')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('+12015550123')

    // Open the picker and select GB.
    trigger(fixture).click()
    fixture.detectChanges()
    const opts = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.picker__option')
    ) as HTMLLIElement[]
    const gb = opts.find(o =>
      o.textContent?.toLowerCase().includes('united kingdom')
    )!
    gb.click()
    fixture.detectChanges()

    const v = fixture.componentInstance.value()
    expect(v).toBeTruthy()
    expect(v!.startsWith('+44')).toBe(true)
  })

  it('adds field--invalid when touched with errors', () => {
    const fixture = createDirect(h => {
      h.errors.set([
        { kind: 'invalidPhone' } as ValidationError.WithoutFieldTree
      ])
      h.touched.set(true)
    })
    const field = (fixture.nativeElement as HTMLElement).querySelector('.field')
    expect(field?.classList.contains('field--invalid')).toBe(true)
  })

  it('does not add field--invalid when errors exist but untouched', () => {
    const fixture = createDirect(h =>
      h.errors.set([
        { kind: 'invalidPhone' } as ValidationError.WithoutFieldTree
      ])
    )
    const field = (fixture.nativeElement as HTMLElement).querySelector('.field')
    expect(field?.classList.contains('field--invalid')).toBe(false)
  })

  it('restricts the picker list when [countries] is provided', () => {
    const fixture = createDirect(h =>
      h.countries.set(['US', 'GB'] as readonly CountryCode[])
    )
    trigger(fixture).click()
    fixture.detectChanges()
    const opts = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.picker__option'
    )
    expect(opts.length).toBe(2)
  })

  it('emits +<dialCode><digits> for input that AsYouType cannot parse yet', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '2')
    fixture.detectChanges()
    const v = fixture.componentInstance.value()
    expect(v).toBe('+12')
  })

  it('emits +<digits> verbatim when the user types a leading +', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '+4')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBe('+4')
  })

  it('emits null when the typed input has no digits and no leading +', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), 'abc')
    fixture.detectChanges()
    expect(fixture.componentInstance.value()).toBeNull()
  })

  it('keeps a stripped fallback in the input when an external value cannot be parsed', () => {
    const fixture = createDirect()
    // Externally write a value libphonenumber-js cannot parse.
    fixture.componentInstance.value.set('+1abc')
    fixture.detectChanges()
    // The input should NOT be blank — the previous behaviour was to clear
    // it whenever parsing failed, leaving the model populated but the UI
    // empty.
    expect(numberInput(fixture).value).toBe('abc')
  })

  it('clears the displayed input when the model is externally set to null', () => {
    const fixture = createDirect()
    typeInto(numberInput(fixture), '2015550123')
    fixture.detectChanges()
    expect(numberInput(fixture).value).not.toBe('')

    fixture.componentInstance.value.set(null)
    fixture.detectChanges()
    expect(numberInput(fixture).value).toBe('')
  })

  it('preserves the typed + when changing country with format=false', () => {
    const fixture = createDirect(h => h.format.set(false))
    typeInto(numberInput(fixture), '+12015550123')
    fixture.detectChanges()

    trigger(fixture).click()
    fixture.detectChanges()
    const opts = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.picker__option')
    ) as HTMLLIElement[]
    const gb = opts.find(o =>
      o.textContent?.toLowerCase().includes('united kingdom')
    )!
    gb.click()
    fixture.detectChanges()

    const v = fixture.componentInstance.value()
    expect(v).toBeTruthy()
    expect(v!.startsWith('+')).toBe(true)
  })
})

describe('PhoneFormFieldComponent — schema-driven [formField]', () => {
  it('reports invalid when required and value is null', async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(RequiredHostComponent)
    fixture.detectChanges()
    expect(fixture.componentInstance.field().valid()).toBe(false)
  })

  it('reports invalidPhone for an unparseable string', async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(RequiredHostComponent)
    fixture.componentInstance.value.set('+1abc')
    fixture.detectChanges()
    const kinds = fixture.componentInstance
      .field()
      .errors()
      .map(e => e.kind)
    expect(kinds).toContain('invalidPhone')
  })

  it('honours schema-driven readonly', async () => {
    await TestBed.configureTestingModule({
      imports: [ReadonlyHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(ReadonlyHostComponent)
    fixture.detectChanges()
    expect(numberInput(fixture).readOnly).toBe(true)
  })

  it('honours schema-driven disabled', async () => {
    await TestBed.configureTestingModule({
      imports: [DisabledHostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(DisabledHostComponent)
    fixture.detectChanges()
    expect(numberInput(fixture).disabled).toBe(true)

    fixture.componentInstance.flag.set(false)
    fixture.detectChanges()
    expect(numberInput(fixture).disabled).toBe(false)
  })
})
