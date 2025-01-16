import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

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

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
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

  return [part1, part2, t1 - t0]
}
