import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  untracked,
  viewChild
} from '@angular/core'
import { FormValueControl, ValidationError } from '@angular/forms/signals'
import { ITimeRange } from './time-range.model'

@Component({
  selector: 'ngx-time-range-form-field',
  templateUrl: './time-range-form-field.component.html',
  styleUrls: ['./time-range-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeRangeFormFieldComponent implements FormValueControl<ITimeRange | null> {
  readonly label = input('')
  readonly startPlaceholder = input('Start')
  readonly endPlaceholder = input('End')
  // Decoupled from the placeholder so a11y can use a stable description
  // even when the visible placeholder is empty or localised separately.
  // Default to the placeholder when not overridden.
  readonly startLabel = input<string | null>(null)
  readonly endLabel = input<string | null>(null)
  readonly resetLabel = input('Reset range')
  readonly readonly = input(false)
  readonly startReadonly = input(false)
  readonly endReadonly = input(false)
  readonly resettable = input(true)
  readonly required = input(false)

  // Native time-input attributes forwarded to both inputs.
  // `step` controls precision: 60 → HH:mm (default), 1 → HH:mm:ss.
  readonly step = input<number | string | null>(null)
  readonly autocomplete = input<string | null>(null)
  // Per-input form-field name (useful inside a <form> with native submit).
  readonly startName = input<string | null>(null)
  readonly endName = input<string | null>(null)
  // Per-side native HTML `min` / `max` attributes — purely for the browser's
  // built-in clamping; validation remains schema-driven.
  readonly startMin = input<string | null>(null)
  readonly startMax = input<string | null>(null)
  readonly endMin = input<string | null>(null)
  readonly endMax = input<string | null>(null)

  protected readonly resolvedStartLabel = computed(
    () => this.startLabel() ?? this.startPlaceholder()
  )
  protected readonly resolvedEndLabel = computed(
    () => this.endLabel() ?? this.endPlaceholder()
  )

  // Stable per-instance IDs so the visible label can be associated with
  // the group via aria-labelledby. Each input keeps its own aria-label
  // composed as "<group> <side>" so a screen reader announces the full
  // descriptor without hidden DOM trickery.
  protected readonly labelId = `ngx-trff-label-${++idCounter}`
  protected readonly startInputId = `${this.labelId}-start`
  protected readonly endInputId = `${this.labelId}-end`

  protected readonly composedStartLabel = computed(() => {
    const group = this.label()
    const side = this.resolvedStartLabel()
    return group ? `${group} ${side}` : side
  })
  protected readonly composedEndLabel = computed(() => {
    const group = this.label()
    const side = this.resolvedEndLabel()
    return group ? `${group} ${side}` : side
  })

  readonly value = model<ITimeRange | null>(null)
  readonly disabled = input(false)
  readonly touched = model(false)
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([])

  protected readonly isInvalid = computed(
    () => this.touched() && this.errors().length > 0
  )

  protected readonly hasValue = computed(() => {
    const v = this.value()
    return v !== null && (v.start !== null || v.end !== null)
  })

  protected readonly canReset = computed(
    () =>
      this.resettable() &&
      !this.readonly() &&
      !this.startReadonly() &&
      !this.endReadonly() &&
      !this.disabled() &&
      this.hasValue()
  )

  private readonly startInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('startInput')
  private readonly endInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('endInput')

  // Tracks the last value each DOM input emitted so we can tell an external
  // write (reset / patchValue) apart from a keystroke we just processed.
  // Without this, syncing the signal back into the input could clobber a
  // mid-edit value the user is still typing.
  private lastStartEmitted: string | null = null
  private lastEndEmitted: string | null = null

  constructor() {
    effect(() => {
      const v = this.value()
      const nextStart = v?.start ?? null
      const nextEnd = v?.end ?? null

      untracked(() => {
        const startEl = this.startInputRef().nativeElement
        const endEl = this.endInputRef().nativeElement

        if (nextStart !== this.lastStartEmitted) {
          startEl.value = nextStart ?? ''
          this.lastStartEmitted = nextStart
        }
        if (nextEnd !== this.lastEndEmitted) {
          endEl.value = nextEnd ?? ''
          this.lastEndEmitted = nextEnd
        }
      })
    })
  }

  protected onStartInput(event: Event): void {
    const start = normaliseTimeOrNull((event.target as HTMLInputElement).value)
    this.lastStartEmitted = start
    this.patch({ start })
  }

  protected onEndInput(event: Event): void {
    const end = normaliseTimeOrNull((event.target as HTMLInputElement).value)
    this.lastEndEmitted = end
    this.patch({ end })
  }

  protected onBlur(): void {
    this.touched.set(true)
  }

  protected reset(): void {
    this.value.set(null)
    this.touched.set(false)
  }

  private patch(partial: Partial<ITimeRange>): void {
    const current: ITimeRange = this.value() ?? { start: null, end: null }
    const next: ITimeRange = { ...current, ...partial }

    if (next.start === null && next.end === null) {
      this.value.set(null)
      return
    }

    this.value.set(next)
  }
}

let idCounter = 0

// Accept what `<input type="time">` actually emits: '' (cleared), 'HH:mm', or
// 'HH:mm:ss' (when step is sub-minute). Returns the raw string when valid so
// the wire format passes through unchanged; returns null otherwise.
function normaliseTimeOrNull(raw: string): string | null {
  if (raw === '') {
    return null
  }
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(raw) ? raw : null
}
