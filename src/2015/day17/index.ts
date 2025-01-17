import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const getCombinations = (containers: number[], total: number): number[][] => {
  const res: number[][] = []
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i]
    if (container > total) continue
    if (container === total) {
      res.push([container])
      continue
    }
    getCombinations(containers.slice(i + 1), total - container).forEach((combination) => {
      res.push([container, ...combination])
    })
  }
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const containers = input.split('\n').map((str) => parseInt(str))

  const t0 = performance.now()

  const combinations = getCombinations(containers, 150)
  const part1 = combinations.length

  const minLength = Math.min(...combinations.map((c) => c.length))
  const combinationsWithMinLength = combinations.filter((c) => c.length === minLength)
  const part2 = combinationsWithMinLength.length

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
