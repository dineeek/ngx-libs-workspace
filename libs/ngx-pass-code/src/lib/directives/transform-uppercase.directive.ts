import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[transformInputValue]'
})
export class TransformInputValueDirective implements OnInit {
  private el = inject(ElementRef)

  @Input() uppercase = false

  ngOnInit(): void {
    this.el.nativeElement.style.textTransform = this.uppercase
      ? 'uppercase'
      : ''
  }
}
