import { readFile } from '../../utils/io'
import { getPermutations } from '../../utils/math'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function runSeries(program: number[], phases: number[]): number {
  let signal = 0
  for (const phase of phases) {
    const vm = new Intcode(program)
    signal = vm.runWith(phase, signal)[0]
  }
  return signal
}

function runFeedback(program: number[], phases: number[]): number {
  const amps = phases.map((phase) => {
    const vm = new Intcode(program)
    vm.pushInput(phase)
    return vm
  })
  let signal = 0
  while (!amps[amps.length - 1].halted) {
    for (const amp of amps) {
      amp.pushInput(signal)
      amp.run()
      signal = amp.drainOutputs().pop()!
    }
  }
  return signal
}

function resolvePart1(program: number[]) {
  return Math.max(...getPermutations([0, 1, 2, 3, 4]).map((p) => runSeries(program, p)))
}

function resolvePart2(program: number[]) {
  return Math.max(...getPermutations([5, 6, 7, 8, 9]).map((p) => runFeedback(program, p)))
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
