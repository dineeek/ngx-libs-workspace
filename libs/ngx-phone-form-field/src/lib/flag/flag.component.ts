import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import * as Flags from 'country-flag-icons/string/3x2'
import type { CountryCode } from 'libphonenumber-js/max'

const FLAG_LOOKUP = Flags as unknown as Record<string, string | undefined>

@Component({
  selector: 'ngx-phone-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneFlagComponent {
  private readonly sanitizer = inject(DomSanitizer)

  readonly country = input<CountryCode | null>(null)
  readonly title = input<string>('')

  protected readonly svg = computed<SafeHtml | null>(() => {
    const code = this.country()
    if (!code) {
      return null
    }
    const raw = FLAG_LOOKUP[code]
    if (!raw) {
      return null
    }
    return this.sanitizer.bypassSecurityTrustHtml(raw)
  })

  protected readonly label = computed(() => {
    const t = this.title()
    if (t) {
      return `${t} flag`
    }
    const c = this.country()
    return c ? `${c} flag` : 'unknown flag'
  })
}
