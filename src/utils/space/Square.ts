import { Grid } from './Grid'
import { p, Pos } from './Pos'

export class Square<T> extends Grid<T> {
  size: number

  constructor(size: number, valueOrFactory: T | ((pos: Pos) => T)) {
    super(size, size, valueOrFactory)
    this.size = size
  }

  static fromValues<T>(values: T[][]): Square<T> {
    const width = values.length ? values[0].length : 0
    const height = values.length
    if (width !== height) throw new Error('width and height must be the same')
    return new Square<T>(width, (p) => values[p.y][p.x])
  }

  rotate() {
    // NOTE: rotation is counter-clockwise
    const rotated = new Square(this.size, null as unknown as T)

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        rotated.setCell(p(j, this.size - 1 - i), this.getCell(p(i, j))!)
      }
    }

    return rotated
  }

  flipX() {
    const rotated = new Square(this.size, null as unknown as T)

    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size; i++) {
        rotated.setCell(p(this.size - 1 - i, j), this.getCell(p(i, j))!)
      }
    }

    return rotated
  }

  split(unitSize: number): Square<T>[][] {
    const rows = this.size / unitSize
    if (rows % 1) throw new Error('invalid unit size')
    const res: Square<T>[][] = []
    for (let y = 0; y < rows; y++) {
      const row: Square<T>[] = []
      for (let x = 0; x < rows; x++) {
        const topLeft = p(x * unitSize, y * unitSize)
        const bottomRight = topLeft.sum(p(unitSize, unitSize))
        const portion = this.getPortion(topLeft, bottomRight)
        row.push(Square.fromValues(portion))
      }
      res.push(row)
    }
    return res
  }

  static compose<T>(squares: Square<T>[][]): Square<T> {
    const rows = squares.length
    if (rows === 0) throw new Error('0 rows')
    const cols = squares[0].length
    if (squares[0].length === 0) throw new Error('0 cols')
    const unitSize = squares[0][0].size
    if (rows !== cols) throw new Error('rows and cols must be the same')

    const res = new Square<T>(rows * unitSize, null as unknown as T)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const unit = squares[y][x]
        res.setPortion(
          p(x * unitSize, y * unitSize),
          p((x + 1) * unitSize, (y + 1) * unitSize),
          (p) => unit.getCell(p)!,
        )
      }
    }
    return res
  }
}
