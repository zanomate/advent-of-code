import { readFile } from '../../utils/io'
import { CARDINAL_DIRECTIONS } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'

enum Cell {
  EMPTY = '.',
  WALL = '#',
  START = 'S',
  END = 'E',
}

const WIDTH = 71
const HEIGHT = 71

export default async function () {
  const input = await readFile('./src/2024/day18/input.txt').then((text) => text.trim())
  const obstacles = input.split('\n').map((row) => {
    const [x, y] = row.split(',').map((str) => parseInt(str))
    return new Pos(x, y)
  })

  const t0 = performance.now()

  const getMinSteps = (startTime: number): number | null => {
    const currentObstacles = obstacles.slice(0, startTime)
    const grid = Grid.factory<Cell>(WIDTH, HEIGHT, (pos) => {
      if (currentObstacles.some((o) => o.equals(pos))) return Cell.WALL
      return Cell.EMPTY
    })

    const start = new Pos(0, 0)
    const end = new Pos(WIDTH - 1, HEIGHT - 1)
    const queue: Pos[][] = [[start]]
    const visited = new Set<string>()
    while (queue.length) {
      const path = queue.shift() as Pos[]
      const lastPos = path[path.length - 1]

      if (visited.has(lastPos.toString())) continue
      visited.add(lastPos.toString())

      if (lastPos.equals(end)) return path.length - 1

      CARDINAL_DIRECTIONS.forEach((dir) => {
        const nextPos = lastPos.shift(dir, 1)
        if (grid.hasCell(nextPos) && grid.getCell(nextPos) !== Cell.WALL) {
          queue.push([...path, nextPos])
        }
      })
    }

    return null
  }

  const part1 = getMinSteps(1024)

  let t = 1025
  let minSteps
  while ((minSteps = getMinSteps(t)) !== null) t++
  const part2 = obstacles[t - 1].toString()

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
