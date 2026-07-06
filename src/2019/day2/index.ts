import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function runWith(program: number[], noun: number, verb: number): number {
  const vm = new Intcode(program)
  vm.mem[1] = noun
  vm.mem[2] = verb
  vm.run()
  return vm.mem[0]
}

function resolvePart1(program: number[]) {
  return runWith(program, 12, 2)
}

function resolvePart2(program: number[]) {
  const target = 19690720
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (runWith(program, noun, verb) === target) return 100 * noun + verb
    }
  }
  return null
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const program = Intcode.parse(input)

  const t0 = performance.now()

  let part1 = resolvePart1(program)
  let part2 = resolvePart2(program)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
