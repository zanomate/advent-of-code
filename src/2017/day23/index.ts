import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Computer } from '../../utils/computer/instructions'
import { specs } from './specs'
import { isPrime } from '../../utils/math'

const computer = new Computer(specs)

function resolvePart2() {
  let res = 0
  for (let i = 109300; i <= 126300; i += 17) {
    if (!isPrime(i)) res++
  }
  return res
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const program = input.split('\n')

  const t0 = performance.now()

  const execution = computer.load(program, { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0 })
  execution.run()

  const part1 = execution.memory.mulCounts

  const part2 = resolvePart2()

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
