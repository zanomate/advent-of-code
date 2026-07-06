# Conventions & style

## Prettier (`.prettierrc`)
- **No semicolons** (`semi: false`)
- Single quotes (`singleQuote: true`)
- Trailing comma everywhere (`trailingComma: all`)
- `printWidth: 100`
- `tabWidth: 2`, `useTabs: false`
- `bracketSpacing: true`

## Naming
- Day folders not zero-padded: `day1` … `day25`.
- `resolvePart1` / `resolvePart2` helpers: local, not exported.
- Everything in English (identifiers, comments) — see `language.md`.

## New days
- Copy `src/_template/day` and fill in `resolvePart1` / `resolvePart2`.
- Add `input.txt` / `sample.txt` next to `index.ts`.
- Add an `it('Day N')` in `src/<year>/<year>.test.ts`.
