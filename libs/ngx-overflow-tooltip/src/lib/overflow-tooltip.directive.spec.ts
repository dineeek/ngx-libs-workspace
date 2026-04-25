import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild
} from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  OverflowTooltipDirective,
  OverflowTooltipMode
} from './overflow-tooltip.directive'

type Dims = {
  scrollWidth?: number
  clientWidth?: number
  scrollHeight?: number
  clientHeight?: number
}

function setDims(el: HTMLElement, dims: Dims): void {
  for (const [key, value] of Object.entries(dims)) {
    Object.defineProperty(el, key, { configurable: true, value })
  }
}

const HOST_ATTR = '__ngxObserverHost__'

class MockResizeObserver {
  static instances: MockResizeObserver[] = []
  callback: ResizeObserverCallback
  target?: Element
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }
  observe(target: Element): void {
    this.target = target
    const map = (target as unknown as Record<string, unknown[]>)[HOST_ATTR] as
      | MockResizeObserver[]
      | undefined
    if (map) {
      map.push(this)
    } else {
      ;(target as unknown as Record<string, unknown[]>)[HOST_ATTR] = [this]
    }
  }
  unobserve(): void {}
  disconnect(): void {
    if (this.target) {
      const map = (this.target as unknown as Record<string, unknown[]>)[
        HOST_ATTR
      ] as MockResizeObserver[] | undefined
      if (map) {
        const i = map.indexOf(this)
        if (i >= 0) map.splice(i, 1)
      }
    }
    const i = MockResizeObserver.instances.indexOf(this)
    if (i >= 0) MockResizeObserver.instances.splice(i, 1)
  }
  fire(): void {
    this.callback([], this as unknown as ResizeObserver)
  }
}

class MockMutationObserver {
  static instances: MockMutationObserver[] = []
  callback: MutationCallback
  target?: Node
  constructor(callback: MutationCallback) {
    this.callback = callback
    MockMutationObserver.instances.push(this)
  }
  observe(target: Node): void {
    this.target = target
  }
  disconnect(): void {
    const i = MockMutationObserver.instances.indexOf(this)
    if (i >= 0) MockMutationObserver.instances.splice(i, 1)
  }
  takeRecords(): MutationRecord[] {
    return []
  }
  fire(): void {
    this.callback([], this as unknown as MutationObserver)
  }
}

function fireResize(el: Element): void {
  const map = (el as unknown as Record<string, unknown[]>)[HOST_ATTR] as
    | MockResizeObserver[]
    | undefined
  for (const obs of map ?? []) {
    obs.fire()
  }
}

function fireMutation(target: Node): void {
  for (const obs of MockMutationObserver.instances) {
    if (obs.target === target) obs.fire()
  }
}

@Component({
  standalone: true,
  imports: [OverflowTooltipDirective],
  template: `
    <span [ngxOverflowTooltip]="mode()" (truncatedChange)="onChange($event)">
      {{ text() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class HostComponent {
  readonly mode = signal<OverflowTooltipMode>('auto')
  readonly text = signal('hello')
  readonly directive = viewChild.required(OverflowTooltipDirective)
  readonly emissions: boolean[] = []
  onChange(value: boolean): void {
    this.emissions.push(value)
  }
}

function getHostElement<T>(fixture: ComponentFixture<T>): HTMLElement {
  return (fixture.nativeElement as HTMLElement).querySelector(
    'span'
  ) as HTMLElement
}

describe('OverflowTooltipDirective', () => {
  let originalRO: typeof ResizeObserver | undefined
  let originalMO: typeof MutationObserver | undefined
  let originalRaf: typeof requestAnimationFrame
  let originalCancelRaf: typeof cancelAnimationFrame

  beforeEach(() => {
    originalRO = globalThis.ResizeObserver
    originalMO = globalThis.MutationObserver
    originalRaf = globalThis.requestAnimationFrame
    originalCancelRaf = globalThis.cancelAnimationFrame

    globalThis.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver
    globalThis.MutationObserver =
      MockMutationObserver as unknown as typeof MutationObserver
    // Synchronous rAF so scheduleCheck → runCheck happens inline.
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0)
      return 0
    }) as typeof requestAnimationFrame
    globalThis.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame

    MockResizeObserver.instances.length = 0
    MockMutationObserver.instances.length = 0
  })

  afterEach(() => {
    globalThis.ResizeObserver = originalRO as typeof ResizeObserver
    globalThis.MutationObserver = originalMO as typeof MutationObserver
    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCancelRaf
  })

  async function makeFixture(
    setup?: (host: HostComponent) => void
  ): Promise<ComponentFixture<HostComponent>> {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents()
    const fixture = TestBed.createComponent(HostComponent)
    if (setup) setup(fixture.componentInstance)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    return fixture
  }

  function getInstance(
    fixture: ComponentFixture<HostComponent>
  ): OverflowTooltipDirective {
    return fixture.componentInstance.directive()
  }

  it('starts with isTruncated=false when content fits', async () => {
    const fixture = await makeFixture()
    const node = getHostElement(fixture)
    setDims(node, {
      scrollWidth: 100,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(false)
  })

  it('flips isTruncated=true when scrollWidth exceeds clientWidth', async () => {
    const fixture = await makeFixture()
    const node = getHostElement(fixture)
    setDims(node, {
      scrollWidth: 250,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(true)
  })

  it('flips isTruncated=true when scrollHeight exceeds clientHeight in auto mode', async () => {
    const fixture = await makeFixture()
    const node = getHostElement(fixture)
    setDims(node, {
      scrollWidth: 100,
      clientWidth: 100,
      scrollHeight: 80,
      clientHeight: 40
    })
    fireResize(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(true)
  })

  it('mode=single ignores vertical overflow', async () => {
    const fixture = await makeFixture(h => h.mode.set('single'))
    const node = getHostElement(fixture)
    setDims(node, {
      scrollWidth: 100,
      clientWidth: 100,
      scrollHeight: 80,
      clientHeight: 40
    })
    fireResize(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(false)
  })

  it('mode=multi ignores horizontal overflow', async () => {
    const fixture = await makeFixture(h => h.mode.set('multi'))
    const node = getHostElement(fixture)
    setDims(node, {
      scrollWidth: 250,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(false)
  })

  it('re-checks after a content mutation', async () => {
    const fixture = await makeFixture()
    const node = getHostElement(fixture)
    setDims(node, {
      scrollWidth: 100,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(false)

    setDims(node, {
      scrollWidth: 400,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireMutation(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(true)
  })

  it('emits truncatedChange only when the value flips', async () => {
    const fixture = await makeFixture()
    const node = getHostElement(fixture)

    setDims(node, {
      scrollWidth: 100,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()

    setDims(node, {
      scrollWidth: 250,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()

    setDims(node, {
      scrollWidth: 300,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()

    setDims(node, {
      scrollWidth: 100,
      clientWidth: 100,
      scrollHeight: 20,
      clientHeight: 20
    })
    fireResize(node)
    fixture.detectChanges()

    expect(fixture.componentInstance.emissions).toEqual([true, false])
  })

  it('re-evaluates when the mode input changes', async () => {
    const fixture = await makeFixture()
    const node = getHostElement(fixture)
    // Vertical overflow only — auto = truncated, single should clear it.
    setDims(node, {
      scrollWidth: 100,
      clientWidth: 100,
      scrollHeight: 80,
      clientHeight: 40
    })
    fireResize(node)
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(true)

    fixture.componentInstance.mode.set('single')
    fixture.detectChanges()
    expect(getInstance(fixture).isTruncated()).toBe(false)
  })

  it('disconnects observers on destroy', async () => {
    const fixture = await makeFixture()
    expect(MockResizeObserver.instances.length).toBe(1)
    expect(MockMutationObserver.instances.length).toBe(1)

    fixture.destroy()
    expect(MockResizeObserver.instances.length).toBe(0)
    expect(MockMutationObserver.instances.length).toBe(0)
  })

  it('skips wiring observers when ResizeObserver is missing (SSR-safe)', async () => {
    const previous = globalThis.ResizeObserver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).ResizeObserver

    try {
      const fixture = await makeFixture()
      expect(MockResizeObserver.instances.length).toBe(0)
      expect(MockMutationObserver.instances.length).toBe(0)
      expect(getInstance(fixture).isTruncated()).toBe(false)
    } finally {
      globalThis.ResizeObserver = previous
    }
  })
})
