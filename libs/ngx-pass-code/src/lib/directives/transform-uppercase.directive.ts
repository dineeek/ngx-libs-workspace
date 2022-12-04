import {
  Directive,
  Input,
  SimpleChanges,
  ElementRef,
  OnChanges,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[transformInputValue]',
})
export class TransformInputValueDirective implements OnChanges {
  @Input() uppercase = false;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['uppercase']) {
      this.uppercase
        ? (this.el.nativeElement.style.textTransform = 'uppercase')
        : (this.el.nativeElement.style.textTransform = '');
    }
  }
}
