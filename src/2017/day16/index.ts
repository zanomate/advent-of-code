import { Computer } from '../../utils/computer/instructions'
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

  let exec = computer.load(program, initialMemory).run()

  const part1 = exec.memory

  let loopLength = 1
  while (exec.memory !== initialMemory) {
    exec = computer.load(program, exec.memory).run()
    loopLength++
  }

  for (let i = 0; i < 1_000_000_000 % loopLength; i++) {
    exec = computer.load(program, exec.memory).run()
  }

  const part2 = exec.memory

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
