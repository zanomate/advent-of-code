import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function presents(house: number, housesPerElf: number, presentsPerElf: number): number {
  let sum = 0
  let limit = Math.sqrt(house)
  for (let elf = 1; elf <= limit; elf++) {
    if (house % elf === 0) {
      if (house <= elf * housesPerElf) sum += elf
      const otherElf = house / elf
      if (elf !== otherElf && house <= otherElf * housesPerElf) sum += otherElf
    }
  }
  return sum * presentsPerElf
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const targetPresents = parseInt(input)

  const t0 = performance.now()

  let house = 1
  while (presents(house, Infinity, 10) < targetPresents) house++
  const part1 = house

  house = 1
  while (presents(house, 50, 11) < targetPresents) house++
  const part2 = house

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
