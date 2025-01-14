import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2024/day19/input.txt').then((text) => text.trim())
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

  let possibleDesigns = 0
  let allWaysToCreateAnyDesign = 0
  designs.forEach((design) => {
    const waysToCreateDesign = countWaysToCreateDesign(design)
    if (waysToCreateDesign > 0) {
      possibleDesigns++
      allWaysToCreateAnyDesign += waysToCreateDesign
    }
  })

  const t1 = performance.now()

  console.log('Part 1:', possibleDesigns)
  console.log('Part 2:', allWaysToCreateAnyDesign)
  console.log('Time (ms):', t1 - t0)
}
