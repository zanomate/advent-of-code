import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const presents: number[][] = input
    .split('\n')
    .map((line) => line.split('x').map((str) => parseInt(str)))

  const t0 = performance.now()

  let paper = 0
  let ribbon = 0
  presents.forEach((present) => {
    const sides = present.sort((a, b) => a - b)
    const areas = [sides[0] * sides[1], sides[1] * sides[2], sides[2] * sides[0]]
    paper += 2 * areas.reduce((sum, area) => sum + area, 0) + areas[0]
    ribbon += 2 * (sides[0] + sides[1]) + sides.reduce((mul, side) => mul * side, 1)
  })

  const part1 = paper
  const part2 = ribbon

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
