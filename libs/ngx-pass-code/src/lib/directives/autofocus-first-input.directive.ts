import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  inject
} from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[autofocusFirstInput]'
})
export class AutofocusFirstInputDirective implements AfterViewInit {
  private elementRef = inject(ElementRef)

  @Input() autofocus = false

  ngAfterViewInit() {
    if (this.autofocus) {
      const firstInput = this.elementRef.nativeElement.querySelector(
        'input'
      ) as HTMLInputElement

      // wait for control value set so it can be selected and overridden on typing
      setTimeout(() => {
        firstInput.focus()
        firstInput.select()
      })
    }
  }
}
