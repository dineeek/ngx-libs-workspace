import type { CountryCode } from 'libphonenumber-js/max'

export type IPhoneCountry = {
  readonly iso2: CountryCode
  readonly name: string
  readonly dialCode: string
}
