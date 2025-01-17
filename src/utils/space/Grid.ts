import { Pos } from './Pos'

/**
 * This is a 2D grid class.
 * Rows are indexed by y, starting from the top.
 * Columns are indexed by x, starting from the left.
 */
export class Grid<T> {
  width: number
  height: number
  protected cells: T[][]

  constructor(width: number, height: number, defaultValue: T) {
    this.width = width
    this.height = height
    this.cells = Array.from({ length: height }, () => Array.from({ length: width }, () => defaultValue))
  }

  static fromValues<T>(values: T[][]): Grid<T> {
    const width = values[0].length
    const height = values.length
    // @ts-ignore
    const grid = new Grid<T>(width, height, null)
    values.forEach((row, y) => {
      row.forEach((value, x) => {
        const pos = new Pos(x, y)
        grid.setCell(pos, value)
      })
    })
    return grid
  }

  static factory<T>(width: number, height: number, f: (pos: Pos) => T): Grid<T> {
    // @ts-ignore
    const grid = new Grid<T>(width, height, null)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pos = new Pos(x, y)
        grid.setCell(pos, f(pos))
      }
    }
    return grid
  }

  hasCell(pos: Pos): boolean {
    return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height
  }

  getCell(pos: Pos): T | null {
    if (this.hasCell(pos)) return this.cells[pos.y][pos.x]
    return null
  }

  setCell(pos: Pos, value: T): void {
    this.cells[pos.y][pos.x] = value
  }

  updateCell(pos: Pos, updater: (prev: T) => T): void {
    this.cells[pos.y][pos.x] = updater(this.cells[pos.y][pos.x])
  }

  get positions(): Pos[] {
    let res: Pos[] = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        res.push(new Pos(x, y))
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
}
