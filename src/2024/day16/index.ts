import { readFile } from '../../utils/io'
import { CARDINAL_DIRECTIONS, Dir, turnBack } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

type Path = Pos[]

const path = (...posList: Pos[]): Path => {
  const res: Pos[] = []
  for (let pos of posList) {
    if (res.every((p) => !p.equals(pos))) res.push(pos)
  }
  return res
}

enum CellType {
  EMPTY = '.',
  WALL = '#',
  START = 'S',
  END = 'E',
  FILL = '0',
}

interface CellInfo {
  cost: number
  path: Path
}

interface Cell {
  type: CellType
  info: Record<Dir, CellInfo>
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const cells: Cell[][] = input.split('\n').map((row) =>
    row.split('').map(
      (type) =>
        ({
          type,
          info: {
            [Dir.UP]: { cost: Infinity, path: [] },
            [Dir.DOWN]: { cost: Infinity, path: [] },
            [Dir.LEFT]: { cost: Infinity, path: [] },
            [Dir.RIGHT]: { cost: Infinity, path: [] },
          },
        }) as Cell,
    ),
  )

  const t0 = performance.now()

  const grid = Grid.fromValues<Cell>(cells)

  const startPos = new Pos(1, grid.height - 2)
  grid.getCell(startPos)!.info[Dir.RIGHT].cost = 0

  const queue: Pos[] = [startPos]

  while (queue.length) {
    const pos = queue.shift()!
    if (!grid.hasCell(pos)) continue
    const { info } = grid.getCell(pos)!
    const prevDirToConsider = CARDINAL_DIRECTIONS.filter((dir) => info[dir].cost < Infinity)

    prevDirToConsider.forEach((prevDir) => {
      const nextDirToConsider = CARDINAL_DIRECTIONS.filter((nextDir) => nextDir !== turnBack(prevDir))
      const { cost: prevCost, path: prevPath } = info[prevDir]

      nextDirToConsider.forEach((nextDir) => {
        const stepCost = prevDir === nextDir ? 1 : 1001
        const candidateCost = prevCost + stepCost

        const nextPos = pos.shift(nextDir, 1)
        const nextCell = grid.getCell(nextPos)
        if (nextCell === null) return
        if (nextCell.type === CellType.WALL) return

        const { cost: nextCost, path: nextPath } = nextCell.info[nextDir]
        if (nextCost === candidateCost) {
          const newNextPath = path(...nextPath, ...prevPath)
          if (newNextPath.length > nextPath.length) queue.push(nextPos)
          grid.getCell(nextPos)!.info[nextDir] = { cost: candidateCost, path: newNextPath }
        } else if (nextCost > candidateCost) {
          const newNextPath = path(...prevPath, pos)
          grid.getCell(nextPos)!.info[nextDir] = { cost: candidateCost, path: newNextPath }
          queue.push(nextPos)
        }
      })
    })
  }

  const endPos = new Pos(grid.width - 2, 1)
  const endCell = grid.getCell(endPos)!
  const minCost = Math.min(...CARDINAL_DIRECTIONS.map((dir) => endCell.info[dir].cost))
  const minCostInfos = CARDINAL_DIRECTIONS.map((dir) => endCell.info[dir]).filter((info) => info.cost === minCost)
  const allPos = minCostInfos.flatMap((info) => info.path)

  const part1 = minCost
  const part2 = allPos.length + 1

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
