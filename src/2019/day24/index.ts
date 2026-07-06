import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const SIZE = 5

function parse(input: string): boolean[][] {
  return input
    .trim()
    .split('\n')
    .map((row) => row.split('').map((c) => c === '#'))
}

function resolvePart1(initial: boolean[][]) {
  const biodiversity = (grid: boolean[][]): number => {
    let value = 0
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (grid[y][x]) value += 2 ** (y * SIZE + x)
      }
    }
    return value
  }

  let grid = initial
  const seen = new Set<number>()
  while (!seen.has(biodiversity(grid))) {
    seen.add(biodiversity(grid))
    const next = grid.map((row, y) =>
      row.map((bug, x) => {
        let count = 0
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          if (grid[y + dy]?.[x + dx]) count++
        }
        return bug ? count === 1 : count === 1 || count === 2
      }),
    )
    grid = next
  }
  return biodiversity(grid)
}

/** Neighbours of a recursive cell, crossing into outer (l-1) and inner (l+1) grids. */
function recursiveNeighbours(l: number, x: number, y: number): [number, number, number][] {
  const res: [number, number, number][] = []
  for (const [dx, dy] of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]) {
    const nx = x + dx
    const ny = y + dy
    if (nx < 0) res.push([l - 1, 1, 2])
    else if (nx > 4) res.push([l - 1, 3, 2])
    else if (ny < 0) res.push([l - 1, 2, 1])
    else if (ny > 4) res.push([l - 1, 2, 3])
    else if (nx === 2 && ny === 2) {
      if (dx === 1) for (let iy = 0; iy < SIZE; iy++) res.push([l + 1, 0, iy])
      else if (dx === -1) for (let iy = 0; iy < SIZE; iy++) res.push([l + 1, 4, iy])
      else if (dy === 1) for (let ix = 0; ix < SIZE; ix++) res.push([l + 1, ix, 0])
      else for (let ix = 0; ix < SIZE; ix++) res.push([l + 1, ix, 4])
    } else res.push([l, nx, ny])
  }
  return res
}

function resolvePart2(initial: boolean[][]) {
  let bugs = new Set<string>()
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (initial[y][x]) bugs.add(`0,${x},${y}`)
    }
  }

  for (let minute = 0; minute < 200; minute++) {
    const neighbourCount = new Map<string, number>()
    for (const cell of bugs) {
      const [l, x, y] = cell.split(',').map(Number)
      for (const [nl, nx, ny] of recursiveNeighbours(l, x, y)) {
        const key = `${nl},${nx},${ny}`
        neighbourCount.set(key, (neighbourCount.get(key) ?? 0) + 1)
      }
    }
    const next = new Set<string>()
    for (const [key, count] of neighbourCount) {
      if (bugs.has(key)) {
        if (count === 1) next.add(key)
      } else if (count === 1 || count === 2) next.add(key)
    }
    bugs = next
  }
  return bugs.size
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const grid = parse(input)

  const t0 = performance.now()

  let part1 = resolvePart1(grid)
  let part2 = resolvePart2(grid)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
