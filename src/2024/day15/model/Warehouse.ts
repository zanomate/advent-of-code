import { Dir } from '../../../utils/space/Dir'
import { Grid } from '../../../utils/space/Grid'
import { Pos } from '../../../utils/space/Pos'
import { Box } from './Box'
import { Robot } from './Robot'

export enum InputCell {
  EMPTY = '.',
  WALL = '#',
  ROBOT = '@',
  BOX = 'O',
}

export enum Cell {
  EMPTY = '.',
  WALL = '#',
  ROBOT = '@',
  BOX_HEAD = '[',
  BOX_TAIL = 'O',
}

export class Warehouse {
  grid: Grid<Cell>
  wideFactor: number
  robot: Robot
  boxes: Map<string, Box> = new Map<string, Box>()

  constructor(cells: InputCell[][], wideFactor: number) {
    this.wideFactor = wideFactor
    let robot = new Robot(new Pos(0, 0))
    const h = cells.length
    const w = cells[0].length * wideFactor
    this.grid = Grid.factory(w, h, (pos) => {
      const dx = pos.x % wideFactor
      const x = Math.floor(pos.x / wideFactor)
      const cell = cells[pos.y][x]
      switch (cell) {
        case InputCell.EMPTY:
          return Cell.EMPTY
        case InputCell.WALL:
          return Cell.WALL
        case InputCell.BOX:
          if (dx === 0) {
            const box = new Box(pos, wideFactor)
            this.boxes.set(box.toString(), box)
            return Cell.BOX_HEAD
          }
          return Cell.BOX_TAIL
        case InputCell.ROBOT:
          if (dx === 0) {
            robot = new Robot(pos)
            return Cell.ROBOT
          }
          return Cell.EMPTY
      }
    })
    this.robot = robot
  }

  getBoxKey(pos: Pos): string {
    if (![Cell.BOX_HEAD, Cell.BOX_TAIL].includes(this.grid.getCell(pos)!))
      throw new Error('Not a box')
    let cursor: Pos = pos
    let res: Cell
    while ((res = this.grid.getCell(cursor)!) !== Cell.BOX_HEAD) cursor = cursor.shift(Dir.LEFT)
    return cursor.toString()
  }

  moveCell(pos: Pos, dir: Dir) {
    const dest = pos.shift(dir)
    if (this.grid.getCell(dest) !== Cell.EMPTY)
      throw new Error(`Cannot move to ${pos.toString()} (non-empty)`)
    this.grid.setCell(dest, this.grid.getCell(pos)!)
    this.grid.setCell(pos, Cell.EMPTY)
  }

  // movement check

  canMoveSomething(pos: Pos, dir: Dir): boolean {
    const destPos = pos.shift(dir)
    const destCell = this.grid.getCell(destPos)
    switch (destCell) {
      case Cell.EMPTY:
        return true
      case Cell.BOX_HEAD:
      case Cell.BOX_TAIL:
        const boxKey = this.getBoxKey(destPos)
        return this.canMoveBox(boxKey, dir)
      case Cell.ROBOT:
        throw new Error("It's supposed to not happen")
      default:
        return false
    }
  }

  canMoveRobot(dir: Dir): boolean {
    return this.canMoveSomething(this.robot.pos, dir)
  }

  canMoveBox(boxKey: string, dir: Dir): boolean {
    const box = this.boxes.get(boxKey)
    if (!box) throw new Error(`Box not found: ${boxKey}`)
    return box.frontPosList(dir).every((pos) => this.canMoveSomething(pos, dir))
  }

  // movement actions

  moveSomething(pos: Pos, dir: Dir) {
    const targetPos = pos.shift(dir)
    const targetCell = this.grid.getCell(targetPos)
    switch (targetCell) {
      case Cell.ROBOT:
      case Cell.WALL:
        throw new Error("It's supposed to not happen")
      case Cell.BOX_HEAD:
      case Cell.BOX_TAIL:
        const boxKey = this.getBoxKey(targetPos)
        this.moveBox(boxKey, dir)
        break
    }
  }

  moveBox(boxKey: string, dir: Dir) {
    const box = this.boxes.get(boxKey)
    if (!box) throw new Error(`Box not found: ${boxKey}`)
    const frontPos = box.frontPosList(dir)
    const backPos = box.backPosList(dir)
    frontPos.forEach((pos) => {
      this.moveSomething(pos, dir)
    })
    frontPos.forEach((pos) => this.moveCell(pos, dir))
    backPos.forEach((pos) => this.moveCell(pos, dir))
    box.move(dir)
    this.boxes.delete(boxKey)
    this.boxes.set(box.toString(), box)
  }

  moveRobot(dir: Dir) {
    if (this.canMoveRobot(dir)) {
      this.moveSomething(this.robot.pos, dir)
      this.moveCell(this.robot.pos, dir)
      this.robot.move(dir)
    }
  }

  // utils

  print() {
    console.clear()
    for (let y = 0; y < this.grid.height; y++) {
      let row = ''
      for (let x = 0; x < this.grid.width; x++) {
        row += this.grid.getCell(new Pos(x, y))
      }
      console.log(row)
    }
  }

  computeAllDistances(): number {
    let tot = 0
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.getCell(new Pos(x, y)) === Cell.BOX_HEAD) {
          tot += 100 * y + x
        }
      }
    }
    return tot
  }
}
