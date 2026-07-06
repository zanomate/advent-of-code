# Stack

## Package manager: bun
- **bun** is the project's package manager. `bun.lock` is the source of truth.
- Do NOT use npm/yarn/pnpm to install or add dependencies.

## Language & compilation
- TypeScript. Config in `tsconfig.json`:
  - `target: ES2023`, `module: CommonJS`, `moduleResolution: Node`
  - `strict: true`, `esModuleInterop: true`
  - `rootDir: ./src`, `outDir: ./dist`, `baseUrl: ./`

## Tooling
- **Test runner**: Jest via `ts-jest` (`jest.config.js`, `testEnvironment: node`).
- **Script runner**: `tsx` (used by the `resolve` script to run TS without a build).
- **Formatter**: Prettier (`.prettierrc`).

## Runtime dependencies
- `big.js`, `lodash`, `md5`, `moment`.

## Notes
- `package.json > overrides` pins `picomatch@2.3.2` (fixes a high ReDoS audit). Do not remove.
