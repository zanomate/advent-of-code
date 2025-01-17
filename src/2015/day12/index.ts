import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  let part1 = 0
  let queue1 = [JSON.parse(input)]
  while (queue1.length) {
    const json = queue1.shift()!
    if (typeof json === 'number') {
      part1 += json as number
    } else if (typeof json === 'string') {
      // do nothing
    } else {
      queue1.push(...Object.values(json))
    }
  }

  let part2 = 0
  let queue2 = [JSON.parse(input)]
  while (queue2.length) {
    const json = queue2.shift()!
    if (typeof json === 'number') {
      part2 += json as number
    } else if (typeof json === 'string') {
      // do nothing
    } else if (!Array.isArray(json) && Object.values(json).includes('red')) {
      // do nothing
    } else {
      queue2.push(...Object.values(json))
    }
  }

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
