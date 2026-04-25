# Changelog

All notable changes to `ngx-phone-form-field` are documented here. This project
adheres to [Semantic Versioning](https://semver.org/). Starting with `1.0.0`,
entries are generated automatically by
[release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/).

## [1.0.0] - 2026-04-25

First release from the
[ngx-libs-workspace](https://github.com/dineeek/ngx-libs-workspace) monorepo. A
Signal-Forms-native phone form field built on `libphonenumber-js/max`.

### Added

- `PhoneFormFieldComponent` — composite international phone field with country
  picker + national-number input, exposed as a single E.164 string value.
- AsYouType formatting via `libphonenumber-js/max` (full metadata,
  line-type-aware).
- Country auto-detect from `navigator.language`, overridable per field with
  `initialCountry`.
- `[countries]` input to restrict the picker to a subset of ISO 3166-1 alpha-2
  codes; the same alphabet powers
  [`phoneCountryIn`](./README.md#phonecountryinpath-countries).
- Built-in search-by-name / dial-code popover with full keyboard navigation and
  SVG flags via `country-flag-icons`. No Angular Material, no CDK.
- Validator helpers: `phoneValid`, `phonePossible`, `phoneCountryIn`,
  `phoneTypeIn`.
- `CountryCode` and `NumberType` re-exported from the package entry so consumers
  don't need a direct `libphonenumber-js` dependency.
- Custom outlined field styling reskinnable via CSS custom properties
  (`--ngx-pff-*`) — no `::ng-deep`, no global CSS leaks.
- Standalone component, OnPush, signal-based inputs end-to-end,
  `sideEffects: false`.

### Notes

- `@angular/forms/signals` is `@experimental 21.0.0`. Consumers of
  `ngx-phone-form-field@1.x` adopt the same experimental surface.
- Peer dependencies: Angular `>=21.0.0 <22.0.0`.
