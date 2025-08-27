import { HexDir } from './Dir'

export class HexPos {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  equals(other: HexPos): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z
  }

  shift(dir: HexDir, distance: number = 1): HexPos {
    switch (dir) {
      case HexDir.UP:
        return new HexPos(this.x, this.y - distance, this.z + distance)
      case HexDir.DOWN:
        return new HexPos(this.x, this.y + distance, this.z - distance)
      case HexDir.LEFT_UP:
        return new HexPos(this.x - distance, this.y, this.z + distance)
      case HexDir.LEFT_DOWN:
        return new HexPos(this.x - distance, this.y + distance, this.z)
      case HexDir.RIGHT_UP:
        return new HexPos(this.x + distance, this.y - distance, this.z)
      case HexDir.RIGHT_DOWN:
        return new HexPos(this.x + distance, this.y, this.z - distance)
      default:
        throw new Error('Invalid direction')
    }
  }

  toString(): string {
    return `${this.x},${this.y},${this.z}`
  }

  distanceFrom(pos: HexPos): number {
    const x = Math.abs(this.x - pos.x)
    const y = Math.abs(this.y - pos.y)
    const z = Math.abs(this.z - pos.z)
    return (x + y + z) / 2
  }
}
