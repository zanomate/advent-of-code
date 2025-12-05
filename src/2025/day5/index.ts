import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Range } from '../../utils/number'

function isInRange(id: number, range: Range): boolean {
  return id >= range.start && id <= range.end
}

function resolvePart1(ranges: Range[], ids: number[]): number {
  let count = 0
  ids.forEach((id) => {
    if (ranges.some((range) => isInRange(id, range))) count++
  })
  return count
}

function resolvePart2(ranges: Range[]): number {
  let res = 0
  let lastRangeEnd = -1
  ranges
    .sort((r1, r2) => r1.start - r2.start)
    .forEach((range) => {
      const start = Math.max(range.start, lastRangeEnd + 1)
      if (start <= range.end) {
        const size = range.end - start + 1
        res += size
        lastRangeEnd = range.end
      }
    })
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [rangesInput, idsInput] = input.split('\n\n')
  const ranges: Range[] = rangesInput.split('\n').map((line) => {
    const [start, end] = line.split('-').map(Number)
    return { start, end }
  })
  const ids: number[] = idsInput.split('\n').map(Number)

  const t0 = performance.now()

  let part1 = resolvePart1(ranges, ids)
  let part2 = resolvePart2(ranges)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
