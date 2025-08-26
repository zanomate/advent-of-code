import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const nums = input.split('\t').map((line) => parseInt(line))

  const t0 = performance.now()

  const map = new Map<string, number>()
  const getKey = (nums: number[]) => nums.join(',')

  let steps = 0
  let memory = [...nums]

  map.set(getKey(memory), 0)
  while (true) {
    steps++
    const maxNum = Math.max(...memory)
    const fromIndex = memory.indexOf(maxNum)
    let taken = memory[fromIndex]
    memory[fromIndex] = 0
    for (let i = 1; i <= taken; i++) {
      memory[(fromIndex + i) % memory.length]++
    }
    const newKey = getKey(memory)
    if (map.has(newKey)) break
    map.set(newKey, steps)
  }

  const part1 = steps

  const key = getKey(memory)
  const stepsToStart = map.get(key)!
  const part2 = steps - stepsToStart

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
