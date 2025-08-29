import { readFile } from '../../utils/io'
import { Dir, XY_DIRECTIONS } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export enum SideType {
  UNKNOWN = '?',
  FENCE = '#',
  EMPTY = '.',
}

export interface Cell {
  readonly pos: Pos
  readonly plant: string
  visited: boolean
  sides: Record<Dir, SideType>
  countedAsSide: boolean
}

export class Field {
  readonly grid: Grid<Cell>

  constructor(cells: string[][]) {
    this.grid = Grid.factory<Cell>(cells.length, cells[0].length, (pos) => ({
      pos,
      plant: cells[pos.y][pos.x],
      sides: {
        [Dir.UP]: SideType.UNKNOWN,
        [Dir.DOWN]: SideType.UNKNOWN,
        [Dir.LEFT]: SideType.UNKNOWN,
        [Dir.RIGHT]: SideType.UNKNOWN,
      },
      visited: false,
      countedAsSide: false,
    }))
  }

  isCellVisited(pos: Pos): boolean {
    return this.grid.hasCell(pos) && this.grid.getCell(pos)!.visited
  }

  visitCell(pos: Pos): void {
    if (this.grid.hasCell(pos)) this.grid.getCell(pos)!.visited = true
  }

  unvisit(): void {
    this.grid.values.forEach((cell) => {
      cell.visited = false
    })
  }

  isSideAlreadyCounted(pos: Pos, fenceDirection: Dir): boolean {
    const plant = this.grid.getCell(pos)!.plant
    const adjacentDirections: Dir[] = [Dir.UP, Dir.DOWN].includes(fenceDirection)
      ? [Dir.LEFT, Dir.RIGHT]
      : [Dir.UP, Dir.DOWN]

    return adjacentDirections.some((direction) => {
      const cellsInDirection: Cell[] = []
      let nextPos = pos.shift(direction)
      while (this.grid.hasCell(nextPos)) {
        const cell = this.grid.getCell(nextPos)!
        if (cell.plant !== plant) break
        if (cell.sides[fenceDirection] !== SideType.FENCE) break
        cellsInDirection.push(cell)
        nextPos = nextPos.shift(direction)
      }
      return cellsInDirection.some((cell) => cell.countedAsSide)
    })
  }

  getRegion(pos: Pos): Cell[] {
    if (!this.grid.hasCell(pos)) throw new Error('Invalid position')
    if (this.isCellVisited(pos)) return []
    this.visitCell(pos)
    const cell = this.grid.getCell(pos)!
    const directionsToVisit = XY_DIRECTIONS.filter((direction) => {
      const neighborPos = cell.pos.shift(direction)
      const neighborCell = this.grid.getCell(neighborPos)!
      if (neighborCell === null || neighborCell.plant !== cell.plant) {
        cell.sides[direction] = SideType.FENCE
        return false
      }
      cell.sides[direction] = SideType.EMPTY
      return !neighborCell.visited
    })
    return [
      cell,
      ...directionsToVisit.flatMap((direction) => this.getRegion(cell.pos.shift(direction))),
    ]
  }

  getSides(pos: Pos): number {
    if (!this.grid.hasCell(pos)) throw new Error('Invalid position')
    if (this.isCellVisited(pos)) return 0
    this.visitCell(pos)
    const cell = this.grid.getCell(pos)!
    let res = 0
    XY_DIRECTIONS.filter((dir) => cell.sides[dir] === SideType.FENCE).forEach((direction) => {
      if (!this.isSideAlreadyCounted(pos, direction)) {
        cell.countedAsSide = true
        res++
      }
    })
    XY_DIRECTIONS.filter((dir) => cell.sides[dir] === SideType.EMPTY).forEach((direction) => {
      res += this.getSides(cell.pos.shift(direction))
    })

    return res
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const cells: string[][] = input.split('\n').map((row) => row.split(''))
  const field = new Field(cells)

  const t0 = performance.now()

  let regions: Cell[][] = []
  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[y].length; x++) {
      const pos = new Pos(x, y)
      if (!field.isCellVisited(pos)) {
        regions.push(field.getRegion(pos))
      }
    }
  }
  field.unvisit()
  let part1 = 0
  let part2 = 0
  regions.forEach((region) => {
    const firstCell = region[0]
    const area = region.length
    const perimeter = region.reduce((tot, cell) => {
      const sides = Object.keys(cell.sides).filter(
        (d) => cell.sides[d as Dir] === SideType.FENCE,
      ).length
      return tot + sides
    }, 0)
    const sides = field.getSides(firstCell.pos)
    part1 += area * perimeter
    part2 += area * sides
  })

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
