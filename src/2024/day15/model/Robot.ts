import { Dir } from '../../../utils/space/Dir'
import { Pos } from '../../../utils/space/Pos'

export class Robot {
  pos: Pos

  constructor(pos: Pos) {
    this.pos = pos
  }

  move(direction: Dir) {
    this.pos = this.pos.shift(direction)
  }
}
