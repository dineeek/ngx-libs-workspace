# ngx-libs-workspace

[![ci](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml/badge.svg)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/ci.yml)
[![deploy playground](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/deploy-playground.yml/badge.svg)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/deploy-playground.yml)
[![CodeQL](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/codeql.yml/badge.svg)](https://github.com/dineeek/ngx-libs-workspace/actions/workflows/codeql.yml)
[![Coverage Status](https://coveralls.io/repos/github/dineeek/ngx-libs-workspace/badge.svg?branch=main)](https://coveralls.io/github/dineeek/ngx-libs-workspace?branch=main)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdineeek%2Fngx-libs-workspace.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdineeek%2Fngx-libs-workspace?ref=badge_shield)

Nx monorepo hosting the [`ngx-pass-code`](./libs/ngx-pass-code) Angular library
and a playground application used to showcase it.

**[Live playground](https://dineeek.github.io/ngx-libs-workspace)**

## Projects

| Project          | Path                  | Description                                                 |
| ---------------- | --------------------- | ----------------------------------------------------------- |
| `ngx-pass-code`  | `libs/ngx-pass-code`  | Publishable Angular library (OTP / pass-code form control). |
| `playground`     | `apps/playground`     | Demo Angular application deployed to GitHub Pages.          |
| `playground-e2e` | `apps/playground-e2e` | Cypress end-to-end tests for the playground.                |

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
consumes the library directly from `libs/ngx-pass-code` (no rebuild needed).

### Lint

```shell
pnpm nx lint ngx-pass-code          # one project
pnpm nx run-many -t lint            # everything
pnpm nx affected -t lint            # only what changed vs. main
```

### Test

```shell
pnpm nx test ngx-pass-code          # one project
pnpm nx test ngx-pass-code --watch  # re-run on change
pnpm nx run-many -t test            # everything
pnpm nx affected -t test            # only what changed vs. main
```

Coverage for the publishable library:

```shell
pnpm ngx-pass-code:test:ci
```

### Build

```shell
pnpm nx build ngx-pass-code         # library → dist/libs/ngx-pass-code
pnpm nx build playground            # app     → dist/apps/playground
pnpm nx run-many -t build           # everything
```

### Library publish dry-run

```shell
pnpm ngx-pass-code:publish:dry-run
```

### Workspace graph

```shell
pnpm nx graph
```

## Releasing `ngx-pass-code`

Publishing is fully automated:

1. Commit to `main` using
   [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
   `fix:`, `feat!:`, …).
2. [`release-please`](./.github/workflows/release-please.yml) opens/updates a
   release PR that bumps `libs/ngx-pass-code/package.json` and the library
   `CHANGELOG.md`.
3. Merging the release PR creates a GitHub Release + tag `ngx-pass-code@x.y.z`.
4. The tag triggers
   [`publish-ngx-pass-code.yml`](./.github/workflows/publish-ngx-pass-code.yml),
   which runs `nx build ngx-pass-code --configuration=production` and
   `npm publish --provenance --access public` using the `NPM_TOKEN` repo secret
   (OIDC-backed provenance).

See [`libs/ngx-pass-code/README.md`](./libs/ngx-pass-code/README.md) for
consumer-facing docs.

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
