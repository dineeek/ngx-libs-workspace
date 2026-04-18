import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'ngx-libs-workspace-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class HomeComponent {
  protected readonly installCmd = 'npm install ngx-pass-code'
  protected readonly npmUrl = 'https://www.npmjs.com/package/ngx-pass-code'

  protected copyInstall(): void {
    if (!navigator.clipboard) return
    void navigator.clipboard.writeText(this.installCmd)
  }
}
