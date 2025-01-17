/** Cardinal direction */
export enum Dir {
  UP = '^',
  RIGHT = '>',
  DOWN = 'v',
  LEFT = '<',
}

/** Diagonal direction */
export enum DiagDir {
  UP_LEFT = '┌',
  UP_RIGHT = '┐',
  DOWN_LEFT = '∟',
  DOWN_RIGHT = '┘',
}

export type DirSystem = '+' | 'x' | '8'

export const XY_DIRECTIONS = [Dir.UP, Dir.RIGHT, Dir.DOWN, Dir.LEFT]
export const DIAG_DIRECTIONS = [DiagDir.UP_LEFT, DiagDir.UP_RIGHT, DiagDir.DOWN_LEFT, DiagDir.DOWN_RIGHT]
export const ALL_DIRECTIONS = [...XY_DIRECTIONS, ...DIAG_DIRECTIONS]

export const turnLeft = (direction: Dir): Dir => {
  return XY_DIRECTIONS[(XY_DIRECTIONS.indexOf(direction) - 1 + 4) % 4]
}

export const turnRight = (direction: Dir): Dir => {
  return XY_DIRECTIONS[(XY_DIRECTIONS.indexOf(direction) + 1) % 4]
}

export const turnBack = (direction: Dir): Dir => {
  return XY_DIRECTIONS[(XY_DIRECTIONS.indexOf(direction) + 2) % 4]
}

export const flipVertically = (direction: Dir): Dir => {
  if ([Dir.UP, Dir.DOWN].includes(direction)) return direction === Dir.UP ? Dir.DOWN : Dir.UP
  return direction
}

export const parseDirFromChar = (char: string): Dir => {
  switch (char) {
    case 'U':
      return Dir.UP
    case 'R':
      return Dir.RIGHT
    case 'D':
      return Dir.DOWN
    case 'L':
      return Dir.LEFT
    default:
      throw new Error('Invalid char')
  }
}
