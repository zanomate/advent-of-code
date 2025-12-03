import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function findLargestDigitIndex(bank: number[], fromIndex: number, toIndex: number): number {
  let largestIndex = fromIndex
  for (let i = fromIndex + 1; i < toIndex; i++) {
    if (bank[i] > bank[largestIndex]) largestIndex = i
  }
  return largestIndex
}

function findLargest2DigitNumber(bank: number[]): number {
  const firstIndex = findLargestDigitIndex(bank, 0, bank.length - 1)
  const secondIndex = findLargestDigitIndex(bank, firstIndex + 1, bank.length)
  return parseInt(`${bank[firstIndex]}${bank[secondIndex]}`)
}

function findLargest12DigitNumber(bank: number[]): number {
  const indexes: number[] = []
  let lastIndex = -1
  for (let i = 0; i < 12; i++) {
    const ithIndex = findLargestDigitIndex(bank, lastIndex + 1, bank.length - (11 - i))
    lastIndex = ithIndex
    indexes.push(ithIndex)
  }
  return parseInt(indexes.map((index) => bank[index]).join(''))
}

function resolvePart1(banks: number[][]): number {
  let res = 0
  banks.forEach((bank) => {
    res += findLargest2DigitNumber(bank)
  })
  return res
}

function resolvePart2(banks: number[][]): number {
  let res = 0
  banks.forEach((bank) => {
    res += findLargest12DigitNumber(bank)
  })
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const banks: number[][] = input.split('\n').map((bank) => {
    return bank.split('').map((n) => parseInt(n))
  })

  const t0 = performance.now()

  let part1 = resolvePart1(banks)
  let part2 = resolvePart2(banks)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
