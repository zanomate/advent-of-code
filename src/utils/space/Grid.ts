import { isFunction } from 'lodash'
import { p, Pos } from './Pos'

/**
 * This is a 2D grid class.
 * Rows are indexed by y, starting from the top.
 * Columns are indexed by x, starting from the left.
 */
export class Grid<T> {
  width: number
  height: number
  cells: T[][]

  constructor(width: number, height: number, valueOrFactory: T | ((pos: Pos) => T)) {
    this.width = width
    this.height = height
    this.cells = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) =>
        isFunction(valueOrFactory) ? valueOrFactory(p(x, y)) : valueOrFactory,
      ),
    )
  }

  static fromValues<T>(values: T[][]): Grid<T> {
    const width = values.length ? values[0].length : 0
    const height = values.length
    return new Grid<T>(width, height, (p) => values[p.y][p.x])
  }

  hasCell(pos: Pos): boolean {
    return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height
  }

  getCell(pos: Pos): T | null {
    if (this.hasCell(pos)) return this.cells[pos.y][pos.x]
    return null
  }

  setCell(pos: Pos, valueOrUpdate: T | ((prev: T) => T)): void {
    if (isFunction(valueOrUpdate)) {
      this.cells[pos.y][pos.x] = valueOrUpdate(this.cells[pos.y][pos.x])
    } else {
      this.cells[pos.y][pos.x] = valueOrUpdate as T
    }
  }

  getRow(y: number): T[] {
    if (y < 0 || y >= this.height) throw new Error('invalid row')
    return this.cells[y]
  }

  getCol(x: number): T[] {
    if (x < 0 || x >= this.width) throw new Error('invalid column')
    return this.cells.map((row) => row[x])
  }

  getPortion(topLeft: Pos, bottomRight: Pos): T[][] {
    const diff = bottomRight.diff(topLeft)
    if (
      topLeft.x < 0 ||
      topLeft.y < 0 ||
      bottomRight.x > this.width ||
      bottomRight.y > this.height ||
      diff.x <= 0 ||
      diff.y <= 0
    )
      throw new Error('invalid portion')

    const portion: T[][] = []
    for (let y = topLeft.y; y < bottomRight.y; y++) {
      const row = []
      for (let x = topLeft.x; x < bottomRight.x; x++) {
        row.push(this.cells[y][x])
      }
      portion.push(row)
    }
    return portion
  }

  setPortion(
    topLeft: Pos,
    bottomRight: Pos,
    valueOrUpdate: T | ((relativePos: Pos, prev: T) => T),
  ): void {
    const diff = bottomRight.diff(topLeft)
    if (
      topLeft.x < 0 ||
      topLeft.y < 0 ||
      bottomRight.x > this.width ||
      bottomRight.y > this.height ||
      diff.x <= 0 ||
      diff.y <= 0
    )
      throw new Error('invalid portion')

    for (let y = topLeft.y; y < bottomRight.y; y++) {
      for (let x = topLeft.x; x < bottomRight.x; x++) {
        const pos = p(x, y)
        this.setCell(pos, (prev) =>
          isFunction(valueOrUpdate) ? valueOrUpdate(pos.diff(topLeft), prev) : valueOrUpdate,
        )
      }
    }
  }

  setRow(row: number, valueOrUpdate: T | ((index: number, prev: T) => T)) {
    for (let x = 0; x < this.width; x++) {
      const pos = p(x, row)
      this.setCell(
        pos,
        isFunction(valueOrUpdate) ? valueOrUpdate(x, this.getCell(pos)!) : valueOrUpdate,
      )
    }
  }

  setCol(col: number, valueOrUpdate: T | ((index: number, prev: T) => T)) {
    for (let y = 0; y < this.height; y++) {
      const pos = p(col, y)
      this.setCell(
        pos,
        isFunction(valueOrUpdate) ? valueOrUpdate(y, this.getCell(pos)!) : valueOrUpdate,
      )
    }
  }

  findPos(predicate: (cell: T) => boolean): Pos | null {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pos = p(x, y)
        if (predicate(this.getCell(pos)!)) return pos
      }
    }
    return null
  }

  get positions(): Pos[] {
    let res: Pos[] = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        res.push(p(x, y))
      }
    }
    return res
  }

  get values(): T[] {
    return this.cells.flat()
  }

  print(format: (cell: T) => string = (cell) => cell as string): void {
    this.cells.forEach((row) => {
      console.log(row.map((cell) => format(cell)).join(''))
    })
  }

  clone(): Grid<T> {
    return Grid.fromValues(this.cells)
  }
}
