import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

type Point = [number, number, number, number]

function parse(input: string): Point[] {
  return input.split('\n').map((line) => line.match(/-?\d+/g)!.map(Number) as Point)
}

const manhattan = (a: Point, b: Point): number =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3])

// Two points join the same constellation when within distance 3. Union-find
// merges every close pair; the answer is the number of distinct roots.
function resolvePart1(points: Point[]): number {
  const parent = points.map((_, i) => i)
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]
      i = parent[i]
    }
    return i
  }
  const union = (a: number, b: number) => {
    parent[find(a)] = find(b)
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (manhattan(points[i], points[j]) <= 3) union(i, j)
    }
  }

  return new Set(points.map((_, i) => find(i))).size
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())
  const points = parse(input)

  const t0 = performance.now()

  const part1: PartSolution = resolvePart1(points)
  const part2: PartSolution = null

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
