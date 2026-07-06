import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

interface Cave {
  depth: number
  tx: number
  ty: number
}

function parse(input: string): Cave {
  const [depthLine, targetLine] = input.split('\n')
  const depth = Number(depthLine.match(/\d+/)![0])
  const [tx, ty] = targetLine
    .match(/(\d+),(\d+)/)!
    .slice(1)
    .map(Number)
  return { depth, tx, ty }
}

const MODULO = 20183

// Region type at each cell: 0 rocky, 1 wet, 2 narrow. Erosion is cached and
// grown lazily beyond the target so pathfinding can step around it.
function erosionMap({ depth, tx, ty }: Cave) {
  const erosion = new Map<string, number>()

  const at = (x: number, y: number): number => {
    const k = `${x},${y}`
    const cached = erosion.get(k)
    if (cached !== undefined) return cached
    let geologic: number
    if ((x === 0 && y === 0) || (x === tx && y === ty)) geologic = 0
    else if (y === 0) geologic = x * 16807
    else if (x === 0) geologic = y * 48271
    else geologic = at(x - 1, y) * at(x, y - 1)
    const value = (geologic + depth) % MODULO
    erosion.set(k, value)
    return value
  }

  return { at, type: (x: number, y: number): number => at(x, y) % 3 }
}

function resolvePart1(cave: Cave): number {
  const { type } = erosionMap(cave)
  let risk = 0
  for (let y = 0; y <= cave.ty; y++) {
    for (let x = 0; x <= cave.tx; x++) risk += type(x, y)
  }
  return risk
}

// Tools: 0 neither, 1 torch, 2 gear. In a region of type t, tool t is the one
// that is not allowed, so every region admits exactly the other two tools.
// Dijkstra over (x, y, tool): move to a neighbour costs 1 (tool must be valid
// in both regions), switching tool costs 7. Start torch at origin, reach the
// target holding the torch.
function resolvePart2(cave: Cave): number {
  const { type } = erosionMap(cave)
  const TORCH = 1

  const key = (x: number, y: number, tool: number): string => `${x},${y},${tool}`
  const goal = key(cave.tx, cave.ty, TORCH)

  const dist = new Map<string, number>()
  // Simple binary heap keyed on cost.
  const heap: [number, number, number, number][] = [[0, 0, 0, TORCH]]
  const push = (item: [number, number, number, number]) => {
    heap.push(item)
    let i = heap.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (heap[parent][0] <= heap[i][0]) break
      ;[heap[parent], heap[i]] = [heap[i], heap[parent]]
      i = parent
    }
  }
  const pop = (): [number, number, number, number] => {
    const top = heap[0]
    const last = heap.pop()!
    if (heap.length > 0) {
      heap[0] = last
      let i = 0
      while (true) {
        const l = 2 * i + 1
        const r = 2 * i + 2
        let smallest = i
        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l
        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r
        if (smallest === i) break
        ;[heap[smallest], heap[i]] = [heap[i], heap[smallest]]
        i = smallest
      }
    }
    return top
  }

  while (heap.length > 0) {
    const [cost, x, y, tool] = pop()
    const k = key(x, y, tool)
    if (k === goal) return cost
    if (dist.has(k) && dist.get(k)! < cost) continue

    // Switch to the other tool allowed in this region.
    const t = type(x, y)
    for (let other = 0; other < 3; other++) {
      if (other === tool || other === t) continue
      const nk = key(x, y, other)
      const nc = cost + 7
      if (!dist.has(nk) || nc < dist.get(nk)!) {
        dist.set(nk, nc)
        push([nc, x, y, other])
      }
    }

    // Move to a neighbour where the current tool is still valid.
    for (const [nx, ny] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]) {
      if (nx < 0 || ny < 0) continue
      if (type(nx, ny) === tool) continue
      const nk = key(nx, ny, tool)
      const nc = cost + 1
      if (!dist.has(nk) || nc < dist.get(nk)!) {
        dist.set(nk, nc)
        push([nc, nx, ny, tool])
      }
    }
  }

  return -1
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())
  const cave = parse(input)

  const t0 = performance.now()

  const part1: PartSolution = resolvePart1(cave)
  const part2: PartSolution = resolvePart2(cave)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
