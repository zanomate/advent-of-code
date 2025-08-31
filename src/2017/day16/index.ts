import { Computer } from '../../utils/instructions'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { specs } from './specs'

const DANCERS_COUNT = 16
const computer = new Computer(specs)

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const program = input.split(',')

  const t0 = performance.now()

  let initialMemory = Array.from({ length: DANCERS_COUNT }, (_, i) =>
    String.fromCharCode('a'.charCodeAt(0) + i),
  ).join('')

  let execution = computer.run(program, initialMemory)

  const part1 = execution.memory

  let loopLength = 1
  while (execution.memory !== initialMemory) {
    execution = computer.run(program, execution.memory)
    loopLength++
  }

  for (let i = 0; i < 1_000_000_000 % loopLength; i++) {
    execution = computer.run(program, execution.memory)
  }

  const part2 = execution.memory

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
