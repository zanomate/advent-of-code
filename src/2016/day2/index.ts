import { readFile } from '../../utils/io'
import { parseDirFromChar } from '../../utils/space/Dir'
import { Grid } from '../../utils/space/Grid'
import { p } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const t0 = performance.now()

  const keypad1Values = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ]
  const keypad1 = Grid.fromValues(keypad1Values)

  let pos = p(1, 1)
  let digits1: string[] = []
  lines.forEach((line) => {
    const dirList = line.split('')
    dirList.forEach((char) => {
      const dir = parseDirFromChar(char)
      const newPos = pos.shift(dir)
      if (keypad1.hasCell(newPos)) pos = newPos
    })
    digits1.push(keypad1.getCell(pos)!)
  })

  const keypad2Values = [
    [null, null, '1', null, null],
    [null, '2', '3', '4', null],
    ['5', '6', '7', '8', '9'],
    [null, 'A', 'B', 'C', null],
    [null, null, 'D', null, null],
  ]
  const keypad2 = Grid.fromValues(keypad2Values)

  pos = p(0, 2)
  const digits2: string[] = []
  lines.forEach((line) => {
    const dirList = line.split('')
    dirList.forEach((char) => {
      const dir = parseDirFromChar(char)
      const newPos = pos.shift(dir)
      if (keypad2.hasCell(newPos) && keypad2.getCell(newPos) !== null) pos = newPos
    })
    digits2.push(keypad2.getCell(pos) as string)
  })

  const part1 = digits1.join('')
  const part2 = digits2.join('')

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
