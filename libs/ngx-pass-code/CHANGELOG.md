# Changelog

All notable changes to `ngx-pass-code` are documented here. This project adheres
to [Semantic Versioning](https://semver.org/). Starting with `2.0.0`, entries
are generated automatically by
[release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/).

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
