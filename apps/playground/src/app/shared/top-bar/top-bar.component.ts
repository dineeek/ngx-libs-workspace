import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'ngx-libs-workspace-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class TopBarComponent {
  protected readonly npmUrl = 'https://www.npmjs.com/package/ngx-pass-code'
  protected readonly repoUrl = 'https://github.com/dineeek/ngx-libs-workspace'
}
