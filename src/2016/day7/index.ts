import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function containsAbba(str: string): boolean {
  return /(\w)((?!\1)\w)\2\1/.test(str)
}

function containsAbaBab(outside: string[], hypernet: string[]): boolean {
  const str = [outside.join(','), hypernet.join(',')].join('|')
  return /(\w)((?!\1)\w)\1.*\|.*\2\1\2/.test(str)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const t0 = performance.now()

  let part1 = 0
  let part2 = 0
  for (let line of lines) {
    const segments = line.split(/[\[\]]/)
    const outside = segments.filter((_, i) => i % 2 === 0)
    const hypernet = segments.filter((_, i) => i % 2 === 1)
    if (outside.some((segment) => containsAbba(segment)) && hypernet.every((segment) => !containsAbba(segment))) part1++

    if (containsAbaBab(outside, hypernet)) part2++
  }

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
