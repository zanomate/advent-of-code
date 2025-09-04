import { Dir } from '../../../utils/space/Dir'
import { p, Pos } from '../../../utils/space/Pos'

export class Box {
  private pos: Pos
  size: number

  constructor(pos: Pos, size: number) {
    this.pos = pos
    this.size = size
  }

  toString(): string {
    return this.pos.toString()
  }

  get posList(): Pos[] {
    return Array.from({ length: this.size }, (_, i) => this.pos.shift(Dir.RIGHT, i))
  }

  get leftmostPos(): Pos {
    return this.pos
  }

  get rightmostPos(): Pos {
    return this.pos.shift(Dir.RIGHT, this.size - 1)
  }

  frontPosList(dir: Dir): Pos[] {
    switch (dir) {
      case Dir.UP:
      case Dir.DOWN:
        return this.posList
      case Dir.LEFT:
        return [this.leftmostPos]
      case Dir.RIGHT:
        return [this.rightmostPos]
    }
  }

  backPosList(dir: Dir): Pos[] {
    if (this.size === 1) return []
    switch (dir) {
      case Dir.UP:
      case Dir.DOWN:
        return []
      case Dir.LEFT:
        return this.posList.slice(1)
      case Dir.RIGHT:
        return this.posList.slice(0, -1)
    }
  }

  move(direction: Dir) {
    this.pos = this.pos.shift(direction)
  }
}
