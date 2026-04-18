import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[transformInputValue]',
  standalone: false
})
export class TransformInputValueDirective implements OnInit {
  private el = inject(ElementRef)

  @Input() uppercase = false

  ngOnInit(): void {
    this.uppercase
      ? (this.el.nativeElement.style.textTransform = 'uppercase')
      : (this.el.nativeElement.style.textTransform = '')
  }
}
