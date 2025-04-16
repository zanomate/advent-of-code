import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Disc {
  positions: number
  start: number
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const discs: Disc[] = lines.map((line) => {
    const match = line.match(/Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./)
    if (!match) throw new Error('Invalid line')
    return {
      positions: parseInt(match[2]),
      start: parseInt(match[3]),
    }
  })

  const resolve = (discs: Disc[]): number => {
    let t = 0
    while (true) {
      if (discs.every((disc, i) => (disc.start + t + i + 1) % disc.positions === 0)) {
        return t
      }
      t++
    }
  }

  const t0 = performance.now()

  const part1: number = resolve(discs)

  const part2: number = resolve([...discs, { positions: 11, start: 0 }])

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
