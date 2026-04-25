# Library ideas

Backlog of niche Angular libraries worth considering for this workspace. Each
entry captures: the npm niche evidence (so the rationale doesn't have to be
re-derived), what shape the lib would take, and current status.

The picks favour Angular Signal Forms primitives and small theme-friendly
controls that fit alongside `ngx-pass-code`, `ngx-numeric-range-form-field` and
`ngx-phone-form-field`.

## ngx-time-range-form-field — In progress (this branch)

**Niche:** No Angular Signal Forms time-range package exists on npm. Closest
neighbours are general date pickers and the unrelated `ngx-mat-timepicker`, none
of which expose a paired-input range with validators.

**Scope:** Two `<input type="time">` fields backing one composite
`{ start, end }` value, mirroring the proven shape of
`ngx-numeric-range-form-field`. Same a11y wiring, same per-side readonly, same
reset behaviour, no Material peer dep.

**Validators (Signal Forms):** `timeRangeOrderValid`, `timeRangeBothFilled`,
`timeRangeBounds`, `timeRangeWidth`. Mixed-precision (`HH:mm` vs `HH:mm:ss`) is
normalised before comparison. Width is expressed in minutes for clarity.

## ngx-overflow-tooltip — TODO

**Niche:** Genuinely open. `ngx-ellipsis-tooltip` exists but is abandoned
(Angular 11, last published 2022, ~5 downloads/month). The adjacent
`ngx-ellipsis` (which forces multi-line truncation, a different problem) pulls
~93k downloads/month — proof that consumers want this space served by a
maintained, modern Angular package. The React equivalent
`react-ellipsis-with-tooltip` has not been touched since 2019. Angular
Material's `MatTooltip` has no built-in "show only when truncated" mode, and
this is a recurring papercut.

**Scope:** A standalone directive that detects when its host element's text is
ellipsized via `ResizeObserver` (re-measure on layout) and `MutationObserver`
(re-measure when the text content itself changes — the existing work-codebase
prototype misses this). Exposes an `isTruncated` signal output for
build-your-own behaviour, and an opt-in `autoTooltip: true` mode that wires a
`MatTooltip` (peer-dep, not bundled) showing the full text only while the
element is truncated. Single-line (`scrollWidth > clientWidth`) and multi-line
(`scrollHeight > clientHeight`) detection both supported. Modern Angular 21+ /
zoneless target.

**Suggested package shape:**

- `OverflowTooltipDirective` — selector `[ngxOverflowTooltip]`.
- `isTruncated` output (signal-based).
- Inputs for mode (`'single' | 'multi' | 'auto'`) and the optional Material
  wiring.

**Why not yet:** Wait until `ngx-time-range-form-field` ships. Then this is the
next pick — it diversifies the workspace beyond form-fields and serves the
largest under-served niche we've found.

## Notes

- IBAN form-field was considered and explicitly **rejected** on 2026-04-25. Do
  not propose IBAN-domain libs again.
- Other niches scouted but ruled out due to npm saturation: truncate-pipe,
  safe-html-pipe, file-size-pipe, drag-drop-directive, uppercase-input (only
  abandoned competitor exists, but the surface is too thin to justify a
  dedicated lib on its own).
