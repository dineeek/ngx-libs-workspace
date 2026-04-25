import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'

type LibCard = {
  readonly name: string
  readonly npm: string
  readonly route: string
  readonly tagline: string
  readonly preview: string
  readonly npmUrl: string
  readonly bullets: readonly string[]
}

@Component({
  selector: 'ngx-libs-workspace-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class HomeComponent {
  protected readonly libs: readonly LibCard[] = [
    {
      name: 'ngx-pass-code',
      npm: 'ngx-pass-code',
      route: '/ngx-pass-code',
      tagline:
        'OTP / pass-code input — one box per character. Autofocus, autoblur, paste-anywhere, exact-length validation.',
      preview: 'assets/preview-pass-code.png',
      npmUrl: 'https://www.npmjs.com/package/ngx-pass-code',
      bullets: [
        'text · number · password',
        'paste-anywhere',
        'passCodeComplete'
      ]
    },
    {
      name: 'ngx-numeric-range-form-field',
      npm: 'ngx-numeric-range-form-field',
      route: '/ngx-numeric-range-form-field',
      tagline:
        'Composite numeric range — two number inputs, one value. Four composable validators for order, bounds, completeness and span.',
      preview: 'assets/preview-numeric-range.png',
      npmUrl: 'https://www.npmjs.com/package/ngx-numeric-range-form-field',
      bullets: [
        'numericRangeOrderValid',
        'numericRangeBounds',
        'numericRangeWidth'
      ]
    },
    {
      name: 'ngx-phone-form-field',
      npm: 'ngx-phone-form-field',
      route: '/ngx-phone-form-field',
      tagline:
        'International phone number input. Country picker with SVG flags, AsYouType formatting via libphonenumber-js, E.164 output.',
      preview: 'assets/preview-phone.png',
      npmUrl: 'https://www.npmjs.com/package/ngx-phone-form-field',
      bullets: ['country picker', 'AsYouType format', 'phoneTypeIn validator']
    }
  ]

  protected readonly copiedNpm = signal<string | null>(null)

  protected copyInstall(pkg: string): void {
    if (!navigator.clipboard) {
      return
    }
    void navigator.clipboard.writeText(`npm install ${pkg}`).then(() => {
      this.copiedNpm.set(pkg)
      setTimeout(() => {
        if (this.copiedNpm() === pkg) {
          this.copiedNpm.set(null)
        }
      }, 1500)
    })
  }
}
