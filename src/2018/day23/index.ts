import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

interface Bot {
  x: number
  y: number
  z: number
  r: number
}

function parse(input: string): Bot[] {
  return input.split('\n').map((line) => {
    const [x, y, z, r] = line.match(/-?\d+/g)!.map(Number)
    return { x, y, z, r }
  })
}

const manhattan = (a: Bot, b: Bot): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)

function resolvePart1(bots: Bot[]): number {
  const strongest = bots.reduce((best, bot) => (bot.r > best.r ? bot : best))
  return bots.filter((bot) => manhattan(bot, strongest) <= strongest.r).length
}

interface Box {
  x: number
  y: number
  z: number
  size: number
}

// Distance from a box (its nearest corner) to a point on a single axis.
const axisDistance = (low: number, size: number, p: number): number => {
  const high = low + size - 1
  if (p < low) return low - p
  if (p > high) return p - high
  return 0
}

// Number of bots whose range intersects the box: a bot reaches the box when the
// clamped distance from its centre to the box is within its radius.
function botsInRange(box: Box, bots: Bot[]): number {
  let count = 0
  for (const bot of bots) {
    const d =
      axisDistance(box.x, box.size, bot.x) +
      axisDistance(box.y, box.size, bot.y) +
      axisDistance(box.z, box.size, bot.z)
    if (d <= bot.r) count++
  }
  return count
}

// Minimum Manhattan distance from the box to the origin.
const distanceToOrigin = (box: Box): number =>
  axisDistance(box.x, box.size, 0) +
  axisDistance(box.y, box.size, 0) +
  axisDistance(box.z, box.size, 0)

// Octree search: start with a cube covering every bot, always expand the most
// promising box (most bots in range, then closest to origin, then smallest),
// subdividing into eight until it collapses to a single point — that point is
// the answer, and its distance to the origin is the result.
function resolvePart2(bots: Bot[]): number {
  const coords = bots.flatMap((b) => [Math.abs(b.x), Math.abs(b.y), Math.abs(b.z)])
  let size = 1
  const max = Math.max(...coords)
  while (size < max) size *= 2

  interface Entry {
    box: Box
    count: number
    dist: number
  }

  // Best-first order: more bots first, then nearer to origin, then smaller box.
  const better = (a: Entry, b: Entry): boolean => {
    if (a.count !== b.count) return a.count > b.count
    if (a.dist !== b.dist) return a.dist < b.dist
    return a.box.size < b.box.size
  }

  const entryOf = (box: Box): Entry => ({
    box,
    count: botsInRange(box, bots),
    dist: distanceToOrigin(box),
  })

  const heap: Entry[] = [entryOf({ x: -size, y: -size, z: -size, size: size * 2 })]
  const push = (e: Entry) => {
    heap.push(e)
    let i = heap.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (!better(heap[i], heap[parent])) break
      ;[heap[parent], heap[i]] = [heap[i], heap[parent]]
      i = parent
    }
  }
  const pop = (): Entry => {
    const top = heap[0]
    const last = heap.pop()!
    if (heap.length > 0) {
      heap[0] = last
      let i = 0
      while (true) {
        const l = 2 * i + 1
        const r = 2 * i + 2
        let best = i
        if (l < heap.length && better(heap[l], heap[best])) best = l
        if (r < heap.length && better(heap[r], heap[best])) best = r
        if (best === i) break
        ;[heap[best], heap[i]] = [heap[i], heap[best]]
        i = best
      }
    }
    return top
  }

  while (heap.length > 0) {
    const { box, dist } = pop()
    if (box.size === 1) return dist
    const half = box.size / 2
    for (const dx of [0, half]) {
      for (const dy of [0, half]) {
        for (const dz of [0, half]) {
          push(entryOf({ x: box.x + dx, y: box.y + dy, z: box.z + dz, size: half }))
        }
      }
    }
  }

  return -1
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())
  const bots = parse(input)

  const t0 = performance.now()

  const part1: PartSolution = resolvePart1(bots)
  const part2: PartSolution = resolvePart2(bots)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
