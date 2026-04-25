# Library ideas

Backlog of niche Angular libraries worth considering for this workspace. Each
entry captures: the npm niche evidence (so the rationale doesn't have to be
re-derived), what shape the lib would take, and current status.

The picks favour Angular Signal Forms primitives and small theme-friendly
controls that fit alongside `ngx-pass-code`, `ngx-numeric-range-form-field`,
`ngx-phone-form-field` and `ngx-time-range-form-field`.

## ngx-time-range-form-field — Shipped

Landed via PR #50 at `0.1.0`. See
[`libs/ngx-time-range-form-field/`](./libs/ngx-time-range-form-field) and the
[live demo](https://dineeek.github.io/ngx-libs-workspace/ngx-time-range-form-field).

## ngx-overflow-tooltip — In progress (this branch)

**Niche:** Genuinely open. `ngx-ellipsis-tooltip` exists but is abandoned
(Angular 11, last published 2022, ~5 downloads/month). The adjacent
`ngx-ellipsis` (which forces multi-line truncation, a different problem) pulls
~93k downloads/month — proof that consumers want this space served by a
maintained, modern Angular package. The React equivalent
`react-ellipsis-with-tooltip` has not been touched since 2019. Angular
Material's `MatTooltip` has no built-in "show only when truncated" mode, and
this is a recurring papercut.

**Scope (as shipped):** A standalone directive that detects when its host
element's text is ellipsized via `ResizeObserver` (re-measure on layout) and
`MutationObserver` (re-measure when the text content itself changes — the
existing work-codebase prototype missed this). Exposes an `isTruncated` signal
plus a `truncatedChange` output for code-side consumers. Three modes — `auto`
(both axes), `single` (horizontal), `multi` (vertical); the bare attribute
defaults to `auto` via an input transform. Headless: no `@angular/material` peer
dependency — the README documents the `MatTooltip` composition recipe alongside
plain-`title` / Read-more alternatives.

**Package shape:**

- `OverflowTooltipDirective` — selector `[ngxOverflowTooltip]`,
  `exportAs: 'ngxOverflowTooltip'`.
- `isTruncated: Signal<boolean>` exposed publicly.
- `truncatedChange: OutputEmitterRef<boolean>` for code-side subscribers.
- `mode` input aliased onto the selector for inline configuration:
  `[ngxOverflowTooltip]="'single'"`.

## Notes

- IBAN form-field was considered and explicitly **rejected** on 2026-04-25. Do
  not propose IBAN-domain libs again.
- Other niches scouted but ruled out due to npm saturation: truncate-pipe,
  safe-html-pipe, file-size-pipe, drag-drop-directive, uppercase-input (only
  abandoned competitor exists, but the surface is too thin to justify a
  dedicated lib on its own).
