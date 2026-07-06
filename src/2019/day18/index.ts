import { readFile } from '../../utils/io'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

type Grid = string[]
type Edge = { key: number; dist: number; doors: number }

/** Binary min-heap for Dijkstra. */
class MinHeap<T> {
  private items: T[] = []
  constructor(private compare: (a: T, b: T) => number) {}

  get size(): number {
    return this.items.length
  }

  push(item: T): void {
    const items = this.items
    items.push(item)
    let i = items.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.compare(items[i], items[parent]) >= 0) break
      ;[items[i], items[parent]] = [items[parent], items[i]]
      i = parent
    }
  }

  pop(): T | undefined {
    const items = this.items
    if (items.length === 0) return undefined
    const top = items[0]
    const last = items.pop()!
    if (items.length > 0) {
      items[0] = last
      let i = 0
      while (true) {
        const left = 2 * i + 1
        const right = 2 * i + 2
        let smallest = i
        if (left < items.length && this.compare(items[left], items[smallest]) < 0) smallest = left
        if (right < items.length && this.compare(items[right], items[smallest]) < 0)
          smallest = right
        if (smallest === i) break
        ;[items[i], items[smallest]] = [items[smallest], items[i]]
        i = smallest
      }
    }
    return top
  }
}

function bit(letter: string): number {
  return 1 << (letter.toLowerCase().charCodeAt(0) - 97)
}

/** From a source cell, BFS to every reachable key, recording distance and the doors on the way. */
function edgesFrom(grid: Grid, source: Pos): Edge[] {
  const edges: Edge[] = []
  const seen = new Set<string>([source.toString()])
  let frontier: { pos: Pos; dist: number; doors: number }[] = [{ pos: source, dist: 0, doors: 0 }]

  while (frontier.length > 0) {
    const next: typeof frontier = []
    for (const { pos, dist, doors } of frontier) {
      for (const n of pos.neighbours()) {
        const key = n.toString()
        if (seen.has(key)) continue
        const cell = grid[n.y]?.[n.x]
        if (cell === undefined || cell === '#') continue
        seen.add(key)
        let nextDoors = doors
        if (cell >= 'A' && cell <= 'Z') nextDoors |= bit(cell)
        if (cell >= 'a' && cell <= 'z') edges.push({ key: bit(cell), dist: dist + 1, doors })
        next.push({ pos: n, dist: dist + 1, doors: nextDoors })
      }
    }
    frontier = next
  }
  return edges
}

/** Shortest total distance for the given robots to collect every key. */
function collectAll(grid: Grid, starts: Pos[]): number {
  // Node labels: `s0..sN` for robot starts, otherwise the key bit as a string.
  const pois: { label: string; pos: Pos }[] = starts.map((pos, i) => ({ label: `s${i}`, pos }))
  let allKeys = 0
  grid.forEach((row, y) =>
    row.split('').forEach((cell, x) => {
      if (cell >= 'a' && cell <= 'z') {
        pois.push({ label: String(bit(cell)), pos: p(x, y) })
        allKeys |= bit(cell)
      }
    }),
  )

  const edges = new Map<string, Edge[]>()
  for (const poi of pois) edges.set(poi.label, edgesFrom(grid, poi.pos))

  // Dijkstra over (robot positions, collected keys).
  const startLabels = starts.map((_, i) => `s${i}`)
  const startState = `${startLabels.join('|')}#0`
  const best = new Map<string, number>([[startState, 0]])
  const pq = new MinHeap<{ state: string; positions: string[]; keys: number; dist: number }>(
    (a, b) => a.dist - b.dist,
  )
  pq.push({ state: startState, positions: startLabels, keys: 0, dist: 0 })

  while (pq.size > 0) {
    const current = pq.pop()!
    if (current.dist > (best.get(current.state) ?? Infinity)) continue
    if (current.keys === allKeys) return current.dist

    for (let r = 0; r < current.positions.length; r++) {
      for (const edge of edges.get(current.positions[r])!) {
        if (current.keys & edge.key) continue // already have this key
        if ((current.keys & edge.doors) !== edge.doors) continue // blocked by a door
        const keys = current.keys | edge.key
        const positions = [...current.positions]
        positions[r] = String(edge.key)
        const state = `${positions.join('|')}#${keys}`
        const dist = current.dist + edge.dist
        if (dist < (best.get(state) ?? Infinity)) {
          best.set(state, dist)
          pq.push({ state, positions, keys, dist })
        }
      }
    }
  }
  return -1
}

function resolvePart1(grid: Grid, start: Pos) {
  return collectAll(grid, [start])
}

function resolvePart2(grid: Grid, start: Pos) {
  // Seal the centre and split into four quadrants.
  const rows = grid.map((row) => row.split(''))
  for (const [dx, dy] of [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    rows[start.y + dy][start.x + dx] = '#'
  }
  const starts: Pos[] = []
  for (const [dx, dy] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    rows[start.y + dy][start.x + dx] = '@'
    starts.push(p(start.x + dx, start.y + dy))
  }
  return collectAll(
    rows.map((row) => row.join('')),
    starts,
  )
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const grid = input.replace(/\n$/, '').split('\n')
  let start = p(0, 0)
  grid.forEach((row, y) => {
    const x = row.indexOf('@')
    if (x >= 0) start = p(x, y)
  })

  const t0 = performance.now()

  let part1 = resolvePart1(grid, start)
  let part2 = resolvePart2(grid, start)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
