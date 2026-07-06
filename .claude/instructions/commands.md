# Commands

All via **bun**.

## Dependencies
- Install: `bun install`
- Add runtime dep: `bun add <pkg>`
- Add dev dep: `bun add -d <pkg>`

## Run a day
```
bun resolve <year> <day> <file> [...args]
```
- `<file>` = stem without `.txt` (e.g. `sample`, `input`).
- `[...args]` = extra parameters passed to the solution's `parameters`.
- Example: `bun resolve 2025 8 sample 10`

## Test
```
bun run test
```
⚠️ **Always use `bun run test`, NOT `bun test`.**
`bun test` (without `run`) invokes bun's **native** test runner and ignores Jest/the script. `bun run test` runs the `test` script → `jest`.

## Format
```
bunx prettier --write .
```
(no `format` script defined in `package.json`)
