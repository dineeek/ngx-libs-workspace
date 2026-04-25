import { TimeRangeErrorKind } from './error-kinds'

describe('TimeRangeErrorKind', () => {
  it('exposes the expected kind strings', () => {
    expect(TimeRangeErrorKind.OutOfOrder).toBe('invalidRange')
    expect(TimeRangeErrorKind.BoundsMin).toBe('min')
    expect(TimeRangeErrorKind.BoundsMax).toBe('max')
    expect(TimeRangeErrorKind.Incomplete).toBe('incomplete')
    expect(TimeRangeErrorKind.WidthMin).toBe('minWidth')
    expect(TimeRangeErrorKind.WidthMax).toBe('maxWidth')
  })

  it('does not collide with the built-in `required` kind', () => {
    expect(Object.values(TimeRangeErrorKind)).not.toContain('required')
  })
})
