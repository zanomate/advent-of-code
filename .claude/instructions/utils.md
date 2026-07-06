# Utilities

**Reuse these helpers before writing new code.** They live in `src/utils/`.

## Root
- `io` — `readFile`, `readStringParameter`, `readNumericParameter`, `readUserInput`
- `type` — `PartSolution`, `DaySolution`, `isInEnum`
- `print` — `red` / `blue` / `green` / `color`, `printSolution`
- `array` — `arr`, `listOfNumbers`, `chunkArray`
- `math` — `sum`, `getPermutations`, `getCombinations`, `getDispositions`, `factorial`, `isPrime`
- `matrix` — `rotateMatrixClockwise`, `flipMatrixX`, `flipMatrixY`
- `memoization` — `memoized`
- `regex` — `parseRegex`
- `boolean` — `stringToBits`, `bitsToString`
- `number` — `Range` interface (`{ start, end }`)
- `exec` — `sleep`

## `space/`
- `Pos` — class + `p(x, y)` factory: `sum`, `diff`, `shift`, `neighbours`, `manhattanDistance`, `isInBounds`, `toString` / `fromString`
- `Grid<Cell>` — `getCell` / `setCell`, rows/cols, portions, `findPos`, `positions`, `values`, `print`, `clone`, `rotate`, `flipX` / `flipY`, static `Grid.fromValues`
- `Dir` — `Dir` / `DiagDir` / `HexDir` enums, `DirSystem` type (`'+' | 'x' | '8'`), direction arrays
- `HexPos`, `Square`, `Space`

## `computer/`
- `automaton`, `instructions`, `turingMachine`
