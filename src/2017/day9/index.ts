import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  let score = 0
  let localScore = 0
  let isGarbage = false
  let ignoreNext = false
  let garbageCount = 0

  for (let cursor = 0; cursor < input.length; cursor++) {
    const char = input[cursor]

    if (ignoreNext) {
      ignoreNext = false
      continue
    }

    if (char === '!') {
      ignoreNext = true
    } else if (char === '<') {
      if (isGarbage) garbageCount++
      else isGarbage = true
    } else if (char === '>') {
      isGarbage = false
    } else if (!isGarbage) {
      if (char === '{') {
        localScore++
      } else if (char === '}') {
        score += localScore--
      }
    } else {
      garbageCount++
    }
  }

  const part1 = score

  const part2 = garbageCount

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
