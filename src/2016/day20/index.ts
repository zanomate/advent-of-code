import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const rangeComparer = (r1: [number, number], r2: [number, number]): number => r1[0] - r2[0]
const intersectOrAdjacent = (r1: [number, number], r2: [number, number]): boolean => {
  if (r1[1] + 1 === r2[0] || r1[0] - 1 === r2[1]) return true
  return r1[0] <= r2[1] && r1[1] >= r2[0]
}
const merge = (r1: [number, number], r2: [number, number]): [number, number] => [
  Math.min(r1[0], r2[0]),
  Math.max(r1[1], r2[1]),
]

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const ranges: [number, number][] = lines
    .map((line) => line.split('-').map(Number) as [number, number])
    .sort(rangeComparer)

  const t0 = performance.now()

  const distinctRanges = []
  while (ranges.length > 0) {
    let range = ranges.shift()!
    let i
    while ((i = ranges.findIndex((r) => intersectOrAdjacent(range, r))) >= 0) {
      const otherRange = ranges.splice(i, 1)[0]!
      range = merge(range, otherRange)
    }
    distinctRanges.push(range)
  }

  const part1 = distinctRanges[0][1] + 1

  let totalBlocked = distinctRanges.reduce((tot, r) => tot + (r[1] - r[0] + 1), 0)

  let part2 = 4294967295 - totalBlocked + 1

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
