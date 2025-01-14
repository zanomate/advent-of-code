import { readFile } from '../../utils/io'
import { Dir } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'

export class Field {
  readonly grid: Grid<number>

  constructor(cells: number[][]) {
    this.grid = Grid.fromValues(cells)
  }

  forEachCell(callback: (pos: Pos, value: number) => void): void {
    for (let pos of this.grid.positions) {
      callback(pos, this.grid.getCell(pos)!)
    }
  }

  getTrailheadEnds(pos: Pos): Pos[] {
    const currentValue = this.grid.getCell(pos)
    if (currentValue === null) return []
    if (currentValue === 9) return [pos]
    return [Dir.UP, Dir.RIGHT, Dir.DOWN, Dir.LEFT]
      .map((dir) => pos.shift(dir, 1))
      .filter((nextPos) => this.grid.getCell(nextPos) === currentValue + 1)
      .flatMap((nextPos) => this.getTrailheadEnds(nextPos))
  }
}

export default async function () {
  const input = await readFile('./src/2024/day10/input.txt').then((text) => text.trim())
  const cells: number[][] = input.split('\n').map((row) => row.split('').map((num) => parseInt(num)))
  const field = new Field(cells)

  const t0 = performance.now()

  let res1 = 0
  let res2 = 0
  field.forEachCell((pos, value) => {
    if (value === 0) {
      const trailEnds = field.getTrailheadEnds(pos)
      const uniqueTrailEnds = Array.from(new Set(trailEnds.map((pos) => pos.toString())))
      res1 += uniqueTrailEnds.length
      res2 += trailEnds.length
    }
  })

  const t1 = performance.now()

  console.log('Part 1:', res1)
  console.log('Part 2:', res2)
  console.log('Time (ms):', t1 - t0)
}