import md5 from 'md5'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  let i = 0
  let part1: number | null = null
  let part2: number | null = null
  while (part1 === null || part2 === null) {
    const key = `${input}${i}`
    const hash = md5(key)
    if (part1 === null && hash.startsWith('00000')) {
      part1 = i
    }
    if (part2 === null && hash.startsWith('000000')) {
      part2 = i
    }
    i++
  }

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
