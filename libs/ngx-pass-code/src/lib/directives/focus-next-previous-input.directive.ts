import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[focusNextPreviousInput]',
})
export class FocusNextPreviousInputDirective {
  private BACKSPACE_KEY = 8;
  private TAB_KEY = 9;
  private DELETE_KEY = 46;

  constructor(private elementRef: ElementRef) {}

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {
      e.preventDefault();

      let nextControl = e.srcElement.nextElementSibling;

      if (!nextControl) {
        return;
      }

      if (
        nextControl.type === e.srcElement.type &&
        e.which !== this.BACKSPACE_KEY &&
        e.which !== this.TAB_KEY &&
        e.which !== this.DELETE_KEY
      ) {
        nextControl.focus();
        nextControl.select();
        return;
      }

      nextControl = nextControl.nextElementSibling;
    }

    if (e.which === this.DELETE_KEY || e.which === this.BACKSPACE_KEY) {
      e.preventDefault();

      let previousControl = e.srcElement.previousElementSibling;

      if (!previousControl) {
        return;
      }

      if (previousControl.type === e.srcElement.type) {
        previousControl.focus();
        previousControl.select();
        return;
      }

      previousControl = previousControl.previousElementSibling;
    }
  }
}
