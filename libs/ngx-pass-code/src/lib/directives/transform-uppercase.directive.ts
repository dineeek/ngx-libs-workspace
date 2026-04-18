import { Directive, ElementRef, effect, inject, input } from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[transformInputValue]'
})
export class TransformInputValueDirective {
  private el: ElementRef<HTMLElement> = inject(ElementRef)

  readonly uppercase = input(false)

  constructor() {
    effect(() => {
      this.el.nativeElement.style.textTransform = this.uppercase()
        ? 'uppercase'
        : ''
    })
  }
}
