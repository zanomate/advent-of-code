# Testing

`testDay` helper from `src/utils/tests.ts`:

```ts
testDay(year, day, inputFile, parameters, part1, part2)
```

- Runs the solution via `resolveDay` (`src/index.ts`), then asserts each part.
- Passing `null` for a part **skips** that assertion.

## Per-year test structure (`src/<year>/<year>.test.ts`)

```ts
describe('2025', () => {
  it(`Day 8`, async () => {
    await testDay(2025, 8, 'sample', [10], 40, 25272)
    await testDay(2025, 8, 'input', [1000], 115885, 274150525)
  })
})
```

- One `describe('<year>')` with one `it('Day N')` per day.
- Usually assert both `sample` and `input`.
- Slow or unsolved cases: comment them out with a note (e.g. "input takes 7+ minutes", "can't be resolved by current algorithm").

## Running
- `bun run test` (see `commands.md` — NOT `bun test`).
