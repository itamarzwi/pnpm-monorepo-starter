### pnpm-monorepo-starter

A minimal, batteries-included starter for a `pnpm` workspace monorepo. It includes an Express backend, shared libraries, and a shared ESLint config, wired with workspace protocols and a dependency catalog for consistent versioning.


## Getting started
```sh
pnpm install
```

Run the backend:
```sh
pnpm --filter @org/backend dev
# or
cd packages/apps/backend
pnpm dev
```

Run the frontend:

## Workspace layout
```
.
├─ packages/
│  ├─ apps/
│  │  └─ backend/                # Express backend (TypeScript)
│  ├─ libs/
│  │  ├─ change-entry-point/     # Small CI helper for adjusting entry points
│  │  ├─ errors/                  # Error types and helpers
│  │  ├─ eslint/                  # Shared ESLint configs and custom rules/plugins
│  │  ├─ logger/                  # Winston-based logger with pretty formatting
│  │  ├─ utils/                   # Generic utilities
│  │  └─ validate-request/        # Zod-powered request validation helpers
│  └─ scripts/                    # Project scripts (if any)
├─ pnpm-workspace.yaml            # Workspace + dependency catalog and Node version
├─ package.json                   # Root scripts and dev deps
└─ pnpm-lock.yaml
```

## Packages
- **@org/backend**: Express 5 backend with `tsx` for dev.
  - Scripts:
    - `dev`: `tsx watch --inspect ./src/index.ts`
    - `build`: `rimraf dist && tsc -p tsconfig.build.json`
    - `lint` / `lint:fix`: ESLint
  - Depends on: `@org/errors`, `@org/logger`, `@org/validate-request`, plus `express`, `helmet`, `cors`, `dotenv`, `zod`.

- **@org/errors**: Centralized error types and helpers.
  - Scripts: `build`, `lint`, `lint:fix`
  - Depends on: `http-status-codes`.

- **@org/logger**: Opinionated `winston` logger with pretty/colorized output.
  - Scripts: `build`, `lint`, `lint:fix`
  - Depends on: `@org/utils`, `winston`, `chalk`, `lodash-es`, `safe-stable-stringify`, `json-colorizer`.

- **@org/utils**: Generic utilities shared across the repo.
  - Scripts: `build`, `lint`, `lint:fix`

- **@org/validate-request**: Express request validation helpers (uses Zod).
  - Scripts: `build`, `lint`, `lint:fix`, `test`
  - Depends on: `@org/errors`.

- **@org/eslint**: Shared ESLint configs and a custom plugin (React/Node/Vue profiles included).
  - Exports: `./base.js`, `./node.js`, `./react.js`

- **@org/ci-change-entry-point**: Small helper used by library builds to adjust entry points in CI.

## Root scripts
- `lint:all`: Run `lint` in every workspace.
- `lint:fix:all`: Run `lint:fix` in every workspace.

The repo uses Husky locally (auto-installed on `pnpm install`) but intentionally skips installation in CI via `is-ci`.

## Dependency management
This repo uses a dependency catalog in `pnpm-workspace.yaml` to pin versions across the monorepo, ensuring consistent tooling and libs. Workspace ranges (`workspace:*`) are used for internal packages.

Key controls in `pnpm-workspace.yaml`:
- `packages: [packages/**]`
- `catalog: { ... }` with tool and lib versions
- `nodeVersion`/`useNodeVersion`: 22.18.0
- `injectWorkspacePackages: true`
- `onlyBuiltDependencies: [esbuild]`

## Typical workflows
- Develop the backend: `pnpm --filter @org/backend dev`
- Build a single package: `pnpm --filter <pkg> run build`
- Lint a single package: `pnpm --filter <pkg> run lint`
- Run tests (where available): `pnpm --filter <pkg> test`

## Notes
- All packages are TypeScript-first and ESM.
- The ESLint package is consumed via `@org/eslint` exports (`base`, `node`, `react`).
- CI-friendly: Husky is skipped in CI; `ci-change-entry-point` helps ensure built entry points are correct.
