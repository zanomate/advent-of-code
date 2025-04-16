import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const isTrap = (left: boolean, center: boolean, right: boolean): boolean => {
  return (
    (left && center && !right) ||
    (center && right && !left) ||
    (left && !center && !right) ||
    (right && !center && !left)
  )
}

const nextRow = (row: boolean[]): boolean[] => {
  const nextRow: boolean[] = []
  for (let i = 0; i < row.length; i++) {
    const left = i === 0 ? false : row[i - 1]
    const center = row[i]
    const right = i === row.length - 1 ? false : row[i + 1]
    nextRow.push(isTrap(left, center, right))
  }
  return nextRow
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const firstRow = input.split('').map((i) => i === '^')

  const countSafe = (row: boolean[]): number => row.reduce((tot, tile) => tot + (tile ? 0 : 1), 0)

  const resolve = (rows: number): number => {
    let safe = countSafe(firstRow)
    let row = firstRow
    let i = 1
    while (i++ < rows) {
      row = nextRow(row)
      safe += countSafe(row)
    }
    return safe
  }

  const t0 = performance.now()

  const part1 = resolve(40)

  const part2 = resolve(400000)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
