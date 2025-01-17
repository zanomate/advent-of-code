import { readFile } from '../../utils/io'
import { ALL_DIRECTIONS, DiagDir, Dir } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

const MAS_COMBINATIONS = ['MSSM', 'SSMM', 'SMMS', 'MMSS']

export class Field {
  readonly grid: Grid<string>

  constructor(cells: string[][]) {
    this.grid = Grid.fromValues(cells)
  }

  isXMAS1(pos: Pos, dir: Dir | DiagDir): boolean {
    return ['X', 'M', 'A', 'S'].every((char, index) => {
      const ithPos = pos.shift(dir, index)
      return char === this.grid.getCell(ithPos)
    })
  }

  isXMAS2(pos: Pos): boolean {
    if (this.grid.getCell(pos) !== 'A') return false

    const borderPosList = pos.neighbours('x')
    const border = borderPosList.map((borderPos) => this.grid.getCell(borderPos)).join('')

    return MAS_COMBINATIONS.includes(border)
  }

  countXMAS1(): number {
    let count = 0
    this.grid.positions.forEach((pos) => {
      ALL_DIRECTIONS.forEach((dir) => {
        if (this.isXMAS1(pos, dir)) count++
      })
    })
    return count
  }

  countXMAS2(): number {
    let count = 0
    this.grid.positions.forEach((pos) => {
      if (this.isXMAS2(pos)) count++
    })
    return count
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const cells = input.split('\n').map((row) => row.split(''))

  const t0 = performance.now()

  const field = new Field(cells)
  const part1 = field.countXMAS1()
  const part2 = field.countXMAS2()

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
