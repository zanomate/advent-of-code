import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Grid } from '../../utils/space/Grid'
import { p, Pos } from '../../utils/space/Pos'
import { DiagDir, Dir } from '../../utils/space/Dir'

type Cell = '.' | 'S' | '^'

function resolvePart1(grid: Grid<Cell>) {
  let splits: number = 0
  let tachyons: number[] = [grid.getRow(0).findIndex((c) => c === 'S')]
  for (let y = 1; y < grid.height; y++) {
    let newTachyons: number[] = []
    for (let x = 0; x < grid.width; x++) {
      if (tachyons.includes(x)) {
        const cell = grid.getCell(p(x, y))
        if (cell === '^') {
          splits++
          if (x > 0) newTachyons.push(x - 1)
          if (x < grid.width - 1) newTachyons.push(x + 1)
        } else {
          newTachyons.push(x)
        }
      }
    }
    tachyons = newTachyons
  }
  return splits
}

function findTimelines(pos: Pos, grid: Grid<Cell>, memo: Map<string, number>): number {
  if (pos.y === grid.height - 1) {
    return 1
  }

  const key = `${pos.x},${pos.y}`
  if (memo.has(key)) {
    return memo.get(key)!
  }

  let timelines = 0
  const cell = grid.getCell(pos)
  if (cell === '^') {
    if (pos.x > 0) {
      timelines += findTimelines(pos.shift(DiagDir.DOWN_LEFT), grid, memo)
    }
    if (pos.x < grid.width - 1) {
      timelines += findTimelines(pos.shift(DiagDir.DOWN_RIGHT), grid, memo)
    }
  } else {
    timelines += findTimelines(pos.shift(Dir.DOWN), grid, memo)
  }

  memo.set(key, timelines)
  return timelines
}

function resolvePart2(grid: Grid<Cell>) {
  const startX = grid.getRow(0).findIndex((c) => c === 'S')
  const startPos = p(startX, 0)
  return findTimelines(startPos, grid, new Map<string, number>())
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const values: Cell[][] = input.split('\n').map((line) => line.split('') as Cell[])
  const grid = Grid.fromValues<Cell>(values)

  const t0 = performance.now()

  let part1 = resolvePart1(grid)
  let part2 = resolvePart2(grid)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
