import { readFile } from '../../utils/io'

function isListSafe(levels: number[]) {
  let asc: boolean | null = null
  if (levels.length < 2) return true
  return Array.from({ length: levels.length - 1 }).every((_, i) => {
    const diff = levels[i + 1] - levels[i]
    const currentAsc = diff > 0
    if (asc === null) asc = currentAsc
    if (asc !== currentAsc) return false
    const absDiff = Math.abs(diff)
    return absDiff >= 1 && absDiff <= 3
  })
}

export default async function () {
  const input = await readFile('./src/2024/day2/input.txt').then((text) => text.trim())
  const reports: number[][] = input.split('\n').map((line) => line.split(' ').map((str) => parseInt(str)))

  const t0 = performance.now()

  let part1: number = 0
  let part2: number = 0

  reports.forEach((levels) => {
    if (isListSafe(levels)) {
      part1++
      part2++
    } else if (levels.some((_, i) => isListSafe(levels.toSpliced(i, 1)))) {
      part2++
    }
  })

  const t1 = performance.now()

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
  console.log('Time (ms):', t1 - t0)
}
