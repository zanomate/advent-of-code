import { isFunction } from 'lodash'
import { p, Pos } from './Pos'

/**
 * This is a 2D infinite grid class.
 * Coords of a cell are relative to origin.
 */
export class Space<Cell> {
  origin: Pos = p(0, 0)
  cells = new Map<string, Cell>()
  defaultValue: Cell

  constructor(defaultValue: Cell) {
    this.defaultValue = defaultValue
  }

  getCell(pos: Pos): Cell {
    if (this.cells.has(pos.toString())) return this.cells.get(pos.toString())!
    this.cells.set(pos.toString(), this.defaultValue)
    return this.defaultValue
  }

  setCell(pos: Pos, valueOrUpdate: Cell | ((prev: Cell) => Cell)): void {
    const prev = this.getCell(pos)
    if (isFunction(valueOrUpdate)) {
      this.cells.set(pos.toString(), valueOrUpdate(prev))
    } else {
      this.cells.set(pos.toString(), valueOrUpdate as Cell)
    }
  }

  findPos(predicate: (cell: Cell) => boolean): Pos | null {
    const keys = Array.from(this.cells.keys())
    const key = keys.find((k) => predicate(this.cells.get(k)!))
    if (!key) return null
    return Pos.fromString(key)
  }
}
