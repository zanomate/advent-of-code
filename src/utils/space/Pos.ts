import { DiagDir, Dir, DirSystem } from './Dir'

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

  get isPositive(): boolean {
    return this.x >= 0 && this.y >= 0
  }

  sum(otherPos: Pos): Pos {
    return p(this.x + otherPos.x, this.y + otherPos.y)
  }

  diff(otherPos: Pos): Pos {
    return p(this.x - otherPos.x, this.y - otherPos.y)
  }

  isInBounds(fromX: number, fromY: number, toX: number, toY: number): boolean {
    if (fromX >= toX || fromY >= toY) throw new Error('invalid bound')
    return this.x >= fromX && this.x < toX && this.y >= fromY && this.y < toY
  }

  shift(dir: Dir | DiagDir, distance: number = 1): Pos {
    switch (dir) {
      case Dir.UP:
        return p(this.x, this.y - distance)
      case Dir.RIGHT:
        return p(this.x + distance, this.y)
      case Dir.DOWN:
        return p(this.x, this.y + distance)
      case Dir.LEFT:
        return p(this.x - distance, this.y)
      case DiagDir.UP_RIGHT:
        return p(this.x + distance, this.y - distance)
      case DiagDir.DOWN_RIGHT:
        return p(this.x + distance, this.y + distance)
      case DiagDir.DOWN_LEFT:
        return p(this.x - distance, this.y + distance)
      case DiagDir.UP_LEFT:
        return p(this.x - distance, this.y - distance)
      default:
        throw new Error('Invalid direction')
    }
  }

  stepsToShift(dir: Dir, distance: number): Pos[] {
    const result: Pos[] = []
    for (let i = 1; i <= distance; i++) {
      result.push(this.shift(dir, i))
    }
    return result
  }

  manhattanDistance(other: Pos): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  neighbours(sys: DirSystem = '+', distance: number = 1): Pos[] {
    switch (sys) {
      case '+':
        return [
          this.shift(Dir.UP, distance),
          this.shift(Dir.RIGHT, distance),
          this.shift(Dir.DOWN, distance),
          this.shift(Dir.LEFT, distance),
        ]
      case 'x':
        return [
          this.shift(DiagDir.UP_RIGHT, distance),
          this.shift(DiagDir.DOWN_RIGHT, distance),
          this.shift(DiagDir.DOWN_LEFT, distance),
          this.shift(DiagDir.UP_LEFT, distance),
        ]
      case '8':
        return [
          this.shift(Dir.UP, distance),
          this.shift(DiagDir.UP_RIGHT, distance),
          this.shift(Dir.RIGHT, distance),
          this.shift(DiagDir.DOWN_RIGHT, distance),
          this.shift(Dir.DOWN, distance),
          this.shift(DiagDir.DOWN_LEFT, distance),
          this.shift(Dir.LEFT, distance),
          this.shift(DiagDir.UP_LEFT, distance),
        ]
      default:
        throw new Error('Invalid direction system')
    }
  }

  toString(): string {
    return `${this.x},${this.y}`
  }
}

export const p = (x: number, y: number) => new Pos(x, y)
