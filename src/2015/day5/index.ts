import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const strings: string[] = input.split('\n')

  const t0 = performance.now()

  let part1 = 0
  let part2 = 0
  strings.forEach((str) => {
    if (!str.match(/(ab|cd|pq|xy)/) && str.match(/[aeiou].*[aeiou].*[aeiou]/) && str.match(/(.)\1/)) part1++
    if (str.match(/(.{2}).*\1/) && str.match(/(.).\1/)) part2++
  })

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
