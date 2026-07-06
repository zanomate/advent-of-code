import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

const key = (x: number, y: number): string => `${x},${y}`

interface Scan {
  grid: Map<string, string>
  minY: number
  maxY: number
}

function parse(input: string): Scan {
  const grid = new Map<string, string>()
  let minY = Infinity
  let maxY = -Infinity

  for (const line of input.split('\n')) {
    const m = line.match(/([xy])=(\d+), ([xy])=(\d+)\.\.(\d+)/)
    if (!m) continue
    const [, axis, v, , r1, r2] = m
    const value = Number(v)
    const from = Number(r1)
    const to = Number(r2)
    for (let i = from; i <= to; i++) {
      const x = axis === 'x' ? value : i
      const y = axis === 'x' ? i : value
      grid.set(key(x, y), '#')
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }

  return { grid, minY, maxY }
}

function solve(input: string): [number, number] {
  const { grid, minY, maxY } = parse(input)
  const get = (x: number, y: number): string | undefined => grid.get(key(x, y))
  const solid = (x: number, y: number): boolean => {
    const c = get(x, y)
    return c === '#' || c === '~'
  }

  // Scan a row from x outward. Returns whether a clay wall was hit and the
  // last row cell reached. Fall points are recursed into and re-checked: if a
  // basin below fills up during recursion, the scan continues past it.
  function scan(x: number, y: number, dx: number): [boolean, number] {
    let cx = x
    grid.set(key(cx, y), '|')
    while (true) {
      const nx = cx + dx
      if (get(nx, y) === '#') return [true, cx]
      if (!solid(nx, y + 1)) {
        grid.set(key(nx, y), '|')
        flow(nx, y + 1)
        if (!solid(nx, y + 1)) return [false, nx]
      }
      grid.set(key(nx, y), '|')
      cx = nx
    }
  }

  function flow(x: number, y: number): void {
    if (y > maxY) return

    if (get(x, y + 1) === undefined) {
      grid.set(key(x, y), '|')
      flow(x, y + 1)
    }

    if (!solid(x, y + 1)) {
      grid.set(key(x, y), '|')
      return
    }

    // Below is a solid floor: try to fill this row.
    const [leftWall, l] = scan(x, y, -1)
    const [rightWall, r] = scan(x, y, 1)
    const fill = leftWall && rightWall ? '~' : '|'
    for (let i = l; i <= r; i++) grid.set(key(i, y), fill)
  }

  flow(500, 0)

  let reached = 0
  let settled = 0
  for (const [k, cell] of grid) {
    const y = Number(k.split(',')[1])
    if (y < minY || y > maxY) continue
    if (cell === '~') {
      settled++
      reached++
    } else if (cell === '|') {
      reached++
    }
  }
  return [reached, settled]
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())

  const t0 = performance.now()

  const [part1, part2] = solve(input) as [PartSolution, PartSolution]

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
