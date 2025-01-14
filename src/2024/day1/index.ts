import { readFile } from '../../utils/io'

function computeDistance(leftNums: number[], rightNums: number[]): number {
  let tot = 0
  for (let i = 0; i < leftNums.length; i++) {
    tot += Math.abs(rightNums[i] - leftNums[i])
  }
  return tot
}

function computeSimilarity(leftNums: number[], rightNums: number[]): number {
  let tot = 0
  for (let left of leftNums) {
    tot += left * rightNums.filter((right) => right === left).length
  }
  return tot
}

export default async function () {
  const input = await readFile('./src/2024/day1/input.txt').then((text) => text.trim())
  const leftNums: number[] = []
  const rightNums: number[] = []
  input.split('\n').forEach((line) => {
    const [left, right] = line.split('   ')
    leftNums.push(parseInt(left))
    rightNums.push(parseInt(right))
  })
  leftNums.sort()
  rightNums.sort()

  const t0 = performance.now()

  let part1 = computeDistance(leftNums, rightNums)
  let part2 = computeSimilarity(leftNums, rightNums)

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
