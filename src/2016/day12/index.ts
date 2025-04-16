import { Computer } from '../../utils/instructions'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { assembunnySpecs } from './assembunny-specs'

const computer = new Computer(assembunnySpecs)

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const t0 = performance.now()

  const memory: Record<string, number> = {}
  memory['a'] = 0
  memory['b'] = 0
  memory['c'] = 0
  memory['d'] = 0

  const part1: number = computer.run(lines, memory).memory['a']

  memory['c'] = 1

  const part2: number = computer.run(lines, memory).memory['a']

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
