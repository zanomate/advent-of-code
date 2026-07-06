import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

function resolvePart1(count: number): PartSolution {
  const scoreboard = [3, 7]
  let elf1 = 0
  let elf2 = 1

  while (scoreboard.length < count + 10) {
    const sum = scoreboard[elf1] + scoreboard[elf2]
    if (sum >= 10) scoreboard.push(Math.floor(sum / 10))
    scoreboard.push(sum % 10)
    elf1 = (elf1 + 1 + scoreboard[elf1]) % scoreboard.length
    elf2 = (elf2 + 1 + scoreboard[elf2]) % scoreboard.length
  }

  return scoreboard.slice(count, count + 10).join('')
}

function resolvePart2(pattern: number[]): PartSolution {
  const scoreboard = [3, 7]
  let elf1 = 0
  let elf2 = 1
  const length = pattern.length

  const endsWithPattern = (): boolean => {
    const start = scoreboard.length - length
    if (start < 0) return false
    for (let i = 0; i < length; i++) {
      if (scoreboard[start + i] !== pattern[i]) return false
    }
    return true
  }

  while (true) {
    const sum = scoreboard[elf1] + scoreboard[elf2]
    if (sum >= 10) {
      scoreboard.push(Math.floor(sum / 10))
      if (endsWithPattern()) break
    }
    scoreboard.push(sum % 10)
    if (endsWithPattern()) break
    elf1 = (elf1 + 1 + scoreboard[elf1]) % scoreboard.length
    elf2 = (elf2 + 1 + scoreboard[elf2]) % scoreboard.length
  }

  return scoreboard.length - length
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const part1 = resolvePart1(Number(input))
  const part2 = resolvePart2([...input].map(Number))

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
