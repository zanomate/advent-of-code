# Project structure

```
src/
  <year>/
    day<N>/
      index.ts        # day solution
      input.txt       # real puzzle input
      sample.txt      # example input
      model/          # (optional) domain classes for complex days
    <year>.test.ts    # year's tests
  _template/day/      # scaffold for new days
  utils/              # shared helpers
  index.ts            # resolve entrypoint
```

## Rules
- Solutions: `src/<year>/day<N>/index.ts`.
- Day folders are **not zero-padded**: `day1`, `day2`, … `day25`.
- Input files sit next to the solution: `input.txt` (real), `sample.txt` (example); sometimes `sample2.txt`.
- Complex days: a `model/` subfolder with domain classes (e.g. `src/2024/day5/model/Rule.ts`, `src/2024/day15/model/Warehouse.ts`).
- New day: copy `src/_template/day`.
- Per-year tests: `src/<year>/<year>.test.ts`.
- Resolve entrypoint: `src/index.ts` (dynamic import of the day + CLI arg parsing).
