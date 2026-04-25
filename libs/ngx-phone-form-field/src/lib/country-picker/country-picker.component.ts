import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild
} from '@angular/core'
import type { CountryCode } from 'libphonenumber-js/max'
import { PhoneFlagComponent } from '../flag/flag.component'
import { IPhoneCountry } from '../phone.model'

@Component({
  selector: 'ngx-phone-country-picker',
  templateUrl: './country-picker.component.html',
  styleUrls: ['./country-picker.component.scss'],
  imports: [PhoneFlagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneCountryPickerComponent {
  private readonly host = inject(ElementRef<HTMLElement>)

  readonly countries = input<readonly IPhoneCountry[]>([])
  readonly selected = input<CountryCode | null>(null)
  readonly disabled = input(false)
  readonly searchPlaceholder = input('Search country')

  readonly countrySelected = output<CountryCode>()

  protected readonly open = signal(false)
  protected readonly searchTerm = signal('')
  protected readonly activeIndex = signal(-1)

  private readonly searchInputRef =
    viewChild<ElementRef<HTMLInputElement>>('searchInput')

  protected readonly listboxId = `ngx-pff-listbox-${++idCounter}`

  protected readonly selectedEntry = computed<IPhoneCountry | null>(() => {
    const sel = this.selected()
    if (!sel) {
      return null
    }
    return this.countries().find(c => c.iso2 === sel) ?? null
  })

  protected readonly filtered = computed<readonly IPhoneCountry[]>(() => {
    const q = this.searchTerm().trim().toLowerCase()
    const list = this.countries()
    if (!q) {
      return list
    }
    return list.filter(
      c => c.name.toLowerCase().includes(q) || c.dialCode.includes(q)
    )
  })

  constructor() {
    effect(() => {
      const isOpen = this.open()
      if (isOpen) {
        // Reset filter + active row to the current selection on open.
        const list = untracked(() => this.filtered())
        const current = untracked(() => this.selected())
        const idx = current ? list.findIndex(c => c.iso2 === current) : -1
        this.activeIndex.set(idx >= 0 ? idx : list.length > 0 ? 0 : -1)
        queueMicrotask(() => this.searchInputRef()?.nativeElement.focus())
      } else {
        this.searchTerm.set('')
        this.activeIndex.set(-1)
      }
    })

    effect(() => {
      // Keep the activeIndex in range as the filtered list changes.
      const len = this.filtered().length
      // Read activeIndex reactively so the scroll re-runs when the highlight
      // moves via keyboard navigation, not just when the filtered list changes.
      const idx = this.activeIndex()
      untracked(() => {
        if (idx >= len) {
          this.activeIndex.set(len > 0 ? 0 : -1)
        }
        // Look up the active option directly via class instead of a singular
        // viewChild bound to a template ref repeated on every <li> — that
        // pattern returns the *first* match in document order, so the scroll
        // never targeted the actually-active row.
        const node = this.host.nativeElement.querySelector<HTMLLIElement>(
          '.picker__option--active'
        )
        if (node && typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({ block: 'nearest' })
        }
      })
    })
  }

  protected toggle(): void {
    if (this.disabled()) {
      return
    }
    this.open.update(o => !o)
  }

  protected close(): void {
    this.open.set(false)
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return
    }
    if (
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      this.open.set(true)
    }
  }

  protected onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value)
    this.activeIndex.set(this.filtered().length > 0 ? 0 : -1)
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    const list = this.filtered()
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (list.length > 0) {
          this.activeIndex.update(i => (i + 1) % list.length)
        }
        return
      case 'ArrowUp':
        event.preventDefault()
        if (list.length > 0) {
          this.activeIndex.update(i => (i <= 0 ? list.length - 1 : i - 1))
        }
        return
      case 'Home':
        event.preventDefault()
        if (list.length > 0) {
          this.activeIndex.set(0)
        }
        return
      case 'End':
        event.preventDefault()
        if (list.length > 0) {
          this.activeIndex.set(list.length - 1)
        }
        return
      case 'Enter':
        event.preventDefault()
        {
          const idx = this.activeIndex()
          const item = idx >= 0 ? list[idx] : undefined
          if (item) {
            this.select(item.iso2)
          }
        }
        return
      case 'Escape':
        event.preventDefault()
        this.close()
        return
      default:
        return
    }
  }

  protected onOptionMouseEnter(index: number): void {
    this.activeIndex.set(index)
  }

  protected select(iso: CountryCode): void {
    this.countrySelected.emit(iso)
    this.close()
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return
    }
    const root = this.host.nativeElement
    if (!root.contains(event.target as Node)) {
      this.close()
    }
  }

  @HostListener('document:keydown.escape')
  protected onDocumentEscape(): void {
    if (this.open()) {
      this.close()
    }
  }
}

let idCounter = 0
