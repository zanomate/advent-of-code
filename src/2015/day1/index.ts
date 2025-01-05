import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day1/input.txt').then((text) => text.trim())
  const chars = input.split('')

  let floor = 0
  let negativeFloorIndex: number | null = null
  chars.forEach((char, i) => {
    if (char === '(') floor++
    else if (char === ')') floor--

    if (negativeFloorIndex === null && floor === -1) negativeFloorIndex = i + 1
  })

  console.log('Part 1:', floor)
  console.log('Part 2:', negativeFloorIndex)
}
