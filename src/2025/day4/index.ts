import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'

type Cell = '.' | '@'

function getAccessiblePositions(grid: Grid<Cell>): Pos[] {
  return grid.positions.filter((pos) => {
    if (grid.getCell(pos) === '@') {
      const paperCount = pos
        .neighbours('8')
        .filter((neighbourPos) => grid.getCell(neighbourPos) === '@').length
      if (paperCount < 4) return true
    }
    return false
  })
}

function resolvePart1(grid: Grid<Cell>): number {
  return getAccessiblePositions(grid).length
}

function resolvePart2(grid: Grid<Cell>): number {
  let res = 0
  let positions: Pos[] = []
  do {
    positions = getAccessiblePositions(grid)
    res += positions.length
    positions.forEach((pos) => {
      grid.setCell(pos, '.')
    })
  } while (positions.length)
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const cells: Cell[][] = input.split('\n').map((line) => {
    return line.split('') as Cell[]
  })
  const grid = Grid.fromValues(cells)

  const t0 = performance.now()

  let part1 = resolvePart1(grid)
  let part2 = resolvePart2(grid)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
