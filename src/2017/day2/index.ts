import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const t0 = performance.now()

  let checksum = 0
  lines.forEach((line) => {
    const nums = line.trim().split(/\s+/).map(Number)
    const min = Math.min(...nums)
    const max = Math.max(...nums)
    checksum += max - min
  })

  const part1 = checksum

  let sum = 0
  lines.forEach((line) => {
    const nums = line.trim().split(/\s+/).map(Number)
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i !== j && nums[i] % nums[j] === 0) {
          sum += nums[i] / nums[j]
          return
        }
      }
    }
  })

  const part2 = sum

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
