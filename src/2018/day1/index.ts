import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function resolvePart1(changes: number[]) {
  let frequency = 0
  changes.forEach((change) => {
    frequency += change
  })
  return frequency
}

function resolvePart2(changes: number[]) {
  let i = 0
  let frequency = 0
  const found = new Set<number>()
  do {
    found.add(frequency)
    frequency += changes[i++ % changes.length]
  } while (!found.has(frequency))
  return frequency
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const changes = input.split('\n').map((line) => Number(line))

  const t0 = performance.now()
  const part1 = resolvePart1(changes)
  const part2 = resolvePart2(changes)
  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
