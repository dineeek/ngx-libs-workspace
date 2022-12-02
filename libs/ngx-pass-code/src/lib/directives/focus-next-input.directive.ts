import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[focusNextPreviousInput]',
})
export class FocusNextInputDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {
      e.preventDefault();

      let nextControl = e.srcElement.nextElementSibling;
      // Searching for next similar control to set it focus
      while (true) {
        if (!nextControl) {
          return;
        }

        if (nextControl.type === e.srcElement.type) {
          nextControl.focus();
          return;
        }

        nextControl = nextControl.nextElementSibling;
      }
    }

    // backspace & delete
    if (e.which === 8 || e.which === 46) {
      e.preventDefault();
      let previousControl = e.srcElement.previousElementSibling;

      // Searching for previousControl similar control to set it focus
      while (true) {
        if (!previousControl) {
          return;
        }

        if (previousControl.type === e.srcElement.type) {
          previousControl.focus();
          return;
        }

        previousControl = previousControl.previousElementSibling;
      }
    }
  }
}

// TODO - on backspace go left - Element.previousElementSibling
