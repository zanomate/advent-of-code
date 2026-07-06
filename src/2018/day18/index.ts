import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

const OPEN = '.'
const TREE = '|'
const LUMBER = '#'

type Grid = string[][]

function parse(input: string): Grid {
  return input.split('\n').map((line) => [...line])
}

function neighbours(grid: Grid, x: number, y: number): string[] {
  const result: string[] = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const row = grid[y + dy]
      if (row && row[x + dx] !== undefined) result.push(row[x + dx])
    }
  }
  return result
}

function step(grid: Grid): Grid {
  return grid.map((row, y) =>
    row.map((cell, x) => {
      const adj = neighbours(grid, x, y)
      const trees = adj.filter((c) => c === TREE).length
      const lumber = adj.filter((c) => c === LUMBER).length
      if (cell === OPEN) return trees >= 3 ? TREE : OPEN
      if (cell === TREE) return lumber >= 3 ? LUMBER : TREE
      // lumberyard stays only if adjacent to >=1 lumberyard and >=1 tree
      return lumber >= 1 && trees >= 1 ? LUMBER : OPEN
    }),
  )
}

function resourceValue(grid: Grid): number {
  const flat = grid.flat()
  const trees = flat.filter((c) => c === TREE).length
  const lumber = flat.filter((c) => c === LUMBER).length
  return trees * lumber
}

const serialize = (grid: Grid): string => grid.map((row) => row.join('')).join('\n')

function resolvePart1(grid: Grid): PartSolution {
  let current = grid
  for (let minute = 0; minute < 10; minute++) current = step(current)
  return resourceValue(current)
}

function resolvePart2(grid: Grid): PartSolution {
  const target = 1_000_000_000
  const seen = new Map<string, number>()
  let current = grid

  for (let minute = 0; minute < target; minute++) {
    const state = serialize(current)
    const previous = seen.get(state)
    if (previous !== undefined) {
      const cycle = minute - previous
      const remaining = (target - minute) % cycle
      for (let i = 0; i < remaining; i++) current = step(current)
      return resourceValue(current)
    }
    seen.set(state, minute)
    current = step(current)
  }

  return resourceValue(current)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())
  const grid = parse(input)

  const t0 = performance.now()

  const part1 = resolvePart1(grid)
  const part2 = resolvePart2(grid)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
