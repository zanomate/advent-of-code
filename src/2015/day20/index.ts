import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function getDivisors(n: number, limit: number = Infinity): number[] {
  const divisors: number[] = []
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divisors.push(i)
      if (i !== n / i) divisors.push(n / i)
    }
  }
  return divisors.filter((i) => i * limit >= n).sort((a, b) => a - b)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const targetPresents = parseInt(input)

  const t0 = performance.now()

  const computePresents = (house: number, presentsPerElf: number, housesPerElf: number) => {
    return getDivisors(house, housesPerElf).reduce((tot, factor) => tot + factor * presentsPerElf, 0)
  }

  let presents
  let house = 1
  while ((presents = computePresents(house, 10, Infinity)) < targetPresents) house++
  const part1 = house

  house = 1
  while ((presents = computePresents(house, 11, 50)) < targetPresents) house++
  const part2 = house

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
