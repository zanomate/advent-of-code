import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [towelsInput, designsInput] = input.split('\n\n')
  const towels: string[] = towelsInput.split(', ')
  const designs: string[] = designsInput.split('\n')

  const t0 = performance.now()

  const memo = new Map<string, number>()

  const countWaysToCreateDesign = (design: string): number => {
    if (memo.has(design)) return memo.get(design)!

    let count = 0
    for (let towel of towels) {
      if (design === towel) {
        count++
      } else if (design.startsWith(towel)) {
        count += countWaysToCreateDesign(design.slice(towel.length))
      }
    }

    memo.set(design, count)
    return count
  }

  let part1 = 0
  let part2 = 0
  designs.forEach((design) => {
    const waysToCreateDesign = countWaysToCreateDesign(design)
    if (waysToCreateDesign > 0) {
      part1++
      part2 += waysToCreateDesign
    }
  })

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
