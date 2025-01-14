import { readFile } from '../../utils/io'

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
    res = blinkIterative(newStone1, remainingIterations) + blinkIterative(newStone2, remainingIterations)
  }
  // rule 3
  else {
    res = blinkIterative(stone * 2024, remainingIterations)
  }

  memoizedCounts.set(memoKey, res)
  return res
}

export default async function () {
  const input = await readFile('./src/2024/day11/input.txt').then((text) => text.trim())
  let stones = input.split(' ').map((num) => parseInt(num))

  const t0 = performance.now()

  let tot1 = 0
  let tot2 = 0
  for (let i = 0; i < stones.length; i++) {
    tot1 += blinkIterative(stones[i], 25)
    tot2 += blinkIterative(stones[i], 75)
  }

  const t1 = performance.now()

  console.log('Part 1:', tot1)
  console.log('Part 2:', tot2)
  console.log('Time (ms):', t1 - t0)
}
