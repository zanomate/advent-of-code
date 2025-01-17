import { isInEnum } from '../type'
import { DiagonalDir } from './DiagonalDir'
import { Dir } from './Dir'

export class Pos {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  equals(other: Pos): boolean {
    return this.x === other.x && this.y === other.y
  }

  shift(dir: Dir, steps: number): Pos {
    switch (dir) {
      case Dir.UP:
        return new Pos(this.x, this.y + steps)
      case Dir.RIGHT:
        return new Pos(this.x + steps, this.y)
      case Dir.DOWN:
        return new Pos(this.x, this.y - steps)
      case Dir.LEFT:
        return new Pos(this.x - steps, this.y)
    }
  }

  shiftVFlipped(dir: Dir, steps: number): Pos {
    switch (dir) {
      case Dir.UP:
        return new Pos(this.x, this.y - steps)
      case Dir.RIGHT:
        return new Pos(this.x + steps, this.y)
      case Dir.DOWN:
        return new Pos(this.x, this.y + steps)
      case Dir.LEFT:
        return new Pos(this.x - steps, this.y)
    }
  }

  shiftDiagonal(dir: DiagonalDir, steps: number): Pos {
    switch (dir) {
      case DiagonalDir.UP_RIGHT:
        return new Pos(this.x + steps, this.y - steps)
      case DiagonalDir.DOWN_RIGHT:
        return new Pos(this.x + steps, this.y + steps)
      case DiagonalDir.DOWN_LEFT:
        return new Pos(this.x - steps, this.y + steps)
      case DiagonalDir.UP_LEFT:
        return new Pos(this.x - steps, this.y - steps)
    }
  }

  shift8Dir(dir: Dir | DiagonalDir, steps: number): Pos {
    return isInEnum(dir, Dir) ? this.shift(dir as Dir, steps) : this.shiftDiagonal(dir as DiagonalDir, steps)
  }

  allPosToShift(dir: Dir, steps: number): Pos[] {
    const result: Pos[] = []
    for (let i = 1; i <= steps; i++) {
      result.push(this.shift(dir, i))
    }
    return result
  }

  taxicabDistance(other: Pos): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  get neighbours(): Pos[] {
    return [this.shift(Dir.UP, 1), this.shift(Dir.RIGHT, 1), this.shift(Dir.DOWN, 1), this.shift(Dir.LEFT, 1)]
  }

  toString(): string {
    return `${this.x},${this.y}`
  }
}
