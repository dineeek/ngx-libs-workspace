import { getDefaultCountries } from './default-countries'

describe('getDefaultCountries', () => {
  it('returns a non-empty list', () => {
    const list = getDefaultCountries()
    expect(list.length).toBeGreaterThan(50)
  })

  it('includes the major countries (US, GB, DE, FR, JP, HR)', () => {
    const list = getDefaultCountries()
    const codes = new Set(list.map(c => c.iso2))
    for (const c of ['US', 'GB', 'DE', 'FR', 'JP', 'HR'] as const) {
      expect(codes.has(c)).toBe(true)
    }
  })

  it('every entry has a non-empty name and dial code', () => {
    for (const c of getDefaultCountries()) {
      expect(typeof c.iso2).toBe('string')
      expect(c.iso2.length).toBe(2)
      expect(c.name.length).toBeGreaterThan(0)
      expect(c.dialCode.length).toBeGreaterThan(0)
      expect(c.dialCode).toMatch(/^\d+$/)
    }
  })

  it('is sorted by name alphabetically', () => {
    const list = getDefaultCountries()
    for (let i = 1; i < list.length; i++) {
      expect(
        list[i - 1]!.name.localeCompare(list[i]!.name)
      ).toBeLessThanOrEqual(0)
    }
  })

  it('memoizes — repeated calls return the same array reference', () => {
    expect(getDefaultCountries()).toBe(getDefaultCountries())
  })

  it('US has dial code 1', () => {
    const us = getDefaultCountries().find(c => c.iso2 === 'US')
    expect(us?.dialCode).toBe('1')
  })

  it('GB has dial code 44', () => {
    const gb = getDefaultCountries().find(c => c.iso2 === 'GB')
    expect(gb?.dialCode).toBe('44')
  })
})
