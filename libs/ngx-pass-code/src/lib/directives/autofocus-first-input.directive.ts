import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input
} from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[autofocusFirstInput]'
})
export class AutofocusFirstInputDirective implements AfterViewInit {
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef)

  readonly autofocus = input(false)

  ngAfterViewInit(): void {
    if (!this.autofocus()) {
      return
    }

    const firstInput =
      this.elementRef.nativeElement.querySelector<HTMLInputElement>('input')

    if (!firstInput) {
      return
    }

    setTimeout(() => {
      firstInput.focus()
      firstInput.select()
    })
  }
}
