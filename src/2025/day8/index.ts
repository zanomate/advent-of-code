import { readFile, readNumericParameter } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Pos3D = [number, number, number]

interface Distance {
  from: Point
  to: Point
  distance: number
}

interface Point {
  index: number
  pos: Pos3D
  distances: Distance[]
  circuit: number
}

type Circuit = number[]

const points: Point[] = []
const circuits: Circuit[] = []

function distance(a: Point, b: Point): number {
  return Math.sqrt(
    (a.pos[0] - b.pos[0]) ** 2 + (a.pos[1] - b.pos[1]) ** 2 + (a.pos[2] - b.pos[2]) ** 2,
  )
}

function findNearestPoints(): void {
  const n = points.length

  for (let i = 0; i < n; i++) {
    const current = points[i]
    const distanceList: Distance[] = []

    for (let j = 0; j < n; j++) {
      if (i === j) continue

      const other = points[j]
      const dist = distance(current, other)

      distanceList.push({
        from: current,
        to: other,
        distance: dist,
      })
    }

    distanceList.sort((a, b) => a.distance - b.distance)
    current.distances = distanceList
  }
}

function findShortestConnection(): Distance {
  let shortest: Distance | null = null
  for (let i = 0; i < points.length; i++) {
    if (points[i].distances.length) {
      const candidate = points[i].distances[0]
      if (shortest === null || candidate.distance < shortest.distance) {
        shortest = candidate
      }
    }
  }
  shortest!.from.distances.shift()
  const indexToRemove = shortest!.to.distances.findIndex((d) => d.to.index === shortest!.from.index)
  shortest!.to.distances.splice(indexToRemove, 1)
  return shortest!
}

function connectPoints(a: Point, b: Point): void {
  if (a.circuit === -1 && b.circuit === -1) {
    const circuitIndex = circuits.length
    a.circuit = circuitIndex
    b.circuit = circuitIndex
    circuits.push([a.index, b.index])
  } else if (a.circuit !== -1 && b.circuit === -1) {
    b.circuit = a.circuit
    circuits[a.circuit].push(b.index)
  } else if (a.circuit === -1 && b.circuit !== -1) {
    a.circuit = b.circuit
    circuits[b.circuit].push(a.index)
  } else if (a.circuit !== b.circuit) {
    const oldCircuit = b.circuit
    circuits[a.circuit].push(...circuits[oldCircuit])
    circuits[oldCircuit].forEach((pointIndex) => {
      points[pointIndex].circuit = a.circuit
    })
    circuits[oldCircuit] = []
  }
}

function resolvePart1(connectionsCount: number) {
  for (let i = 0; i < connectionsCount; i++) {
    const { from, to } = findShortestConnection()
    connectPoints(from, to)
  }
  const [c1, c2, c3] = circuits.toSorted((a, b) => b.length - a.length)
  return c1.length * c2.length * c3.length
}

function resolvePart2() {
  let lastConnection: { from: Point; to: Point } | null = null
  while (!circuits.some((c) => c.length === points.length)) {
    const { from, to } = findShortestConnection()
    lastConnection = { from, to }
    connectPoints(from, to)
  }
  return lastConnection!.from.pos[0] * lastConnection!.to.pos[0]
}

export default async function (inputFile: string, parameters: string[]): Promise<DaySolution> {
  const connectionsCount = readNumericParameter('connectionsCount', parameters[0])

  const input = await readFile(inputFile)
  points.push(
    ...input.split('\n').map((line, index) => {
      const pos = line.split(',').map(Number) as Pos3D
      return {
        index,
        pos,
        distances: [],
        circuit: -1,
      }
    }),
  )

  const t0 = performance.now()

  findNearestPoints()
  let part1 = resolvePart1(connectionsCount)
  let part2 = resolvePart2()

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
