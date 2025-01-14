export enum Dir {
  UP = '^',
  RIGHT = '>',
  DOWN = 'v',
  LEFT = '<',
}

export enum DiagonalDir {
  UP_LEFT = '┌',
  UP_RIGHT = '┐',
  DOWN_LEFT = '∟',
  DOWN_RIGHT = '┘',
}

export const CARDINAL_DIRECTIONS = [Dir.UP, Dir.RIGHT, Dir.DOWN, Dir.LEFT]

export const DIAGONAL_DIRECTIONS = [
  DiagonalDir.UP_LEFT,
  DiagonalDir.UP_RIGHT,
  DiagonalDir.DOWN_LEFT,
  DiagonalDir.DOWN_RIGHT,
]

export const ALL_DIRECTIONS = [...CARDINAL_DIRECTIONS, ...DIAGONAL_DIRECTIONS]

export const turnLeft = (direction: Dir): Dir => {
  return CARDINAL_DIRECTIONS[(CARDINAL_DIRECTIONS.indexOf(direction) - 1 + 4) % 4]
}

export const turnRight = (direction: Dir): Dir => {
  return CARDINAL_DIRECTIONS[(CARDINAL_DIRECTIONS.indexOf(direction) + 1) % 4]
}

export const turnBack = (direction: Dir): Dir => {
  return CARDINAL_DIRECTIONS[(CARDINAL_DIRECTIONS.indexOf(direction) + 2) % 4]
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
