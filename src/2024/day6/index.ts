import { cloneDeep } from 'lodash'
import { readFile } from '../../utils/io'
import { Dir, turnRight } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export enum Cell {
  EMPTY = '.',
  OBSTACLE = '#',
}

export class Field {
  readonly grid: Grid<Cell | Dir>
  guardPos: Pos | null = null
  guardDir = Dir.UP

  constructor(cells: (Cell | Dir)[][]) {
    const w = cells[0].length
    const h = cells.length
    this.grid = Grid.factory(w, h, (pos) => {
      const cell = cells[pos.y][pos.x]
      if (cell === Dir.UP) {
        this.guardPos = pos
      }
      return cell
    })
  }

  async moveGuard() {
    const currentPos = this.guardPos
    if (currentPos === null) throw new Error('Guard is not in the field')

    const nextPos = currentPos.shift(this.guardDir)
    // if it reached an edge of the field
    if (nextPos === null || this.grid.getCell(nextPos) === null) {
      this.guardPos = null
      return
    }
    const nextCell = this.grid.getCell(nextPos)
    // if it reached an already-visited cell
    if (nextCell === Dir.UP || nextCell === Dir.DOWN || nextCell === Dir.LEFT || nextCell === Dir.RIGHT) {
      if (nextCell === this.guardDir) throw new Error('Loop')
      this.grid.setCell(nextPos, this.guardDir)
      this.guardPos = nextPos
      return
    }
    if (nextCell === Cell.OBSTACLE) {
      this.guardDir = turnRight(this.guardDir)
      return
    }
    if (nextCell === Cell.EMPTY) {
      this.grid.setCell(nextPos, this.guardDir)
      this.guardPos = nextPos
      return
    }
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const cells: (Cell | Dir)[][] = input.split('\n').map((row) => row.split('')) as (Cell | Dir)[][]

  const t0 = performance.now()

  let visited = new Set<string>()
  let obstructions = new Set<string>()
  const field = new Field(cells)
  while (field.guardPos !== null) {
    visited.add(field.guardPos.toString())
    const nextPos = field.guardPos.shift(field.guardDir)
    const nextCell = field.grid.getCell(nextPos)
    if (nextCell !== null && !obstructions.has(nextPos.toString())) {
      // try adding obstacle to next position
      const paradoxCells: (Cell | Dir)[][] = cloneDeep(cells)
      paradoxCells[nextPos.y][nextPos.x] = Cell.OBSTACLE
      const paradox = new Field(paradoxCells)
      try {
        while (paradox.guardPos !== null) {
          await paradox.moveGuard()
        }
      } catch (e) {
        obstructions.add(nextPos.toString())
      }
    }

    await field.moveGuard()
  }

  const part1 = visited.size
  const part2 = obstructions.size

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
