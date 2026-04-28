# Changelog

All notable changes to `ngx-pass-code` are documented here. This project adheres
to [Semantic Versioning](https://semver.org/). Starting with `2.0.0`, entries
are generated automatically by
[release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/).

## [1.0.0](https://github.com/dineeek/ngx-libs-workspace/compare/ngx-pass-code@2.1.0...ngx-pass-code@1.0.0) (2026-04-28)


### Miscellaneous Chores

* **ngx-time-range-form-field:** release 1.0.0 ([69ac096](https://github.com/dineeek/ngx-libs-workspace/commit/69ac096fbd574f73a67dd4d8b29e17a716419e04))

## [2.1.0](https://github.com/dineeek/ngx-libs-workspace/compare/ngx-pass-code@2.0.0...ngx-pass-code@2.1.0) (2026-04-25)

Quality pass — adoption-focused additions plus a few internal cleanups
([#48](https://github.com/dineeek/ngx-libs-workspace/pull/48)).

### Added

- `autocomplete` input mirrored to every slot. Set
  `autocomplete="one-time-code"` to opt into Safari/iOS SMS one-time-code
  autofill. Defaults to `''` (attribute omitted).
- `inputmode` input mirrored to every slot. Set `inputmode="numeric"` to get the
  digit-only on-screen keyboard on mobile without forcing `type="number"`.
  Defaults to `''` (attribute omitted).
- CSS custom properties for theming:
  `--ngx-pass-code-slot-{width,min-width, height,gap,radius,bg}`,
  `--ngx-pass-code-{color,border-color,border-width, invalid-color,font-family,font-size,font-weight}`.
  Defaults preserve the existing visuals exactly.
- Public-directives section in the README + a numeric-mode caveat documenting
  that `type="number"` drops leading zeros, with the recommended
  `type="text" + inputmode="numeric"` workaround.

### Fixed

- Replaced the inline `onclick="select()"` slot handler with a typed Angular
  `(click)` binding that calls `select()` on the target input — playing nicely
  with zone-less change detection and component testing.

### Tests

- Added standalone specs for `passCodeComplete` (incomplete vs valid across
  null, short, exact, long values; reactive updates),
  `FocusNextPreviousInputDirective` (next/prev focus, autoblur, Tab/Space edges,
  `type="number"` keydown clear), and `TransformInputValueDirective`
  (`text-transform` toggle).
- Fixed the form-integration "disabled propagation" spec, which previously
  asserted `false` and never bound `disabled()` into the schema. It now wires
  `disabled(p, …)` and verifies that flipping the source signal disables every
  slot.

### Misc

- Renamed `transform-uppercase.directive.ts` →
  `transform-input-value.directive.ts` so the file name lines up with the
  selector / class. Public API (`TransformInputValueDirective` from
  `ngx-pass-code`) is unchanged.

## [2.0.0] - 2026-04-18

### ⚠ BREAKING CHANGES

- Peer deps bumped to `@angular/* >=21.0.0 <22.0.0`.
- Standalone-only distribution — the `NgxPassCodeModule` is removed; import
  `PassCodeComponent` directly.
- Forms integration switched from `ControlValueAccessor` / `[formControl]` to
  Signal Forms `FormValueControl` / `[formField]`.

### Added

- `passCodeComplete(path, length)` validator helper for exact-length
  completeness checks inside `form()` schemas.
- Paste support: clipboard input is distributed across slots left-to-right,
  sanitized per `type` (digits-only for `number`, strip whitespace for
  `password`, strip whitespace and separators for `text`), truncated to
  `length`, then focus moves to the first empty slot (or blurs on `autoblur`).
- Per-slot signal state as the source of truth, so typed characters stay in the
  slot the user clicked and resets clear every box.

### Changed

- Inputs migrated to `input()` / `model()` signal APIs.
- Directives (`autofocus-first-input`, `focus-next-previous-input`,
  `transform-input-value`) rewritten as signal-driven standalone directives.
- Slot boxes shrink gracefully so 7-slot controls fit narrow cards without
  horizontal overflow.

## [1.2.0] - 2024-10-12

### Changed

- Migrated to Angular 17.

## [1.1.2] - 2023-02-20

### Changed

- Minor refactoring and code cleanup.

## [1.1.1] - 2023-02-19

### Changed

- Small code improvements.

## [1.1.0] - 2022-12-10

### Added

- `autofocus` input — focus the first input on render.
- `autoblur` input — remove focus from the last input once filled.

### Changed

- Improved left/right navigation between inputs.

## [1.0.2] - 2022-12-06

### Fixed

- `setDisabledState` honouring the initial control disabled state.
- Value emission on `setValue` / `patchValue`.

## [1.0.1] - 2022-12-06

Official release. Unpublished.

## [1.0.0] - 2022-12-05

Initial release. Unpublished.
