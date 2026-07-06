import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

interface Input {
  plants: Set<number>
  rules: Map<string, string>
}

function parse(input: string): Input {
  const [stateBlock, rulesBlock] = input.split('\n\n')
  const state = stateBlock.replace('initial state: ', '')
  const plants = new Set<number>()
  ;[...state].forEach((cell, i) => {
    if (cell === '#') plants.add(i)
  })

  const rules = new Map<string, string>()
  for (const line of rulesBlock.split('\n')) {
    const [pattern, result] = line.split(' => ')
    rules.set(pattern, result)
  }

  return { plants, rules }
}

function step(plants: Set<number>, rules: Map<string, string>): Set<number> {
  const min = Math.min(...plants)
  const max = Math.max(...plants)
  const next = new Set<number>()
  for (let i = min - 2; i <= max + 2; i++) {
    const key = [-2, -1, 0, 1, 2].map((d) => (plants.has(i + d) ? '#' : '.')).join('')
    if (rules.get(key) === '#') next.add(i)
  }
  return next
}

function sumPlants(plants: Set<number>): number {
  let sum = 0
  for (const i of plants) sum += i
  return sum
}

// Normalized shape (indices relative to the leftmost plant). Once this repeats,
// the pattern only slides sideways and the sum grows by a constant delta.
function shapeOf(plants: Set<number>): string {
  const min = Math.min(...plants)
  return [...plants]
    .map((i) => i - min)
    .sort((a, b) => a - b)
    .join(',')
}

function resolvePart1({ plants, rules }: Input): PartSolution {
  let current = plants
  for (let gen = 0; gen < 20; gen++) current = step(current, rules)
  return sumPlants(current)
}

function resolvePart2({ plants, rules }: Input): PartSolution {
  const target = 50_000_000_000
  let current = plants
  let previousShape = shapeOf(current)
  let previousSum = sumPlants(current)

  for (let gen = 1; gen <= target; gen++) {
    current = step(current, rules)
    const shape = shapeOf(current)
    const sum = sumPlants(current)
    if (shape === previousShape) {
      const delta = sum - previousSum
      const remaining = target - gen
      return sum + delta * remaining
    }
    previousShape = shape
    previousSum = sum
  }

  return sumPlants(current)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trimEnd())
  const parsed = parse(input)

  const t0 = performance.now()

  const part1 = resolvePart1(parsed)
  const part2 = resolvePart2(parsed)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
