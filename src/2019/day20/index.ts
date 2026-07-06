import { readFile } from '../../utils/io'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

type Portal = { dest: Pos; outer: boolean }

type Maze = {
  open: Set<string>
  portals: Map<string, Portal>
  start: Pos
  end: Pos
}

function isLetter(ch: string | undefined): boolean {
  return ch !== undefined && ch >= 'A' && ch <= 'Z'
}

function parseMaze(lines: string[]): Maze {
  const at = (x: number, y: number): string => lines[y]?.[x] ?? ' '
  const width = Math.max(...lines.map((l) => l.length))
  const height = lines.length

  const open = new Set<string>()
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (at(x, y) === '.') open.add(p(x, y).toString())
    }
  }

  // Collect labels with the dot cell they attach to.
  const labels = new Map<string, Pos[]>()
  const addLabel = (name: string, dot: Pos) => {
    if (!labels.has(name)) labels.set(name, [])
    labels.get(name)!.push(dot)
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const c = at(x, y)
      if (!isLetter(c)) continue
      if (isLetter(at(x + 1, y))) {
        const name = c + at(x + 1, y)
        const dot = at(x - 1, y) === '.' ? p(x - 1, y) : p(x + 2, y)
        addLabel(name, dot)
      }
      if (isLetter(at(x, y + 1))) {
        const name = c + at(x, y + 1)
        const dot = at(x, y - 1) === '.' ? p(x, y - 1) : p(x, y + 2)
        addLabel(name, dot)
      }
    }
  }

  const isOuter = (pos: Pos): boolean =>
    pos.x <= 2 || pos.y <= 2 || pos.x >= width - 3 || pos.y >= height - 3

  const portals = new Map<string, Portal>()
  for (const [name, positions] of labels) {
    if (name === 'AA' || name === 'ZZ') continue
    const [a, b] = positions
    portals.set(a.toString(), { dest: b, outer: isOuter(a) })
    portals.set(b.toString(), { dest: a, outer: isOuter(b) })
  }

  return { open, portals, start: labels.get('AA')![0], end: labels.get('ZZ')![0] }
}

function resolvePart1(maze: Maze) {
  const dist = new Map<string, number>([[maze.start.toString(), 0]])
  const queue: Pos[] = [maze.start]
  while (queue.length > 0) {
    const pos = queue.shift()!
    const d = dist.get(pos.toString())!
    if (pos.equals(maze.end)) return d
    const nexts = pos.neighbours().filter((n) => maze.open.has(n.toString()))
    const portal = maze.portals.get(pos.toString())
    if (portal) nexts.push(portal.dest)
    for (const n of nexts) {
      if (dist.has(n.toString())) continue
      dist.set(n.toString(), d + 1)
      queue.push(n)
    }
  }
  return -1
}

function resolvePart2(maze: Maze) {
  const stateKey = (pos: Pos, level: number) => `${pos.toString()}@${level}`
  const start = { pos: maze.start, level: 0 }
  const dist = new Map<string, number>([[stateKey(start.pos, 0), 0]])
  let frontier = [start]
  let steps = 0

  while (frontier.length > 0) {
    const next: typeof frontier = []
    for (const { pos, level } of frontier) {
      if (pos.equals(maze.end) && level === 0) return steps

      const moves: { pos: Pos; level: number }[] = pos
        .neighbours()
        .filter((n) => maze.open.has(n.toString()))
        .map((n) => ({ pos: n, level }))

      const portal = maze.portals.get(pos.toString())
      if (portal) {
        if (portal.outer && level > 0) moves.push({ pos: portal.dest, level: level - 1 })
        if (!portal.outer) moves.push({ pos: portal.dest, level: level + 1 })
      }

      for (const move of moves) {
        const key = stateKey(move.pos, move.level)
        if (dist.has(key)) continue
        dist.set(key, steps + 1)
        next.push(move)
      }
    }
    frontier = next
    steps++
  }
  return -1
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const lines = input.replace(/\n$/, '').split('\n')
  const maze = parseMaze(lines)

  const t0 = performance.now()

  let part1 = resolvePart1(maze)
  let part2 = resolvePart2(maze)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
