import { Directive, ElementRef, Input, OnInit } from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[transformInputValue]',
  standalone: false
})
export class TransformInputValueDirective implements OnInit {
  @Input() uppercase = false

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.uppercase
      ? (this.el.nativeElement.style.textTransform = 'uppercase')
      : (this.el.nativeElement.style.textTransform = '')
  }
}
