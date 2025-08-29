import { readFile } from '../../utils/io'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

interface DiskCell {
  pos: Pos
  size: number
  used: number
  avail: number
}

type Cell = '.' | '_' | '#' | 'G'

const DISK_ROWS = 28
const DISK_COLUMNS = 38

const isPairViable = (n1: DiskCell, n2: DiskCell): boolean =>
  !n1.pos.equals(n2.pos) && n1.used > 0 && n2.avail >= n1.used

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n').slice(2)
  const cells = lines.map((line) => {
    const [name, size, used, avail] = line.split(/\s+/)
    const [, x, y] = name.split('-')
    const pos = new Pos(Number(x.slice(1)), Number(y.slice(1)))
    return {
      pos,
      size: Number(size.slice(0, -1)),
      used: Number(used.slice(0, -1)),
      avail: Number(avail.slice(0, -1)),
    } as DiskCell
  })

  const t0 = performance.now()

  let viableCount = 0
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells.length; j++) {
      if (isPairViable(cells[i], cells[j])) {
        viableCount++
      }
    }
  }

  const part1 = viableCount

  const target = cells.find((cell) => cell.pos.x === DISK_COLUMNS - 1 && cell.pos.y === 0)!
  const grid = new Grid<Cell>(DISK_COLUMNS, DISK_ROWS, '#')
  cells.forEach((cell) => {
    if (cell.used === 0) {
      grid.setCell(cell.pos, '_')
    } else if (cell.pos.equals(target.pos)) {
      grid.setCell(cell.pos, 'G')
    } else if (cell.used > target.size) {
      grid.setCell(cell.pos, '#')
    } else {
      grid.setCell(cell.pos, '.')
    }
  })

  // grid.print()

  const t1 = performance.now()

  return [part1, null, t1 - t0]
}
