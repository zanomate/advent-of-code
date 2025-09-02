import { Computer } from '../../utils/instructions'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { duetSpecsV1 } from './duetSpecsV1'
import { DuetMemory, duetSpecsV2 } from './duetSpecsV2'

const v1 = new Computer(duetSpecsV1)
const v2 = new Computer<DuetMemory>(duetSpecsV2)

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const program = input.split('\n')

  const t0 = performance.now()

  const execution = v1.load(program, {})
  execution.run()

  const part1 = execution.out[0]

  const queueA: number[] = []
  const queueB: number[] = []

  const execA = v2.load(program, { p: 0, queueIn: queueA, queueOut: queueB })
  const execB = v2.load(program, { p: 1, queueIn: queueB, queueOut: queueA })

  execA.run()
  execB.run()

  while (queueA.length || queueB.length) {
    execA.run()
    execB.run()
  }

  const part2 = execB.memory.sendCount

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
