import { readFile } from '../../utils/io'
import { DiagonalDir } from '../../utils/space/DiagonalDir'
import { ALL_DIRECTIONS, Dir } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'

const MAS_COMBINATIONS = ['MSSM', 'SSMM', 'SMMS', 'MMSS']

export class Field {
  readonly grid: Grid<string>

  constructor(cells: string[][]) {
    this.grid = Grid.fromValues(cells)
  }

  isXMAS1(pos: Pos, dir: Dir | DiagonalDir): boolean {
    return ['X', 'M', 'A', 'S'].every((char, index) => {
      const ithPos = pos.shift8Dir(dir, index)
      return char === this.grid.getCell(ithPos)
    })
  }

  isXMAS2(pos: Pos): boolean {
    if (this.grid.getCell(pos) !== 'A') return false

    const borderPosList = [
      pos.shiftDiagonal(DiagonalDir.UP_RIGHT, 1),
      pos.shiftDiagonal(DiagonalDir.DOWN_RIGHT, 1),
      pos.shiftDiagonal(DiagonalDir.DOWN_LEFT, 1),
      pos.shiftDiagonal(DiagonalDir.UP_LEFT, 1),
    ]
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

export default async function () {
  const input = await readFile('./src/2024/day4/input.txt').then((text) => text.trim())
  const cells = input.split('\n').map((row) => row.split(''))

  const t0 = performance.now()

  const field = new Field(cells)
  const part1 = field.countXMAS1()
  const part2 = field.countXMAS2()

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
