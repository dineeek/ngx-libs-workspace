import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import type { CountryCode } from 'libphonenumber-js/max'
import { PhoneFlagComponent } from './flag.component'

@Component({
  standalone: true,
  imports: [PhoneFlagComponent],
  template: `<ngx-phone-flag [country]="country()" [title]="title()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
  country = signal<CountryCode | null>(null)
  title = signal<string>('')
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

describe('PhoneFlagComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents()
  })

  it('renders an SVG flag for a known country', () => {
    const fixture = create(h => h.country.set('US'))
    const flag = (fixture.nativeElement as HTMLElement).querySelector('.flag')
    expect(flag?.querySelector('svg')).not.toBeNull()
    expect(flag?.classList.contains('flag--unknown')).toBe(false)
  })

  it('renders the fallback globe icon when country is null', () => {
    const fixture = create()
    const flag = (fixture.nativeElement as HTMLElement).querySelector('.flag')
    expect(flag?.classList.contains('flag--unknown')).toBe(true)
  })

  it('uses the title to build the aria-label', () => {
    const fixture = create(h => {
      h.country.set('GB')
      h.title.set('United Kingdom')
    })
    const flag = (fixture.nativeElement as HTMLElement).querySelector('.flag')
    expect(flag?.getAttribute('aria-label')).toBe('United Kingdom flag')
  })

  it('falls back to the country code in the aria-label when no title is given', () => {
    const fixture = create(h => h.country.set('DE'))
    const flag = (fixture.nativeElement as HTMLElement).querySelector('.flag')
    expect(flag?.getAttribute('aria-label')).toBe('DE flag')
  })

  it('renders the unknown placeholder when country has no flag asset', () => {
    const fixture = create(h => h.country.set('XX' as CountryCode))
    const flag = (fixture.nativeElement as HTMLElement).querySelector('.flag')
    expect(flag?.classList.contains('flag--unknown')).toBe(true)
  })

  it('updates the rendered flag when country input changes', () => {
    const fixture = create(h => h.country.set('US'))
    const before = (fixture.nativeElement as HTMLElement).querySelector(
      '.flag'
    )?.innerHTML
    fixture.componentInstance.country.set('JP')
    fixture.detectChanges()
    const after = (fixture.nativeElement as HTMLElement).querySelector(
      '.flag'
    )?.innerHTML
    expect(after).not.toBe(before)
  })
})
