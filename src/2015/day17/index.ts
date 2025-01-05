import { readFile } from '../../utils/io'

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

export default async function () {
  const input = await readFile('./src/2015/day17/input.txt').then((text) => text.trim())
  const containers = input.split('\n').map((str) => parseInt(str))

  const combinations = getCombinations(containers, 150)

  console.log('Part 1:', combinations.length)

  const minLength = Math.min(...combinations.map((c) => c.length))
  const combinationsWithMinLength = combinations.filter((c) => c.length === minLength)

  console.log('Part 2:', combinationsWithMinLength.length)
}
