import { readFile } from '../../utils/io'
import { Grid } from '../../utils/space/Grid'
import { Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const instructions = input.split('\n')

  const t0 = performance.now()

  let display = new Grid<boolean>(50, 6, false)

  for (let instruction of instructions) {
    let match
    if ((match = instruction.match(/rect (\d+)x(\d+)/))) {
      // rect AxB
      const x = parseInt(match[1])
      const y = parseInt(match[2])
      display.setPortion(new Pos(0, 0), new Pos(x, y), true)
    } else if ((match = instruction.match(/rotate row y=(\d+) by (\d+)/))) {
      // rotate row y=A by B
      const row = parseInt(match[1])
      const shift = parseInt(match[2])
      const prev = display.getRow(row)
      const newRow = prev.map((_, i) => prev[(i - shift + display.width) % display.width])
      newRow.forEach((value, i) => display.setCell(new Pos(i, row), value))
    } else if ((match = instruction.match(/rotate column x=(\d+) by (\d+)/))) {
      // rotate column x=A by B
      const column = parseInt(match[1])
      const shift = parseInt(match[2])
      const prev = display.getColumn(column)
      const newColumn = prev.map((_, i) => prev[(i - shift + display.height) % display.height])
      newColumn.forEach((value, i) => display.setCell(new Pos(column, i), value))
    }
  }

  const part1 = display.values.filter((value) => value).length

  // display.print((v) => (v ? '0' : ' '))
  const part2 = 'ZJHRKCPLYJ' // obtained from printing the display

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
