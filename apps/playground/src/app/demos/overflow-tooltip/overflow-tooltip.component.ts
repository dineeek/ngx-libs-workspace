import { ChangeDetectionStrategy, Component, signal } from '@angular/core'

@Component({
  selector: 'ngx-libs-workspace-overflow-tooltip-demo',
  templateUrl: './overflow-tooltip.component.html',
  styleUrls: ['./overflow-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class OverflowTooltipDemoComponent {
  protected readonly singleLineRows = signal<
    ReadonlyArray<{ name: string; id: string }>
  >([
    {
      name: 'Engineering · Platform · Observability',
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
    },
    {
      name: 'Marketing · Lifecycle',
      id: '0042'
    },
    {
      name: 'Customer Success · Strategic Accounts · EMEA · DACH',
      id: 'cs-emea-dach-strategic-2026-q2-cohort-eu'
    }
  ])

  protected readonly description = signal(
    `The overflow-tooltip directive watches its host element with both ResizeObserver and MutationObserver, so the truncated flag stays in sync whether the layout shrinks, the line-height changes, or the rendered content is patched at runtime. It is intentionally headless — bring your own tooltip.`
  )

  protected readonly liveText = signal('Type to add more content…')

  protected readonly singleSnippet = `<span
  ngxOverflowTooltip
  #oft="ngxOverflowTooltip"
  class="single-line"
  [title]="oft.isTruncated() ? fullText : ''"
>
  {{ fullText }}
</span>`

  protected readonly multiSnippet = `<p
  [ngxOverflowTooltip]="'multi'"
  #oft="ngxOverflowTooltip"
  class="clamp-3"
>
  {{ longDescription }}
</p>
@if (oft.isTruncated()) {
  <button (click)="expand.set(true)">Read more</button>
}`

  protected readonly liveSnippet = `<!-- MutationObserver re-checks when content changes -->
<span ngxOverflowTooltip #oft="ngxOverflowTooltip" class="single-line">
  {{ liveText() }}
</span>
<small *ngIf="oft.isTruncated()">truncated</small>`

  protected readonly matTooltipSnippet = `<!-- Recommended composition with Angular Material -->
<span
  ngxOverflowTooltip
  #oft="ngxOverflowTooltip"
  class="single-line"
  [matTooltip]="fullText"
  [matTooltipDisabled]="!oft.isTruncated()"
>
  {{ fullText }}
</span>`

  protected readonly multiExpanded = signal(false)

  protected setLive(event: Event): void {
    this.liveText.set((event.target as HTMLInputElement).value)
  }

  protected toggleMultiExpanded(): void {
    this.multiExpanded.update(v => !v)
  }
}
