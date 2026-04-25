# ngx-libs-workspace

[![ci](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml/badge.svg)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml)
[![deploy playground](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/deploy-playground.yml/badge.svg)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/deploy-playground.yml)
[![CodeQL](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/codeql.yml/badge.svg)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/codeql.yml)
[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=main)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdineeek%2Fngx-libs-workspace.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdineeek%2Fngx-libs-workspace?ref=badge_shield)

Nx monorepo hosting two publishable Angular libraries —
[`ngx-pass-code`](./libs/ngx-pass-code) and
[`ngx-numeric-range-form-field`](./libs/ngx-numeric-range-form-field) — and a
playground application used to showcase them.

**[Live playground](https://dineeek.github.io/ngx-libs-workspace)**

## Projects

- `ngx-pass-code` (`libs/ngx-pass-code`) — publishable Angular library (OTP /
  pass-code form control built on Signal Forms).
- `ngx-numeric-range-form-field` (`libs/ngx-numeric-range-form-field`) —
  publishable Angular library (composite numeric-range form control built on
  Signal Forms).
- `playground` (`apps/playground`) — demo app deployed to GitHub Pages.
- `playground-e2e` (`apps/playground-e2e`) — Cypress end-to-end tests.

## Prerequisites

- Node.js `>=20.19` (see [`.nvmrc`](.nvmrc))
- pnpm `>=10` (enabled via `corepack`, pinned in `package.json`)

```shell
corepack enable
pnpm install --frozen-lockfile
```

## Daily commands

All commands are run from the repo root via pnpm. Every command is Nx-cached;
re-runs return instantly when nothing changed.

### Start the playground

```shell
pnpm nx serve playground
```

Open <http://localhost:4200>. The app live-reloads on source changes and
consumes both libraries directly from `libs/` (no rebuild needed).

### Lint

```shell
pnpm nx lint ngx-pass-code                    # one project
pnpm nx lint ngx-numeric-range-form-field     # one project
pnpm nx run-many -t lint                      # everything
pnpm nx affected -t lint                      # only what changed vs. main
```

### Test

```shell
pnpm nx test ngx-pass-code                            # one project
pnpm nx test ngx-pass-code --watch                    # re-run on change
pnpm nx test ngx-numeric-range-form-field             # one project
pnpm nx test ngx-numeric-range-form-field --watch     # re-run on change
pnpm nx run-many -t test                              # everything
pnpm nx affected -t test                              # only what changed vs. main
```

Coverage for the publishable libraries:

```shell
pnpm ngx-pass-code:test:ci
pnpm ngx-numeric-range-form-field:test:ci
```

### Build

```shell
pnpm nx build ngx-pass-code                   # library → dist/libs/ngx-pass-code
pnpm nx build ngx-numeric-range-form-field    # library → dist/libs/ngx-numeric-range-form-field
pnpm nx build playground                      # app     → dist/apps/playground
pnpm nx run-many -t build                     # everything
```

### Library publish dry-run

```shell
pnpm ngx-pass-code:publish:dry-run
pnpm ngx-numeric-range-form-field:publish:dry-run
```

### Workspace graph

```shell
pnpm nx graph
```

## Releasing libraries

Publishing is fully automated for both libraries:

1. Commit to `main` using
   [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
   `fix:`, `feat!:`, …). The commit's affected files determine which library
   gets a release PR.
2. [`release-please`](./.github/workflows/release-please.yml) opens/updates a
   release PR per library, bumping the relevant `libs/<lib>/package.json` and
   `CHANGELOG.md`.
3. Merging a release PR creates a GitHub Release + tag in the form
   `<lib-name>@x.y.z` (e.g. `ngx-pass-code@2.0.1`,
   `ngx-numeric-range-form-field@5.0.1`).
4. The tag triggers the matching publish workflow —
   [`publish-ngx-pass-code.yml`](./.github/workflows/publish-ngx-pass-code.yml)
   or
   [`publish-ngx-numeric-range-form-field.yml`](./.github/workflows/publish-ngx-numeric-range-form-field.yml)
   — which runs `nx build <lib> --configuration=production` and
   `npm publish --provenance --access public` using the `NPM_TOKEN` repo secret
   (OIDC-backed provenance).

Consumer-facing docs:

- [`libs/ngx-pass-code/README.md`](./libs/ngx-pass-code/README.md)
- [`libs/ngx-numeric-range-form-field/README.md`](./libs/ngx-numeric-range-form-field/README.md)

## Contributing

1. Create a feature branch off `main`.
2. Commit with Conventional Commit messages. A `commit-msg` husky hook runs
   [commitlint](https://commitlint.js.org) to enforce this.
3. Before pushing, pre-commit runs Prettier on staged files and
   `nx affected -t lint` on the affected projects.
4. Open a PR; CI (`ci.yml`) runs `lint`, `test`, `build` in parallel via
   `nx affected` and publishes coverage to Coveralls.

## License

MIT © Dino Klicek. See
[FOSSA report](https://app.fossa.com/projects/git%2Bgithub.com%2Fdineeek%2Fngx-libs-workspace).
