import { DIAG_DIRECTIONS, DiagDir, Dir, DirSystem, XY_DIRECTIONS } from './Dir'

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

  isInBounds(fromX: number, fromY: number, toX: number, toY: number): boolean {
    return this.x >= fromX && this.x < toX && this.y >= fromY && this.y < toY
  }

  shift(dir: Dir | DiagDir, distance: number = 1): Pos {
    switch (dir) {
      case Dir.UP:
        return new Pos(this.x, this.y - distance)
      case Dir.RIGHT:
        return new Pos(this.x + distance, this.y)
      case Dir.DOWN:
        return new Pos(this.x, this.y + distance)
      case Dir.LEFT:
        return new Pos(this.x - distance, this.y)
      case DiagDir.UP_RIGHT:
        return new Pos(this.x + distance, this.y - distance)
      case DiagDir.DOWN_RIGHT:
        return new Pos(this.x + distance, this.y + distance)
      case DiagDir.DOWN_LEFT:
        return new Pos(this.x - distance, this.y + distance)
      case DiagDir.UP_LEFT:
        return new Pos(this.x - distance, this.y - distance)
      default:
        throw new Error('Invalid direction')
    }
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

  neighbours(sys: DirSystem = '+', distance: number = 1): Pos[] {
    const res: Pos[] = []
    if (['+', '8'].includes(sys)) res.push(...XY_DIRECTIONS.map((dir) => this.shift(dir, distance)))
    if (['x', '8'].includes(sys)) res.push(...DIAG_DIRECTIONS.map((dir) => this.shift(dir, distance)))
    return res
  }

  toString(): string {
    return `${this.x},${this.y}`
  }
}
