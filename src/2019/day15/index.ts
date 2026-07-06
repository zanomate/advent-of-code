import { readFile } from '../../utils/io'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

// Movement commands as understood by the droid, with matching deltas.
const MOVES: { command: number; delta: Pos; back: number }[] = [
  { command: 1, delta: p(0, -1), back: 2 },
  { command: 2, delta: p(0, 1), back: 1 },
  { command: 3, delta: p(-1, 0), back: 4 },
  { command: 4, delta: p(1, 0), back: 3 },
]

/** Explore the whole maze with backtracking DFS, returning open cells and the oxygen position. */
function explore(program: number[]): { open: Set<string>; oxygen: Pos } {
  const vm = new Intcode(program)
  const open = new Set<string>([p(0, 0).toString()])
  let oxygen = p(0, 0)

  const dfs = (pos: Pos): void => {
    for (const move of MOVES) {
      const next = pos.sum(move.delta)
      const key = next.toString()
      if (open.has(key)) continue
      const status = vm.runWith(move.command)[0]
      if (status === 0) continue // wall, droid did not move
      open.add(key)
      if (status === 2) oxygen = next
      dfs(next)
      vm.runWith(move.back) // step back to `pos`
    }
  }

  // Mark visited to avoid re-walking already-open cells during DFS.
  dfs(p(0, 0))
  return { open, oxygen }
}

/** BFS distances over open cells from a source. */
function bfs(open: Set<string>, source: Pos): Map<string, number> {
  const dist = new Map<string, number>([[source.toString(), 0]])
  const queue: Pos[] = [source]
  while (queue.length > 0) {
    const pos = queue.shift()!
    const d = dist.get(pos.toString())!
    for (const move of MOVES) {
      const next = pos.sum(move.delta)
      const key = next.toString()
      if (!open.has(key) || dist.has(key)) continue
      dist.set(key, d + 1)
      queue.push(next)
    }
  }
  return dist
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const program = Intcode.parse(input)

  const t0 = performance.now()

  const { open, oxygen } = explore(program)
  const fromStart = bfs(open, p(0, 0))
  const fromOxygen = bfs(open, oxygen)

  let part1 = fromStart.get(oxygen.toString())!
  let part2 = Math.max(...fromOxygen.values())

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
