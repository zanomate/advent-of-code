import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const FACTOR_A = 16807
const FACTOR_B = 48271
const DIV_FACTOR = 2147483647

function next(prev: number, factor: number) {
  return (prev * factor) % DIV_FACTOR
}

function next2(prev: number, factor: number, divider: number) {
  let res = next(prev, factor)
  while (res % divider) res = next(res, factor)
  return res
}

function areLower16BitsEquals(a: number, b: number): boolean {
  return (a & 0xffff) == (b & 0xffff)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const seedA = Number(lines[0].split('starts with ')[1])
  const seedB = Number(lines[1].split('starts with ')[1])

  const t0 = performance.now()

  let matches = 0
  let a = seedA
  let b = seedB
  let i = 0
  while (i++ < 40_000_000) {
    a = next(a, FACTOR_A)
    b = next(b, FACTOR_B)
    if (areLower16BitsEquals(a, b)) matches++
  }

  const part1 = matches

  matches = 0
  a = seedA
  b = seedB
  i = 0
  while (i++ < 5_000_000) {
    a = next2(a, FACTOR_A, 4)
    b = next2(b, FACTOR_B, 8)
    if (areLower16BitsEquals(a, b)) matches++
  }

  const part2 = matches

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
