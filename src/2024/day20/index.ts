import { readFile } from '../../utils/io'
import { CARDINAL_DIRECTIONS } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

enum Cell {
  EMPTY = '.',
  WALL = '#',
  START = 'S',
  END = 'E',
}

const getAllCheatShifts = (maxPicoseconds: number): [number, number][] => {
  const res: [number, number][] = []
  for (let dx = -maxPicoseconds; dx <= maxPicoseconds; dx++) {
    for (let dy = -maxPicoseconds; dy <= maxPicoseconds; dy++) {
      const picoseconds = Math.abs(dx) + Math.abs(dy)
      if (picoseconds > 1 && picoseconds <= maxPicoseconds) {
        res.push([dx, dy])
      }
    }
  }
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const cells = input.split('\n').map((line) => line.split('')) as Cell[][]

  const t0 = performance.now()

  let height = cells.length
  let width = cells[0].length
  let end: Pos

  // create grid
  const grid = Grid.factory<Cell>(width, height, (pos) => {
    const cell = cells[pos.y][pos.x]
    switch (cell) {
      case Cell.START:
        return Cell.EMPTY
      case Cell.END:
        end = pos
        return Cell.EMPTY
      default:
        return cell
    }
  })

  // compute for each cell, times needed to reach the end position
  const visited = new Set<string>()
  const seconds = new Map<string, number>()
  seconds.set(end!.toString(), 0)
  const queue: [Pos, number][] = [[end!, 0]]
  while (queue.length) {
    const [pos, time] = queue.shift()!
    if (visited.has(pos.toString())) continue
    visited.add(pos.toString())
    seconds.set(pos.toString(), time)

    for (const dir of CARDINAL_DIRECTIONS) {
      const newPos = pos.shift(dir, 1)
      if (grid.hasCell(newPos) && grid.getCell(newPos) !== Cell.WALL) {
        queue.push([newPos, time + 1])
      }
    }
  }

  const countCheats = (maxPicoseconds: number, minPicosecondsSave: number): number => {
    const cheatShifts = getAllCheatShifts(maxPicoseconds)

    let res = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pos = new Pos(x, y)
        if (grid.getCell(pos) === Cell.EMPTY) {
          const time = seconds.get(pos.toString())!
          cheatShifts.forEach(([dx, dy]) => {
            const cheatDuration = Math.abs(dx) + Math.abs(dy)
            const newPos = new Pos(x + dx, y + dy)
            if (grid.hasCell(newPos) && grid.getCell(newPos) === Cell.EMPTY) {
              const newTime = seconds.get(newPos.toString())!
              if (time - newTime - cheatDuration >= minPicosecondsSave) {
                res++
              }
            }
          })
        }
      }
    }

    return res
  }

  const part1 = countCheats(2, 100)
  const part2 = countCheats(20, 100)
  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
