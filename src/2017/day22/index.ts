import { readFile, readNumericParameter } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Space } from '../../utils/space/Space'
import { p, Pos } from '../../utils/space/Pos'
import { Dir, turnBack, turnLeft, turnRight } from '../../utils/space/Dir'

type Cell = '#' /* infected */ | '.' /* clean */ | 'W' /* weakened */ | 'F' /* flagged */

function resolvePart1(initialCells: Cell[][], iterations: number): number {
  const space = new Space<Cell>('.')
  const radius = Math.floor(initialCells.length / 2)
  initialCells.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        space.setCell(p(x - radius, y - radius), '#')
      }
    })
  })

  let infectionCount = 0
  const burst = (pos: Pos, dir: Dir): [Pos, Dir] => {
    const isCurrentInfected = space.getCell(pos) === '#'
    if (!isCurrentInfected) infectionCount++
    const newDir = isCurrentInfected ? turnRight(dir) : turnLeft(dir)
    space.setCell(pos, isCurrentInfected ? '.' : '#')
    const newPos = pos.shift(newDir)
    return [newPos, newDir]
  }

  let i = 0
  let pos = p(0, 0)
  let direction: Dir = Dir.UP

  while (i < iterations) {
    ;[pos, direction] = burst(pos, direction)
    i++
  }

  return infectionCount
}

function resolvePart2(initialCells: Cell[][], iterations: number): number {
  const space = new Space<Cell>('.')
  const radius = Math.floor(initialCells.length / 2)
  initialCells.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        space.setCell(p(x - radius, y - radius), '#')
      }
    })
  })

  let infectionCount = 0
  const burst1 = (pos: Pos, dir: Dir): [Pos, Dir] => {
    const prevState = space.getCell(pos)

    const newDir = (() => {
      switch (prevState) {
        case '.':
          return turnLeft(dir)
        case 'W':
          return dir
        case '#':
          return turnRight(dir)
        case 'F':
          return turnBack(dir)
        default:
          throw new Error(`Unknown state: ${prevState}`)
      }
    })()

    const newState = (() => {
      switch (prevState) {
        case '.':
          return 'W'
        case 'W':
          return '#'
        case '#':
          return 'F'
        case 'F':
          return '.'
        default:
          throw new Error(`Unknown state: ${prevState}`)
      }
    })()

    if (newState === '#') infectionCount++

    space.setCell(pos, newState)
    const newPos = pos.shift(newDir)
    return [newPos, newDir]
  }

  let i = 0
  let pos = p(0, 0)
  let direction: Dir = Dir.UP

  while (i < iterations) {
    ;[pos, direction] = burst1(pos, direction)
    i++
  }

  return infectionCount
}

export default async function (file: string, parameters: string[]): Promise<DaySolution> {
  const iterations1 = readNumericParameter('iterations1', parameters[0])
  const iterations2 = readNumericParameter('iterations2', parameters[1])
  const input = await readFile(file).then((text) => text.trim())

  const initialCells = input.split('\n').map((line) => line.split('')) as Cell[][]

  const t0 = performance.now()

  const part1 = resolvePart1(initialCells, iterations1)

  const part2 = resolvePart2(initialCells, iterations2)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
