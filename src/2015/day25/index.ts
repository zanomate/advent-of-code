import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day25/input.txt').then((text) => text.trim())
  const match = input.match(/row (\d+), column (\d+)/)
  if (match === null) throw new Error('invalid input')
  const targetRow = parseInt(match[1])
  const targetCol = parseInt(match[2])

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

  console.log('Part 1:', num)
}
