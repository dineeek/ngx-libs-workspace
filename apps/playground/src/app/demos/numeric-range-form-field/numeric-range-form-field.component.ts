import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { INumericRange } from 'ngx-numeric-range-form-field'

@Component({
  selector: 'ngx-libs-workspace-numeric-range-form-field-demo',
  templateUrl: './numeric-range-form-field.component.html',
  styleUrls: ['./numeric-range-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NumericRangeFormFieldDemoComponent {
  protected readonly basicForm = new FormGroup({
    range: new FormControl<INumericRange | null>({ minimum: 10, maximum: 50 })
  })

  protected readonly validatedForm = new FormGroup({
    range: new FormControl<INumericRange | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ])
  })

  protected readonly readonlyForm = new FormGroup({
    range: new FormControl<INumericRange | null>({ minimum: 1, maximum: 9 })
  })

  protected readonly basicBadges = ['reactive', 'resettable']
  protected readonly validatedBadges = ['required', 'min=0', 'max=100']
  protected readonly readonlyBadges = ['readonly']

  protected readonly basicEvents = signal<string[]>([])
  protected readonly validatedEvents = signal<string[]>([])

  protected readonly basicSnippet = `form = new FormGroup({
  range: new FormControl<INumericRange | null>({ minimum: 10, maximum: 50 })
})

/*
 * template
 * <ngx-numeric-range-form-field
 *   formControlName="range"
 *   label="Pick a range"
 *   (numericRangeChanged)="onChange($event)"
 * />
 */`

  protected readonly validatedSnippet = `form = new FormGroup({
  range: new FormControl<INumericRange | null>(null, [
    Validators.required,
    Validators.min(0),
    Validators.max(100)
  ])
})

/*
 * template
 * <ngx-numeric-range-form-field
 *   formControlName="range"
 *   label="0 – 100"
 *   [required]="true"
 * />
 */`

  protected readonly readonlySnippet = `form = new FormGroup({
  range: new FormControl<INumericRange | null>({ minimum: 1, maximum: 9 })
})

/*
 * template
 * <ngx-numeric-range-form-field
 *   formControlName="range"
 *   label="Frozen range"
 *   [readonly]="true"
 *   [resettable]="false"
 * />
 */`

  protected resetBasic(): void {
    this.basicForm.reset()
    this.basicEvents.set([])
  }

  protected patchBasic(): void {
    this.basicForm.patchValue({ range: { minimum: 25, maximum: 75 } })
  }

  protected onBasicChange(value: INumericRange | null): void {
    const next = [`change → ${JSON.stringify(value)}`, ...this.basicEvents()]
    this.basicEvents.set(next.slice(0, 5))
  }

  protected onBasicBlur(): void {
    const next = [`blur`, ...this.basicEvents()]
    this.basicEvents.set(next.slice(0, 5))
  }

  protected resetValidated(): void {
    this.validatedForm.reset()
    this.validatedEvents.set([])
  }

  protected onValidatedEnter(): void {
    const next = [`enter`, ...this.validatedEvents()]
    this.validatedEvents.set(next.slice(0, 5))
  }

  protected onValidatedChange(value: INumericRange | null): void {
    const next = [
      `change → ${JSON.stringify(value)}`,
      ...this.validatedEvents()
    ]
    this.validatedEvents.set(next.slice(0, 5))
  }
}
