import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Grid } from '../../utils/space/Grid'
import { p, Pos } from '../../utils/space/Pos'
import { Dir, turnBack, XY_DIRECTIONS } from '../../utils/space/Dir'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text)
  const lines = input.split('\n').map((line) => line.split(''))
  const width = Math.max(...lines.map((line) => line.length))
  lines.forEach((line) => {
    while (line.length < width) line.push(' ')
  })
  const grid = Grid.fromValues(lines)

  const t0 = performance.now()

  const startCol = grid.getRow(0).findIndex((cell) => cell === '|')
  const startPos = p(startCol, 0)

  const getNext = (pos: Pos, dir: Dir): [Pos | null, Dir] => {
    const cell = grid.getCell(pos)
    if (cell === null || cell === ' ') return [null, dir]
    if (cell === '+') {
      const newDir = XY_DIRECTIONS.find((d) => {
        if (d === dir || d === turnBack(dir)) return false
        const newCell = grid.getCell(pos.shift(d))
        return newCell !== null && newCell !== ' '
      })
      if (newDir) return [pos.shift(newDir), newDir]
      else return [null, dir]
    }
    return [pos.shift(dir), dir]
  }

  let dir: Dir = Dir.DOWN
  let pos: Pos | null = startPos
  let letters = ''
  let steps = 0

  while (([pos, dir] = getNext(pos!, dir))[0] !== null) {
    steps++
    const cell = grid.getCell(pos!)!
    if (cell.match(/[A-Z]/)) {
      letters += cell
    }
  }

  const part1 = letters

  const part2 = steps

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
