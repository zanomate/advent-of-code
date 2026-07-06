import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

const GRID_SIZE = 300

function powerLevel(x: number, y: number, serial: number): number {
  const rackId = x + 10
  let power = rackId * y
  power += serial
  power *= rackId
  power = Math.floor(power / 100) % 10
  return power - 5
}

// Summed-area table: sat[x][y] = sum of power over the rectangle (1,1)..(x,y).
// Indices 1..GRID_SIZE, row/col 0 kept as zeros for the boundary.
function buildSummedAreaTable(serial: number): number[][] {
  const sat: number[][] = Array.from({ length: GRID_SIZE + 1 }, () =>
    new Array<number>(GRID_SIZE + 1).fill(0),
  )
  for (let x = 1; x <= GRID_SIZE; x++) {
    for (let y = 1; y <= GRID_SIZE; y++) {
      sat[x][y] =
        powerLevel(x, y, serial) + sat[x - 1][y] + sat[x][y - 1] - sat[x - 1][y - 1]
    }
  }
  return sat
}

// Total power of the size x size square with top-left corner (x, y).
function squarePower(sat: number[][], x: number, y: number, size: number): number {
  const bx = x + size - 1
  const by = y + size - 1
  return sat[bx][by] - sat[x - 1][by] - sat[bx][y - 1] + sat[x - 1][y - 1]
}

interface Best {
  x: number
  y: number
  size: number
  power: number
}

function bestSquare(sat: number[][], minSize: number, maxSize: number): Best {
  let best: Best = { x: 0, y: 0, size: 0, power: -Infinity }
  for (let size = minSize; size <= maxSize; size++) {
    for (let x = 1; x <= GRID_SIZE - size + 1; x++) {
      for (let y = 1; y <= GRID_SIZE - size + 1; y++) {
        const power = squarePower(sat, x, y, size)
        if (power > best.power) best = { x, y, size, power }
      }
    }
  }
  return best
}

function resolvePart1(sat: number[][]): PartSolution {
  const { x, y } = bestSquare(sat, 3, 3)
  return `${x},${y}`
}

function resolvePart2(sat: number[][]): PartSolution {
  const { x, y, size } = bestSquare(sat, 1, GRID_SIZE)
  return `${x},${y},${size}`
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const serial = Number(input)
  const sat = buildSummedAreaTable(serial)

  const t0 = performance.now()

  const part1 = resolvePart1(sat)
  const part2 = resolvePart2(sat)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
