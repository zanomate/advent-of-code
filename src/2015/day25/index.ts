import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const match = input.match(/row (\d+), column (\d+)/)
  if (match === null) throw new Error('invalid input')
  const targetRow = parseInt(match[1])
  const targetCol = parseInt(match[2])

  const t0 = performance.now()

  let d = 1
  let r = 1
  let c = 1
  let num = 20151125

  while (!(r === targetRow && c === targetCol)) {
    if (r === 1 && c === d) {
      d++
      r = d
      c = 1
    } else {
      r--
      c++
    }
    num = (num * 252533) % 33554393
  }

  const t1 = performance.now()

  return [num, null, t1 - t0]
}
