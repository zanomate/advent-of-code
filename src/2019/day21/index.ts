import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function runSpringscript(program: number[], lines: string[]): number {
  const vm = new Intcode(program)
  for (const line of lines) vm.pushLine(line)
  const outputs = vm.runWith()
  const last = outputs[outputs.length - 1]
  // A hull-damage reading is out of ASCII range; anything else means the droid fell.
  return last
}

function resolvePart1(program: number[]) {
  // Jump when a hole is coming (A, B or C) but the landing tile D is solid.
  return runSpringscript(program, [
    'NOT A J',
    'NOT B T',
    'OR T J',
    'NOT C T',
    'OR T J',
    'AND D J',
    'WALK',
  ])
}

function resolvePart2(program: number[]) {
  // As part 1, but only jump if we can then step or jump again: (E OR H).
  return runSpringscript(program, [
    'NOT A J',
    'NOT B T',
    'OR T J',
    'NOT C T',
    'OR T J',
    'AND D J',
    'NOT E T',
    'NOT T T',
    'OR H T',
    'AND T J',
    'RUN',
  ])
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
