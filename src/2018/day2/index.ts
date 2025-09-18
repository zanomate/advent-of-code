import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { getCombinations } from '../../utils/math'

function countLetters(id: string): number[] {
  const map = new Map<string, number>()
  id.split('').forEach((char) => {
    map.set(char, (map.get(char) || 0) + 1)
  })
  return Array.from(map.values())
}

function countDiffs(id1: string, id2: string): number[] {
  if (id1.length !== id2.length) throw new Error('ids must have the same length')
  const diffs = []
  for (let i = 0; i < id1.length; i++) {
    if (id1[i] !== id2[i]) diffs.push(i)
  }
  return diffs
}

function resolvePart1(ids: string[]) {
  let withLetterAppearTwice = 0
  let withLetterAppearThrice = 0
  ids.forEach((id) => {
    const counts = countLetters(id)
    if (counts.includes(2)) withLetterAppearTwice++
    if (counts.includes(3)) withLetterAppearThrice++
  })
  return withLetterAppearTwice * withLetterAppearThrice
}

function resolvePart2(ids: string[]) {
  const combinations = getCombinations(2, ids)
  for (let i = 0; i < combinations.length; i++) {
    const [id1, id2] = combinations[i]
    const diffs = countDiffs(id1, id2)
    if (diffs.length === 1) return id1.split('').toSpliced(diffs[0], 1).join('')
  }
  throw new Error('no solution found')
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const ids = input.split('\n')

  const t0 = performance.now()
  const part1 = resolvePart1(ids)
  const part2 = resolvePart2(ids)
  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
