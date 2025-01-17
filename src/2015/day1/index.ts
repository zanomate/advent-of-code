import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const chars = input.split('')

  const t0 = performance.now()

  let floor = 0
  let negativeFloorIndex: number | null = null
  chars.forEach((char, i) => {
    if (char === '(') floor++
    else if (char === ')') floor--

    if (negativeFloorIndex === null && floor === -1) negativeFloorIndex = i + 1
  })

  const part1 = floor
  const part2 = negativeFloorIndex

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
