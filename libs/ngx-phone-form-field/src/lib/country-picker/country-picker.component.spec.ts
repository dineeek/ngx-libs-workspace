import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import type { CountryCode } from 'libphonenumber-js/max'
import { PhoneCountryPickerComponent } from './country-picker.component'
import { IPhoneCountry } from '../phone.model'

const SAMPLE: readonly IPhoneCountry[] = [
  { iso2: 'US', name: 'United States', dialCode: '1' },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '44' },
  { iso2: 'DE', name: 'Germany', dialCode: '49' },
  { iso2: 'HR', name: 'Croatia', dialCode: '385' },
  { iso2: 'JP', name: 'Japan', dialCode: '81' }
]

@Component({
  standalone: true,
  imports: [PhoneCountryPickerComponent],
  template: `
    <ngx-phone-country-picker
      [countries]="countries()"
      [selected]="selected()"
      [disabled]="disabled()"
      (countrySelected)="onSelect($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
  countries = signal<readonly IPhoneCountry[]>(SAMPLE)
  selected = signal<CountryCode | null>('US')
  disabled = signal(false)
  emitted = signal<CountryCode | null>(null)
  onSelect = (c: CountryCode): void => this.emitted.set(c)
}

function create(
  setup?: (host: HostComponent) => void
): ComponentFixture<HostComponent> {
  const fixture = TestBed.createComponent(HostComponent)
  if (setup) {
    setup(fixture.componentInstance)
  }
  fixture.detectChanges()
  return fixture
}

function trigger(fixture: ComponentFixture<HostComponent>): HTMLButtonElement {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '.picker__trigger'
  ) as HTMLButtonElement
}

function popover(fixture: ComponentFixture<HostComponent>): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(
    '.picker__popover'
  )
}

function options(fixture: ComponentFixture<HostComponent>): HTMLLIElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll('.picker__option')
  )
}

function searchInput(
  fixture: ComponentFixture<HostComponent>
): HTMLInputElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector('.picker__search')
}

describe('PhoneCountryPickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents()
  })

  it('renders the trigger with the selected country', () => {
    const fixture = create()
    const dial = trigger(fixture).querySelector('.picker__dial')
    expect(dial?.textContent?.trim()).toBe('+1')
  })

  it('opens the popover on trigger click', () => {
    const fixture = create()
    expect(popover(fixture)).toBeNull()
    trigger(fixture).click()
    fixture.detectChanges()
    expect(popover(fixture)).not.toBeNull()
  })

  it('closes the popover on second trigger click', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()
    trigger(fixture).click()
    fixture.detectChanges()
    expect(popover(fixture)).toBeNull()
  })

  it('renders one option per country in the input list', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()
    expect(options(fixture)).toHaveLength(SAMPLE.length)
  })

  it('filters options by name (case-insensitive)', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const search = searchInput(fixture)!
    search.value = 'germ'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    expect(options(fixture)).toHaveLength(1)
    expect(options(fixture)[0]!.textContent).toContain('Germany')
  })

  it('filters options by dial code', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const search = searchInput(fixture)!
    search.value = '385'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    expect(options(fixture)).toHaveLength(1)
    expect(options(fixture)[0]!.textContent).toContain('Croatia')
  })

  it('renders an empty-state row when no options match', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const search = searchInput(fixture)!
    search.value = 'nonexistentcountryxyz'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    const empty = (fixture.nativeElement as HTMLElement).querySelector(
      '.picker__empty'
    )
    expect(empty).not.toBeNull()
  })

  it('emits the selected country on option click', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const opts = options(fixture)
    const gb = opts.find(o => o.textContent?.includes('United Kingdom'))!
    gb.click()
    fixture.detectChanges()

    expect(fixture.componentInstance.emitted()).toBe('GB')
  })

  it('closes the popover after selecting a country', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()
    options(fixture)[0]!.click()
    fixture.detectChanges()
    expect(popover(fixture)).toBeNull()
  })

  it('moves the active option with ArrowDown / ArrowUp', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const search = searchInput(fixture)!
    const before = options(fixture).findIndex(o =>
      o.classList.contains('picker__option--active')
    )

    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    fixture.detectChanges()
    const afterDown = options(fixture).findIndex(o =>
      o.classList.contains('picker__option--active')
    )
    expect(afterDown).toBe((before + 1) % SAMPLE.length)

    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    fixture.detectChanges()
    const afterUp = options(fixture).findIndex(o =>
      o.classList.contains('picker__option--active')
    )
    expect(afterUp).toBe(before)
  })

  it('selects the active option on Enter', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const search = searchInput(fixture)!
    // Active starts on the selected (US). Move down to GB.
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    fixture.detectChanges()
    const activeBefore = options(fixture).find(o =>
      o.classList.contains('picker__option--active')
    )
    const expected = activeBefore!.getAttribute('id')
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    fixture.detectChanges()

    expect(fixture.componentInstance.emitted()).toBeTruthy()
    expect(expected).toContain('opt-')
  })

  it('closes the popover on Escape', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()
    expect(popover(fixture)).not.toBeNull()

    searchInput(fixture)!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' })
    )
    fixture.detectChanges()
    expect(popover(fixture)).toBeNull()
  })

  it('closes the popover on outside click', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()
    expect(popover(fixture)).not.toBeNull()

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    fixture.detectChanges()
    expect(popover(fixture)).toBeNull()
  })

  it('does not open when disabled', () => {
    const fixture = create(h => h.disabled.set(true))
    trigger(fixture).click()
    fixture.detectChanges()
    expect(popover(fixture)).toBeNull()
  })

  it('marks the trigger with aria-expanded', () => {
    const fixture = create()
    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('false')
    trigger(fixture).click()
    fixture.detectChanges()
    expect(trigger(fixture).getAttribute('aria-expanded')).toBe('true')
  })

  it('renders only the supplied countries', () => {
    const subset: readonly IPhoneCountry[] = [
      { iso2: 'US', name: 'United States', dialCode: '1' },
      { iso2: 'GB', name: 'United Kingdom', dialCode: '44' }
    ]
    const fixture = create(h => h.countries.set(subset))
    trigger(fixture).click()
    fixture.detectChanges()
    expect(options(fixture)).toHaveLength(2)
  })

  it('renders the placeholder trigger when no country is selected', () => {
    const fixture = create(h => h.selected.set(null))
    const dial = trigger(fixture).querySelector('.picker__dial')
    expect(dial?.classList.contains('picker__dial--placeholder')).toBe(true)
  })

  it('opens on ArrowDown when the trigger has focus', () => {
    const fixture = create()
    trigger(fixture).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown' })
    )
    fixture.detectChanges()
    expect(popover(fixture)).not.toBeNull()
  })

  it('opens on Enter when the trigger has focus', () => {
    const fixture = create()
    trigger(fixture).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter' })
    )
    fixture.detectChanges()
    expect(popover(fixture)).not.toBeNull()
  })

  it('opens on Space when the trigger has focus', () => {
    const fixture = create()
    trigger(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    fixture.detectChanges()
    expect(popover(fixture)).not.toBeNull()
  })

  it('ignores trigger keydown when disabled', () => {
    const fixture = create(h => h.disabled.set(true))
    trigger(fixture).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter' })
    )
    fixture.detectChanges()
    expect(popover(fixture)).toBeNull()
  })

  it('Home jumps the active option to the first row', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const search = searchInput(fixture)!
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    fixture.detectChanges()

    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }))
    fixture.detectChanges()

    const idx = options(fixture).findIndex(o =>
      o.classList.contains('picker__option--active')
    )
    expect(idx).toBe(0)
  })

  it('End jumps the active option to the last row', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    searchInput(fixture)!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End' })
    )
    fixture.detectChanges()

    const idx = options(fixture).findIndex(o =>
      o.classList.contains('picker__option--active')
    )
    expect(idx).toBe(SAMPLE.length - 1)
  })

  it('ignores unhandled keys without throwing', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()
    expect(() =>
      searchInput(fixture)!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a' })
      )
    ).not.toThrow()
  })

  it('updates the active option on mouseenter', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    const opts = options(fixture)
    opts[2]!.dispatchEvent(new Event('mouseenter', { bubbles: true }))
    fixture.detectChanges()

    expect(opts[2]!.classList.contains('picker__option--active')).toBe(true)
  })

  it('closes on a document-level Escape keydown', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()
    expect(popover(fixture)).not.toBeNull()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    fixture.detectChanges()
    expect(popover(fixture)).toBeNull()
  })

  it('clamps activeIndex to 0 after filtering shrinks the list past it', () => {
    const fixture = create()
    trigger(fixture).click()
    fixture.detectChanges()

    // Move active to last row.
    searchInput(fixture)!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End' })
    )
    fixture.detectChanges()

    // Filter so only one option remains — active must clamp into range.
    const search = searchInput(fixture)!
    search.value = 'germ'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    const idx = options(fixture).findIndex(o =>
      o.classList.contains('picker__option--active')
    )
    expect(idx).toBe(0)
  })

  it('Enter with no active option is a no-op', () => {
    const fixture = create(h => h.selected.set(null))
    trigger(fixture).click()
    fixture.detectChanges()

    const search = searchInput(fixture)!
    search.value = 'nonexistentcountryxyz'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    fixture.detectChanges()

    expect(fixture.componentInstance.emitted()).toBeNull()
  })
})
