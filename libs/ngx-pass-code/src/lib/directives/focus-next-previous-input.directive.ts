import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focusNextPreviousInput]',
})
export class FocusNextPreviousInputDirective {
  private BACKSPACE_KEY = 8;
  private TAB_KEY = 9;
  private DELETE_KEY = 46;
  private LEFT_ARROW_KEY = 37;

  constructor(private elementRef: ElementRef) {}

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {
      e.preventDefault();

      const nextControl = e.srcElement.nextElementSibling;

      if (!nextControl) {
        return;
      }

      if (
        e.which !== this.BACKSPACE_KEY &&
        e.which !== this.TAB_KEY &&
        e.which !== this.DELETE_KEY &&
        e.which !== this.LEFT_ARROW_KEY
      ) {
        nextControl.focus();
        nextControl.select();
      }
    }

    if (e.which === this.DELETE_KEY || e.which === this.BACKSPACE_KEY) {
      e.preventDefault();

      const previousControl = e.srcElement.previousElementSibling;

      console.log('LEFT', previousControl);
      if (previousControl) {
        previousControl.focus();
        previousControl.select();
      }
    }
  }
}
