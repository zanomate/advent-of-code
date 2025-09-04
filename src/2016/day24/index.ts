import { readFile } from '../../utils/io'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

type CellType = '#' | '.' | string

interface Cell {
  type: CellType
  distance: number | null
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const cells: CellType[][] = lines.map((line) => line.split(''))

  const grid = new Grid(cells[0].length, cells.length, (pos) => {
    return {
      type: cells[pos.y][pos.x],
      distance: null,
    } as Cell
  })

  const nodes: Pos[] = []
  let i = 0
  let pos
  while ((pos = grid.findPos((cell) => cell.type === String(i))) !== null) {
    nodes.push(pos)
    i++
  }

  const t0 = performance.now()

  const distances: { [from: number]: { [to: number]: number } } = {}
  nodes.forEach((start, from) => {
    distances[from] = {}
    const g = grid.clone()
    g.getCell(start)!.distance = 0

    const queue: Pos[] = [start]
    while (queue.length) {
      const pos = queue.shift()!
      const cell = g.getCell(pos)!

      pos
        .neighbours()
        .filter((p) => p.isInBounds(0, 0, g.width, g.height))
        .forEach((neighbour) => {
          const neighborCell = g.getCell(neighbour)!
          const neighborDistance = cell.distance! + 1
          if (neighborCell.type === '#') return
          if (neighborCell.distance === null || neighborCell.distance > neighborDistance) {
            neighborCell.distance = neighborDistance
            if (neighborCell.type !== '.') {
              const to = parseInt(neighborCell.type)
              distances[from][to] = neighborDistance
            }
            queue.push(neighbour)
          }
        })
    }
  })

  const findShortestPath = (start: number, ...rest: number[]): number => {
    if (rest.length === 0) return 0
    return Math.min(
      ...rest.map(
        (next, i) => distances[start][next] + findShortestPath(next, ...rest.toSpliced(i, 1)),
      ),
    )
  }

  const [start, ...rest] = nodes.map((_, i) => i)

  const part1 = findShortestPath(start, ...rest)

  const findShortestPath2 = (start: number, middle: number[], end: number): number => {
    if (middle.length === 0) return distances[start][end]
    return Math.min(
      ...middle.map(
        (next, i) => distances[start][next] + findShortestPath2(next, middle.toSpliced(i, 1), end),
      ),
    )
  }

  const part2 = findShortestPath2(start, rest, start)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
