import { readFile } from '../../utils/io'
import { getCombinations } from '../../utils/math'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export enum Cell {
  EMPTY = '.',
  ANTINODE = '#',
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const cells = input.split('\n').map((line) => line.split('')) as Cell[][]

  const t0 = performance.now()

  const grid = Grid.fromValues<Cell>(cells)

  const antennas: Map<string, Pos[]> = new Map<string, Pos[]>()
  grid.positions.forEach((pos) => {
    const cell = grid.getCell(pos)!
    if (cell !== Cell.EMPTY) {
      if (!antennas.has(cell)) antennas.set(cell, [])
      antennas.get(cell)!.push(pos)
    }
  })

  const antinodes1 = new Set<string>()
  const antinodes2 = new Set<string>()
  antennas.forEach((positions) => {
    const couples = getCombinations(2, positions)
    couples.forEach(([a, b]) => {
      const dx = b.x - a.x
      const dy = b.y - a.y

      let i = 0
      let pos: Pos
      while (grid.hasCell((pos = new Pos(b.x + i * dx, b.y + i * dy)))) {
        if (i === 1) antinodes1.add(pos.toString())
        antinodes2.add(pos.toString())
        i++
      }

      i = 0
      while (grid.hasCell((pos = new Pos(a.x - i * dx, a.y - i * dy)))) {
        if (i === 1) antinodes1.add(pos.toString())
        antinodes2.add(pos.toString())
        i++
      }
    })
  })

  const part1 = antinodes1.size
  const part2 = antinodes2.size

  antinodes1.forEach((an) => {
    const [x, y] = an.split(',').map((str) => parseInt(str))
    grid.setCell(new Pos(x, y), Cell.ANTINODE)
  })

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
