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
  private RIGHT_ARROW_KEY = 39;
  private SPACE_KEY = 32;

  constructor(private elementRef: ElementRef) {}

  @HostListener('keyup', ['$event']) onKeyUp(e: any) {
    e.preventDefault();

    if (
      e.keyCode === this.LEFT_ARROW_KEY ||
      e.keyCode === this.DELETE_KEY ||
      e.keyCode === this.BACKSPACE_KEY
    ) {
      this.goPrevious(e);
      return;
    }

    // allow jumping across
    if (e.keyCode === this.RIGHT_ARROW_KEY || e.keyCode === this.TAB_KEY) {
      this.goNext(e);
      return;
    }

    if (e.srcElement.maxLength === e.srcElement.value.length) {
      this.goNext(e);
    }
  }

  private goPrevious(e: any): void {
    const previousControl = e.srcElement.previousElementSibling;

    if (previousControl) {
      previousControl.focus();
      previousControl.select();
    }
  }

  private goNext(e: any): void {
    const nextControl = e.srcElement.nextElementSibling;

    if (nextControl) {
      nextControl.focus();
      nextControl.select();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    // prevent whitespace
    if (e.keyCode === this.SPACE_KEY) {
      e.preventDefault();
    }

    // assure only one number
    if (
      e.srcElement.type === 'number' &&
      e.keyCode !== this.DELETE_KEY &&
      e.keyCode !== this.BACKSPACE_KEY
    ) {
      e.srcElement.value = e.srcElement.value.substring(0, 0);
      return;
    }
  }
}
