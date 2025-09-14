import { Computer } from '../../utils/computer/instructions'
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
  const exec1 = computer.load(lines, memory)
  exec1.run()

  const part1: number = exec1.memory['a']

  memory['c'] = 1
  const exec2 = computer.load(lines, memory)
  exec2.run()

  const part2: number = exec2.memory['a']

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
