import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const mix = (prev: number, value: number): number => {
  return value ^ prev
}

const prune = (prev: number): number => {
  return ((prev % 16777216) + 16777216) % 16777216
}

const next = (prev: number): number => {
  let res = prev
  res = prune(mix(res, res * 64))
  res = prune(mix(res, Math.floor(res / 32)))
  res = prune(mix(res, res * 2048))
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const nums = lines.map((line) => parseInt(line))

  const t0 = performance.now()

  const lastNums: number[] = []
  const sequencesSum = new Map<string, number>()

  nums.forEach((seed) => {
    let num = seed
    const seen = new Set<string>()
    const changes: number[] = []

    let i = 0
    while (i < 2000) {
      const prevPrice = num % 10
      num = next(num)
      const price = num % 10
      const priceChange = price - prevPrice
      changes.push(priceChange)

      if (i >= 3) {
        const last4Changes = changes.slice(-4).join(',')
        if (!seen.has(last4Changes)) {
          seen.add(last4Changes)
          sequencesSum.set(last4Changes, (sequencesSum.get(last4Changes) ?? 0) + price)
        }
      }
      i++
    }

    lastNums.push(num)
  })

  const sum = lastNums.reduce((tot, num) => tot + num, 0)
  const bestTotalPrice = Math.max(...Array.from(sequencesSum.values()))

  const part1 = Number(sum)
  const part2 = bestTotalPrice

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
