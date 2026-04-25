import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { AutofocusFirstInputDirective } from './autofocus-first-input.directive'

@Component({
  standalone: true,
  imports: [AutofocusFirstInputDirective],
  template: `
    <!-- eslint-disable @angular-eslint/template/no-autofocus -->
    <div [autofocusFirstInput] [autofocus]="autofocus()">
      @if (showInput()) {
        <input type="text" />
      }
    </div>
    <!-- eslint-enable @angular-eslint/template/no-autofocus -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
  autofocus = signal(true)
  showInput = signal(true)
}

describe('AutofocusFirstInputDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents()
  })

  it('does not throw when the host has no input element', () => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.componentInstance.showInput.set(false)
    expect(() => fixture.detectChanges()).not.toThrow()
  })

  it('does nothing when [autofocus] is false', done => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.componentInstance.autofocus.set(false)
    fixture.detectChanges()
    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!
    setTimeout(() => {
      expect(document.activeElement).not.toBe(input)
      done()
    }, 0)
  })

  it('focuses the first input when [autofocus] is true', done => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.componentInstance.autofocus.set(true)
    fixture.detectChanges()
    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!
    setTimeout(() => {
      expect(document.activeElement).toBe(input)
      done()
    }, 0)
  })
})
