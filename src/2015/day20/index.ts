import { readFile } from '../../utils/io'

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

export default async function () {
  const input = await readFile('./src/2015/day20/input.txt').then((text) => text.trim())
  const targetPresents = parseInt(input)

  const computePresents = (house: number, presentsPerElf: number, housesPerElf: number) => {
    return getDivisors(house, housesPerElf).reduce((tot, factor) => tot + factor * presentsPerElf, 0)
  }

  let presents
  let house = 1
  while ((presents = computePresents(house, 10, Infinity)) < targetPresents) house++
  console.log('Part 1:', house)

  house = 1
  while ((presents = computePresents(house, 11, 50)) < targetPresents) house++
  console.log('Part 2:', house)
}
