import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function digits(n: number): number[] {
  return String(n).split('').map(Number)
}

function nonDecreasing(ds: number[]): boolean {
  return ds.every((d, i) => i === 0 || d >= ds[i - 1])
}

/** Lengths of each run of equal adjacent digits. */
function runLengths(ds: number[]): number[] {
  const runs: number[] = []
  let count = 1
  for (let i = 1; i <= ds.length; i++) {
    if (i < ds.length && ds[i] === ds[i - 1]) count++
    else {
      runs.push(count)
      count = 1
    }
  }
  return runs
}

function resolvePart1(from: number, to: number) {
  let count = 0
  for (let n = from; n <= to; n++) {
    const ds = digits(n)
    if (nonDecreasing(ds) && runLengths(ds).some((r) => r >= 2)) count++
  }
  return count
}

function resolvePart2(from: number, to: number) {
  let count = 0
  for (let n = from; n <= to; n++) {
    const ds = digits(n)
    if (nonDecreasing(ds) && runLengths(ds).some((r) => r === 2)) count++
  }
  return count
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const [from, to] = input.trim().split('-').map(Number)

  const t0 = performance.now()

  let part1 = resolvePart1(from, to)
  let part2 = resolvePart2(from, to)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
