import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
  signal
} from '@angular/core'

/**
 * Truncation detection mode for {@link OverflowTooltipDirective}.
 *
 * - `auto` (default) — fires when the host element overflows on either axis.
 *   Matches both single-line ellipsis (`text-overflow: ellipsis`) and
 *   multi-line clamping (`-webkit-line-clamp` / `display: -webkit-box`).
 * - `single` — only checks `scrollWidth > clientWidth`. Use when the host
 *   is a single-line text node.
 * - `multi` — only checks `scrollHeight > clientHeight`. Use when the host
 *   wraps to a fixed number of lines.
 */
export type OverflowTooltipMode = 'auto' | 'single' | 'multi'

/**
 * Standalone directive that flags whether the host element's text is
 * ellipsized / truncated. Re-measures on layout changes via
 * `ResizeObserver` and on content changes via `MutationObserver`, with
 * rAF coalescing so back-to-back triggers run a single check.
 *
 * The directive does not render anything on its own — it exposes a
 * reactive `isTruncated` signal that the host template can read via the
 * `exportAs` ref. Compose with Angular Material's `MatTooltip` (or any
 * other tooltip surface) to show the full text only when the visible
 * text is actually clipped:
 *
 * ```html
 * <span
 *   ngxOverflowTooltip
 *   #oft="ngxOverflowTooltip"
 *   class="single-line"
 *   [matTooltip]="fullText"
 *   [matTooltipDisabled]="!oft.isTruncated()"
 * >
 *   {{ fullText }}
 * </span>
 * ```
 *
 * Native browser APIs only — no Angular Material peer dependency, no
 * polyfills required (skips silently when `ResizeObserver` is missing,
 * e.g. in SSR).
 */
@Directive({
  selector: '[ngxOverflowTooltip]',
  exportAs: 'ngxOverflowTooltip'
})
export class OverflowTooltipDirective {
  /**
   * Truncation detection mode. Aliased so the directive can be configured
   * inline: `[ngxOverflowTooltip]="'single'"`. Defaults to `auto`.
   */
  readonly mode = input<OverflowTooltipMode>('auto', {
    alias: 'ngxOverflowTooltip'
  })

  /**
   * Reactive truncation flag. `true` while the host element's text content
   * overflows on the axis selected by `mode`. Read from a template via the
   * `exportAs` ref or inject the directive in code.
   */
  readonly isTruncated = signal(false)

  /** Emits whenever `isTruncated` flips. */
  readonly truncatedChange = output<boolean>()

  private readonly host =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly ngZone = inject(NgZone)

  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver
  private rafHandle: number | null = null

  constructor() {
    afterNextRender(() => this.startObserving())

    // Mode changes don't trigger ResizeObserver / MutationObserver — schedule
    // a manual re-check so the flag follows the new axis immediately.
    effect(() => {
      this.mode()
      if (this.resizeObserver !== undefined) {
        this.scheduleCheck()
      }
    })

    inject(DestroyRef).onDestroy(() => this.cleanup())
  }

  private startObserving(): void {
    if (typeof ResizeObserver === 'undefined') {
      // SSR / older browser fallback — no measurements possible. Leave the
      // signal at `false` and skip wiring observers altogether.
      return
    }

    // Observers don't need to participate in change detection — measurements
    // happen out-of-zone and only `signal.set` re-enters when the value flips.
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.scheduleCheck())
      this.resizeObserver.observe(this.host)

      if (typeof MutationObserver !== 'undefined') {
        this.mutationObserver = new MutationObserver(() => this.scheduleCheck())
        this.mutationObserver.observe(this.host, {
          childList: true,
          subtree: true,
          characterData: true
        })
      }
    })

    this.runCheck()
  }

  private scheduleCheck(): void {
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle)
    }
    this.rafHandle = requestAnimationFrame(() => {
      this.rafHandle = null
      this.runCheck()
    })
  }

  private runCheck(): void {
    const node = this.host
    const m = this.mode()
    let truncated: boolean
    if (m === 'single') {
      truncated = node.scrollWidth > node.clientWidth
    } else if (m === 'multi') {
      truncated = node.scrollHeight > node.clientHeight
    } else {
      truncated =
        node.scrollWidth > node.clientWidth ||
        node.scrollHeight > node.clientHeight
    }

    if (truncated !== this.isTruncated()) {
      this.isTruncated.set(truncated)
      this.truncatedChange.emit(truncated)
    }
  }

  private cleanup(): void {
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle)
      this.rafHandle = null
    }
    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()
  }
}
