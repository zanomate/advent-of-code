import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const memoizedCounts: Map<string, number> = new Map<string, number>()

function blinkIterative(stone: number, iterations: number): number {
  if (iterations === 0) return 1

  const memoKey = `${stone}#${iterations}`
  if (memoizedCounts.has(memoKey)) {
    return memoizedCounts.get(memoKey) as number
  }
  let res = 0

  const remainingIterations = iterations - 1
  const asString = String(stone)
  const digitCount = asString.length

  // rule 1
  if (stone === 0) {
    res = blinkIterative(1, remainingIterations)
  }
  // rule 2
  else if (digitCount % 2 === 0) {
    const newStone1 = parseInt(asString.slice(0, digitCount / 2))
    const newStone2 = parseInt(asString.slice(digitCount / 2))
    res =
      blinkIterative(newStone1, remainingIterations) +
      blinkIterative(newStone2, remainingIterations)
  }
  // rule 3
  else {
    res = blinkIterative(stone * 2024, remainingIterations)
  }

  memoizedCounts.set(memoKey, res)
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  let stones = input.split(' ').map((num) => parseInt(num))

  const t0 = performance.now()

  let part1 = 0
  let part2 = 0
  for (let i = 0; i < stones.length; i++) {
    part1 += blinkIterative(stones[i], 25)
    part2 += blinkIterative(stones[i], 75)
  }

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
