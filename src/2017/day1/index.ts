import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const nums = input.split('').map((c) => parseInt(c, 10))

  const t0 = performance.now()

  const part1 = nums.reduce(
    (tot, num, idx) => tot + (num === nums[(idx + 1) % nums.length] ? num : 0),
    0,
  )

  const halfLen = nums.length / 2
  const part2 = nums.reduce(
    (tot, num, idx) => tot + (num === nums[(idx + halfLen) % nums.length] ? num : 0),
    0,
  )

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
