import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focusNextPreviousInput]',
})
export class FocusNextPreviousInputDirective {
  private BACKSPACE_KEY = 8;
  private TAB_KEY = 9;
  private DELETE_KEY = 46;
  private LEFT_ARROW_KEY = 37;
  private SPACE_KEY = 32;

  constructor(private elementRef: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    if (e.keyCode == this.SPACE_KEY) {
      e.preventDefault();
    }

    if (
      e.srcElement.type === 'number' &&
      e.which !== this.DELETE_KEY &&
      e.which !== this.BACKSPACE_KEY
    ) {
      e.srcElement.value = e.srcElement.value.substring(0, 0);
      return;
    }
  }

  @HostListener('keyup', ['$event']) onKeyUp(e: any) {
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

      if (previousControl) {
        previousControl.focus();
        previousControl.select();
      }
    }
  }
}
