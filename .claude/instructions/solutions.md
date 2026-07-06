# Solution file shape

Each `day<N>/index.ts` exports a **default async function**:

```ts
(inputFile: string, parameters: string[]) => Promise<DaySolution>
```

- `DaySolution` = tuple `[part1, part2, time]` (see `src/utils/type.ts`).
- `PartSolution` = `string | number | null`.

## Canonical snippet (`src/_template/day/index.ts`)

```ts
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function resolvePart1(input: string) {
  return null
}

function resolvePart2(input: string) {
  return null
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const t0 = performance.now()
  let part1 = resolvePart1(input)
  let part2 = resolvePart2(input)
  const t1 = performance.now()
  return [part1, part2, t1 - t0]
}
```

## Conventions
- Read input with `readFile(inputFile)` from `src/utils/io.ts`, then usually `.split('\n')`.
- Local helpers `resolvePart1` / `resolvePart2` — **not exported** (convention, not enforced).
- Time with `performance.now()` → third element of the tuple.
- Extra CLI arguments arrive in `parameters`; parse with `readNumericParameter` / `readStringParameter` from `src/utils/io.ts` (e.g. `src/2025/day8/index.ts` reads `connectionsCount` from `parameters[0]`).
