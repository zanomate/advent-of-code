import { readFile } from '../../utils/io'
import { parseDirFromChar } from '../../utils/space/Dir'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

/** Map from "x,y" to the number of steps to first reach that point. */
function trace(path: string): Map<string, number> {
  const visited = new Map<string, number>()
  let pos = p(0, 0)
  let steps = 0
  for (const segment of path.split(',')) {
    const dir = parseDirFromChar(segment[0])
    const length = Number(segment.slice(1))
    for (let i = 0; i < length; i++) {
      pos = pos.shift(dir)
      steps++
      const key = pos.toString()
      if (!visited.has(key)) visited.set(key, steps)
    }
  }
  return visited
}

function intersections(a: Map<string, number>, b: Map<string, number>): string[] {
  return [...a.keys()].filter((key) => b.has(key))
}

function resolvePart1(a: Map<string, number>, b: Map<string, number>) {
  return Math.min(
    ...intersections(a, b).map((key) => Pos.fromString(key).manhattanDistance(p(0, 0))),
  )
}

function resolvePart2(a: Map<string, number>, b: Map<string, number>) {
  return Math.min(...intersections(a, b).map((key) => a.get(key)! + b.get(key)!))
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const [first, second] = input.trim().split('\n')
  const a = trace(first)
  const b = trace(second)

  const t0 = performance.now()

  let part1 = resolvePart1(a, b)
  let part2 = resolvePart2(a, b)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
