import { Directive, HostListener, input } from '@angular/core'

const BACKSPACE_KEY = 8
const TAB_KEY = 9
const DELETE_KEY = 46
const LEFT_ARROW_KEY = 37
const RIGHT_ARROW_KEY = 39
const SPACE_KEY = 32

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focusNextPreviousInput]'
})
export class FocusNextPreviousInputDirective {
  readonly autoblur = input(false)

  @HostListener('keyup', ['$event']) onKeyUp(e: KeyboardEvent): void {
    e.preventDefault()
    const target = e.target as HTMLInputElement

    if (
      e.keyCode === LEFT_ARROW_KEY ||
      e.keyCode === DELETE_KEY ||
      e.keyCode === BACKSPACE_KEY
    ) {
      this.goPrevious(target)
      return
    }

    if (e.keyCode === TAB_KEY) {
      return
    }

    if (target.maxLength === target.value.length) {
      this.goNext(target)
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLInputElement

    if (e.keyCode === SPACE_KEY) {
      e.preventDefault()
      return
    }

    if (
      target.type === 'number' &&
      e.keyCode !== DELETE_KEY &&
      e.keyCode !== BACKSPACE_KEY &&
      e.keyCode !== RIGHT_ARROW_KEY &&
      e.keyCode !== LEFT_ARROW_KEY &&
      e.keyCode !== TAB_KEY
    ) {
      target.value = target.value.toString().substring(0, 0)
    }
  }

  private goPrevious(target: HTMLInputElement): void {
    const previous = target.previousElementSibling as HTMLInputElement | null

    if (previous) {
      previous.focus()
      previous.select()
    }
  }

  private goNext(target: HTMLInputElement): void {
    const next = target.nextElementSibling as HTMLInputElement | null

    if (next) {
      next.focus()
      next.select()
    } else if (this.autoblur()) {
      target.blur()
    }
  }
}
