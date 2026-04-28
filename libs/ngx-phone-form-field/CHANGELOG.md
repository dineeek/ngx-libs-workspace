# Changelog

All notable changes to `ngx-phone-form-field` are documented here. This project
adheres to [Semantic Versioning](https://semver.org/). Starting with `1.0.0`,
entries are generated automatically by
[release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/).

## [1.0.0](https://github.com/dineeek/ngx-libs-workspace/compare/ngx-phone-form-field@1.1.0...ngx-phone-form-field@1.0.0) (2026-04-28)


### Miscellaneous Chores

* **ngx-time-range-form-field:** release 1.0.0 ([69ac096](https://github.com/dineeek/ngx-libs-workspace/commit/69ac096fbd574f73a67dd4d8b29e17a716419e04))

## [1.1.0](https://github.com/dineeek/ngx-libs-workspace/compare/ngx-phone-form-field@1.0.0...ngx-phone-form-field@1.1.0) (2026-04-25)

Quality-pass on top of the 1.0.0 release. See PR
[#47](https://github.com/dineeek/ngx-libs-workspace/pull/47) for the full diff.

### Bug fixes

- Country picker scroll now follows the actually-active option during keyboard
  navigation, instead of always targeting the first row in the list.
- External writes that `libphonenumber-js` cannot parse (e.g. `+1abc`) no longer
  blank the input — the national-number side strips the leading dial code as a
  fallback so the UI stays in sync with the model.

### Documentation

- New "Country codes & line types" section: `CountryCode` / `NumberType` are
  re-exported from `libphonenumber-js/max`, with a table mapping each type to
  the inputs and validators that consume it.
- `phoneCountryIn` JSDoc + README now disclose that unparseable input also fails
  as `disallowedCountry`, and how to compose with `phoneValid()` to route
  unparseable through `invalidPhone` instead.
- Replaced the inaccurate "always a valid E.164" emission claim with the
  accurate three-state contract: `null` / valid E.164 / partial
  `+<dialcode><digits>` during typing.
- Added `CHANGELOG.md` (this file) so the README's changelog link resolves.

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
