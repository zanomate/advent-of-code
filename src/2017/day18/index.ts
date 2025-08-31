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

  const exec1 = v2.load(program, { queueIn: [], queueOut: [], p: 0, name: 'A' })
  const exec2 = v2.load(program, { queueIn: [], queueOut: [], p: 1, name: 'B' })

  exec1.run()
  exec2.run()

  // while (exec1.memory.queueOut.length || exec2.memory.queueOut.length) {
  //   console.log(exec1.memory.queueOut.length, exec2.memory.queueOut.length)
  //   exec1.memory.queueIn.push(...exec2.memory.queueOut)
  //   exec2.memory.queueOut = []
  //   exec2.memory.queueIn.push(...exec1.memory.queueOut)
  //   exec1.memory.queueOut = []
  //   exec1.run()
  //   exec2.run()
  // }

  const part2 = exec1.memory.sendCount

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
