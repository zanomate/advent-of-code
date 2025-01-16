import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function computeTotal(input: string, checkConditionals: boolean): number {
  let tot = 0
  let enabled = true
  const matches = input.trim().matchAll(/(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/g)
  let match = matches.next()
  while (!match.done) {
    if (match.value[0] === 'do()') {
      if (checkConditionals) enabled = true
    } else if (match.value[0] === "don't()") {
      if (checkConditionals) enabled = false
    } else if (enabled) {
      tot += parseInt(match.value[2]) * parseInt(match.value[3])
    }
    match = matches.next()
  }
  return tot
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const part1 = computeTotal(input, false)
  const part2 = computeTotal(input, true)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
