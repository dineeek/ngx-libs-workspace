import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TransformInputValueDirective } from './transform-uppercase.directive'

@Component({
  standalone: true,
  imports: [TransformInputValueDirective],
  template: `
    <input class="slot" [uppercase]="uppercase()" transformInputValue />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
  uppercase = signal(false)
}

function inputOf(fixture: ComponentFixture<HostComponent>): HTMLInputElement {
  const el = (
    fixture.nativeElement as HTMLElement
  ).querySelector<HTMLInputElement>('input.slot')
  if (!el) {
    throw new Error('input.slot not rendered')
  }
  return el
}

describe('TransformInputValueDirective', () => {
  let fixture: ComponentFixture<HostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents()
    fixture = TestBed.createComponent(HostComponent)
  })

  it('uppercase=false (default) leaves text-transform empty', () => {
    fixture.detectChanges()
    expect(inputOf(fixture).style.textTransform).toBe('')
  })

  it('uppercase=true sets text-transform: uppercase', () => {
    fixture.componentInstance.uppercase.set(true)
    fixture.detectChanges()
    expect(inputOf(fixture).style.textTransform).toBe('uppercase')
  })

  it('toggling uppercase at runtime updates the style', () => {
    fixture.detectChanges()
    const el = inputOf(fixture)
    expect(el.style.textTransform).toBe('')

    fixture.componentInstance.uppercase.set(true)
    fixture.detectChanges()
    expect(el.style.textTransform).toBe('uppercase')

    fixture.componentInstance.uppercase.set(false)
    fixture.detectChanges()
    expect(el.style.textTransform).toBe('')
  })
})
