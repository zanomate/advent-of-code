import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

interface Cart {
  x: number
  y: number
  dx: number
  dy: number
  turns: number
  dead: boolean
}

interface Input {
  grid: string[][]
  carts: Cart[]
}

const CART_DIRS: Record<string, { dx: number; dy: number; track: string }> = {
  '^': { dx: 0, dy: -1, track: '|' },
  v: { dx: 0, dy: 1, track: '|' },
  '<': { dx: -1, dy: 0, track: '-' },
  '>': { dx: 1, dy: 0, track: '-' },
}

function parse(input: string): Input {
  const lines = input.split('\n')
  const grid: string[][] = []
  const carts: Cart[] = []

  lines.forEach((line, y) => {
    const row = [...line]
    row.forEach((cell, x) => {
      const dir = CART_DIRS[cell]
      if (dir) {
        carts.push({ x, y, dx: dir.dx, dy: dir.dy, turns: 0, dead: false })
        row[x] = dir.track
      }
    })
    grid.push(row)
  })

  return { grid, carts }
}

function cloneCarts(carts: Cart[]): Cart[] {
  return carts.map((c) => ({ ...c }))
}

// Carts move in reading order (top-to-bottom, left-to-right) each tick.
function inReadingOrder(carts: Cart[]): Cart[] {
  return [...carts].sort((a, b) => a.y - b.y || a.x - b.x)
}

function turn(cart: Cart, track: string): void {
  if (track === '/') {
    ;[cart.dx, cart.dy] = [-cart.dy, -cart.dx]
  } else if (track === '\\') {
    ;[cart.dx, cart.dy] = [cart.dy, cart.dx]
  } else if (track === '+') {
    const choice = cart.turns % 3
    if (choice === 0) [cart.dx, cart.dy] = [cart.dy, -cart.dx] // left
    else if (choice === 2) [cart.dx, cart.dy] = [-cart.dy, cart.dx] // right
    cart.turns++
  }
}

function collisionAt(cart: Cart, carts: Cart[]): Cart | undefined {
  return carts.find((o) => o !== cart && !o.dead && o.x === cart.x && o.y === cart.y)
}

function resolvePart1({ grid, carts }: Input): PartSolution {
  const state = cloneCarts(carts)
  while (true) {
    for (const cart of inReadingOrder(state)) {
      if (cart.dead) continue
      cart.x += cart.dx
      cart.y += cart.dy
      if (collisionAt(cart, state)) return `${cart.x},${cart.y}`
      turn(cart, grid[cart.y][cart.x])
    }
  }
}

function resolvePart2({ grid, carts }: Input): PartSolution {
  let state = cloneCarts(carts)
  while (state.length > 1) {
    for (const cart of inReadingOrder(state)) {
      if (cart.dead) continue
      cart.x += cart.dx
      cart.y += cart.dy
      const other = collisionAt(cart, state)
      if (other) {
        cart.dead = true
        other.dead = true
      } else {
        turn(cart, grid[cart.y][cart.x])
      }
    }
    state = state.filter((c) => !c.dead)
  }
  const last = state[0]
  return last ? `${last.x},${last.y}` : ''
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\n$/, ''))
  const parsed = parse(input)

  const t0 = performance.now()

  const part1 = resolvePart1(parsed)
  const part2 = resolvePart2(parsed)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
