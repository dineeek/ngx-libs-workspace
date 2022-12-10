import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[autofocusFirstInput]',
})
export class AutofocusFirstInputDirective implements AfterViewInit {
  @Input() autofocus = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.autofocus) {
      const firstInput = this.elementRef.nativeElement.querySelector(
        'input'
      ) as HTMLInputElement;

      // wait for control value set so it can be selected and overridden on typing
      setTimeout(() => {
        firstInput.focus();
        firstInput.select();
      });
    }
  }
}
