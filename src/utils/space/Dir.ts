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
export const DIAG_DIRECTIONS = [DiagDir.UP_RIGHT, DiagDir.DOWN_RIGHT, DiagDir.DOWN_LEFT, DiagDir.UP_LEFT]
export const ALL_DIRECTIONS = [
  Dir.UP,
  DiagDir.UP_RIGHT,
  Dir.RIGHT,
  DiagDir.DOWN_RIGHT,
  Dir.DOWN,
  DiagDir.DOWN_LEFT,
  Dir.LEFT,
  DiagDir.UP_LEFT,
]

export const turnLeft = (direction: Dir): Dir => {
  return XY_DIRECTIONS[(XY_DIRECTIONS.indexOf(direction) - 1 + 4) % 4]
}

export const turnRight = (direction: Dir): Dir => {
  return XY_DIRECTIONS[(XY_DIRECTIONS.indexOf(direction) + 1) % 4]
}

export const turnBack = (direction: Dir): Dir => {
  return XY_DIRECTIONS[(XY_DIRECTIONS.indexOf(direction) + 2) % 4]
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

export const printCharFromDir = (dir: Dir): string => {
  switch (dir) {
    case Dir.UP:
      return 'U'
    case Dir.RIGHT:
      return 'R'
    case Dir.DOWN:
      return 'D'
    case Dir.LEFT:
      return 'L'
    default:
      throw new Error('Invalid dir')
  }
}
