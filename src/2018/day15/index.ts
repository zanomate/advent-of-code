import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

type UnitType = 'E' | 'G'

interface Unit {
  x: number
  y: number
  type: UnitType
  hp: number
  ap: number
  alive: boolean
}

interface Board {
  walls: boolean[][]
  units: Unit[]
}

interface Outcome {
  outcome: number
  initialElves: number
  remainingElves: number
  elvesWin: boolean
}

const key = (x: number, y: number): string => `${x},${y}`

// Reading order: top-to-bottom, then left-to-right.
const readingOrder = (a: Unit, b: Unit): number => a.y - b.y || a.x - b.x

// Neighbours of a square in reading order (up, left, right, down).
const neighbours = (x: number, y: number): [number, number][] => [
  [x, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x, y + 1],
]

function parse(input: string): Board {
  const walls: boolean[][] = []
  const units: Unit[] = []
  input.split('\n').forEach((line, y) => {
    const row: boolean[] = []
    ;[...line].forEach((cell, x) => {
      row.push(cell === '#')
      if (cell === 'E' || cell === 'G') {
        units.push({ x, y, type: cell, hp: 200, ap: 3, alive: true })
      }
    })
    walls.push(row)
  })
  return { walls, units }
}

function occupancy(units: Unit[]): Set<string> {
  const set = new Set<string>()
  for (const u of units) if (u.alive) set.add(key(u.x, u.y))
  return set
}

// Breadth-first distances from (sx, sy) over open, unoccupied squares.
function distances(
  sx: number,
  sy: number,
  walls: boolean[][],
  occupied: Set<string>,
): Map<string, number> {
  const dist = new Map<string, number>([[key(sx, sy), 0]])
  let frontier: [number, number][] = [[sx, sy]]
  while (frontier.length > 0) {
    const next: [number, number][] = []
    for (const [x, y] of frontier) {
      const d = dist.get(key(x, y))! + 1
      for (const [nx, ny] of neighbours(x, y)) {
        const k = key(nx, ny)
        if (walls[ny]?.[nx] || occupied.has(k) || dist.has(k)) continue
        dist.set(k, d)
        next.push([nx, ny])
      }
    }
    frontier = next
  }
  return dist
}

function takeTurn(unit: Unit, board: Board): void {
  const { walls, units } = board
  const enemies = units.filter((u) => u.alive && u.type !== unit.type)

  const adjacentEnemy = (): Unit | undefined => {
    let best: Unit | undefined
    for (const e of enemies) {
      if (!e.alive) continue
      if (Math.abs(e.x - unit.x) + Math.abs(e.y - unit.y) !== 1) continue
      if (!best || e.hp < best.hp || (e.hp === best.hp && readingOrder(e, best) < 0)) best = e
    }
    return best
  }

  if (!adjacentEnemy()) {
    // Move toward the nearest in-range square (open square next to an enemy).
    const occupied = occupancy(units)
    const inRange = new Set<string>()
    for (const e of enemies) {
      for (const [nx, ny] of neighbours(e.x, e.y)) {
        if (!walls[ny]?.[nx] && !occupied.has(key(nx, ny))) inRange.add(key(nx, ny))
      }
    }

    const fromUnit = distances(unit.x, unit.y, walls, occupied)
    let target: { x: number; y: number; dist: number } | undefined
    for (const k of inRange) {
      const d = fromUnit.get(k)
      if (d === undefined) continue
      const [x, y] = k.split(',').map(Number)
      if (
        !target ||
        d < target.dist ||
        (d === target.dist && (y < target.y || (y === target.y && x < target.x)))
      ) {
        target = { x, y, dist: d }
      }
    }

    if (target) {
      const fromTarget = distances(target.x, target.y, walls, occupied)
      let step: { x: number; y: number; dist: number } | undefined
      for (const [nx, ny] of neighbours(unit.x, unit.y)) {
        if (walls[ny]?.[nx] || occupied.has(key(nx, ny))) continue
        const d = fromTarget.get(key(nx, ny))
        if (d === undefined) continue
        if (!step || d < step.dist) step = { x: nx, y: ny, dist: d }
      }
      if (step) {
        unit.x = step.x
        unit.y = step.y
      }
    }
  }

  const victim = adjacentEnemy()
  if (victim) {
    victim.hp -= unit.ap
    if (victim.hp <= 0) victim.alive = false
  }
}

function simulate(input: string, elfAp: number): Outcome {
  const board = parse(input)
  const initialElves = board.units.filter((u) => u.type === 'E').length
  for (const u of board.units) if (u.type === 'E') u.ap = elfAp

  let rounds = 0
  outer: while (true) {
    const order = board.units.filter((u) => u.alive).sort(readingOrder)
    for (const unit of order) {
      if (!unit.alive) continue
      const enemiesLeft = board.units.some((u) => u.alive && u.type !== unit.type)
      if (!enemiesLeft) break outer
      takeTurn(unit, board)
    }
    rounds++
  }

  const survivors = board.units.filter((u) => u.alive)
  const hp = survivors.reduce((acc, u) => acc + u.hp, 0)
  const remainingElves = survivors.filter((u) => u.type === 'E').length
  return {
    outcome: rounds * hp,
    initialElves,
    remainingElves,
    elvesWin: survivors.every((u) => u.type === 'E'),
  }
}

function resolvePart1(input: string): PartSolution {
  return simulate(input, 3).outcome
}

function resolvePart2(input: string): PartSolution {
  for (let ap = 4; ; ap++) {
    const result = simulate(input, ap)
    if (result.elvesWin && result.remainingElves === result.initialElves) {
      return result.outcome
    }
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\n$/, ''))

  const t0 = performance.now()

  const part1 = resolvePart1(input)
  const part2 = resolvePart2(input)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
