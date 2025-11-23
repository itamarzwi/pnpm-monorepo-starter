### pnpm-monorepo-starter

A minimal, batteries-included starter for a `pnpm` workspace monorepo. It includes an Express backend, shared libraries, and eslint config.


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
```sh
pnpm --filter @org/frontend dev
# or
cd packages/apps/frontend
pnpm dev
```

## Workspace layout
```
.
├─ packages/
│  ├─ apps/
│  │  ├─ backend/                 # Express backend
│  │  └─ frontend                 # React frontend
│  ├─ libs/
│  │  ├─ change-entry-point/      # Small CI helper for adjusting entry points
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

## Typical workflows
- Run the backend: `pnpm --filter @org/backend dev`
- Build a single package: `pnpm --filter <pkg> run build`
- Lint a single package: `pnpm --filter <pkg> run lint`
- Run all tests (where available): `pnpm -r test`
