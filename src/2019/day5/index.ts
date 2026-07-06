import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function diagnostic(program: number[], input: number): number {
  const vm = new Intcode(program)
  const outputs = vm.runWith(input)
  return outputs[outputs.length - 1]
}

function resolvePart1(program: number[]) {
  return diagnostic(program, 1)
}

function resolvePart2(program: number[]) {
  return diagnostic(program, 5)
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
