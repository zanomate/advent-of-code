import { readFile } from '../../utils/io'
import { sum } from '../../utils/math'
import { DaySolution } from '../../utils/type'

function fuel(mass: number): number {
  return Math.floor(mass / 3) - 2
}

function totalFuel(mass: number): number {
  let total = 0
  let current = fuel(mass)
  while (current > 0) {
    total += current
    current = fuel(current)
  }
  return total
}

function resolvePart1(masses: number[]) {
  return sum(masses.map(fuel))
}

function resolvePart2(masses: number[]) {
  return sum(masses.map(totalFuel))
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const masses = input.trim().split('\n').map(Number)

  const t0 = performance.now()

  let part1 = resolvePart1(masses)
  let part2 = resolvePart2(masses)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
