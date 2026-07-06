import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

const MOVES: Record<string, [number, number]> = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
}

const key = (x: number, y: number): string => `${x},${y}`

// Walk the route regex, recording the shortest door-distance to every room.
function distances(route: string): Map<string, number> {
  const dist = new Map<string, number>([[key(0, 0), 0]])
  const stack: [number, number][] = []
  let x = 0
  let y = 0

  for (const char of route) {
    if (char === '(') {
      stack.push([x, y])
    } else if (char === '|') {
      ;[x, y] = stack[stack.length - 1]
    } else if (char === ')') {
      ;[x, y] = stack.pop()!
    } else if (MOVES[char]) {
      const [dx, dy] = MOVES[char]
      const from = dist.get(key(x, y))!
      x += dx
      y += dy
      const k = key(x, y)
      dist.set(k, Math.min(dist.get(k) ?? Infinity, from + 1))
    }
  }

  return dist
}

function resolvePart1(dist: Map<string, number>): PartSolution {
  return Math.max(...dist.values())
}

function resolvePart2(dist: Map<string, number>): PartSolution {
  return [...dist.values()].filter((d) => d >= 1000).length
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) =>
    text.replace(/\r\n/g, '\n').trim().replace(/^\^/, '').replace(/\$$/, ''),
  )
  const dist = distances(input)

  const t0 = performance.now()

  const part1 = resolvePart1(dist)
  const part2 = resolvePart2(dist)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
