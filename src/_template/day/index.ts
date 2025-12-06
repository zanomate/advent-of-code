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
