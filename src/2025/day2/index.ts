import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Range } from '../../utils/number'

function isInvalid(num: number): boolean {
  const asString = String(num)
  if (asString.length % 2 !== 0) return false
  const halfLength = asString.length / 2
  return asString.slice(0, halfLength) === asString.slice(halfLength)
}

function isInvalidV2(num: number): boolean {
  return String(num).match(/^(\d+)\1+$/) !== null
}

function resolvePart1(ranges: Range[]): number {
  let res = 0
  ranges.forEach((range) => {
    for (let i = range.start; i <= range.end; i++) {
      if (isInvalid(i)) res += i
    }
  })
  return res
}

function resolvePart2(ranges: Range[]): number {
  let res = 0
  ranges.forEach((range) => {
    for (let i = range.start; i <= range.end; i++) {
      if (isInvalidV2(i)) res += i
    }
  })
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const ranges: Range[] = input.split(',').map((range) => {
    const [start, end] = range.split('-').map((n) => parseInt(n))
    return { start, end }
  })

  const t0 = performance.now()

  let part1 = resolvePart1(ranges)
  let part2 = resolvePart2(ranges)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
