import { last } from 'lodash'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const t0 = performance.now()

  const len = lines[0].length
  let part1 = ''
  let part2 = ''
  for (let i = 0; i < len; i++) {
    const freq = new Map<string, number>()
    for (const line of lines) {
      const c = line[i]
      freq.set(c, (freq.get(c) || 0) + 1)
    }

    const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1])
    part1 += sorted[0][0]
    part2 += last(sorted)![0]
  }

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
