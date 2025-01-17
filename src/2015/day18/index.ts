import { cloneDeep } from 'lodash'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Grid = boolean[][]
type Pos = [number, number]

const POS_SHIFTS: Pos[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const grid: Grid = input.split('\n').map((line) => line.split('').map((cell) => cell === '#'))

  const t0 = performance.now()

  const iterations = 100

  const lastX = grid[0].length - 1
  const lastY = grid.length - 1

  const getNeighbors = ([x, y]: Pos, [maxX, maxY]: Pos): Pos[] => {
    return POS_SHIFTS.map(([dX, dY]) => [x + dX, y + dY] as Pos).filter(
      ([x, y]) => x >= 0 && x <= maxX && y >= 0 && y <= maxY,
    )
  }

  const evolve = (grid: Grid): Grid =>
    grid.map((line, y) =>
      line.map((cell, x) => {
        const neighbors = getNeighbors([x, y], [lastX, lastY])
        const alive = neighbors.filter(([x, y]) => !!grid[y][x]).length
        if (cell) return [2, 3].includes(alive)
        return alive === 3
      }),
    )

  const turnCornersOn = (grid: Grid) => {
    grid[0][0] = true
    grid[0][lastX] = true
    grid[lastY][0] = true
    grid[lastY][lastX] = true
  }

  const count = (grid: Grid): number =>
    grid.reduce((tot, line) => tot + line.reduce((tot, cell) => tot + (cell ? 1 : 0), 0), 0)

  const print = (grid: Grid) => {
    grid.forEach((line) => {
      console.log(line.map((cell) => (cell ? '#' : '.')).join(''))
    })
    console.log('\n')
  }

  let current = cloneDeep(grid)
  for (let i = 0; i < iterations; i++) {
    current = evolve(current)
  }

  const part1 = count(current)

  current = cloneDeep(grid)
  turnCornersOn(current)

  for (let i = 0; i < iterations; i++) {
    current = evolve(current)
    turnCornersOn(current)
  }

  const part2 = count(current)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
