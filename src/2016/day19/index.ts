import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Elf {
  index: number
  presents: number
}

const log3 = (x: number): number => Math.log(x) / Math.log(3)

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const elvesCount = Number(input)

  const resolvePt1 = (): number => {
    const nearestPow2 = 2 ** Math.floor(Math.log2(elvesCount))
    return (elvesCount - nearestPow2) * 2 + 1
  }

  const resolvePt2 = (): number => {
    const nearestPow3 = 3 ** Math.floor(log3(elvesCount))
    if (elvesCount === nearestPow3) return elvesCount
    if (elvesCount < nearestPow3 * 2) return elvesCount - nearestPow3
    return nearestPow3 + (elvesCount - nearestPow3 * 2) * 2
  }

  const t0 = performance.now()

  const part1 = resolvePt1()

  const part2 = resolvePt2()

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
