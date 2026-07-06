import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function resolvePart1(program: number[]) {
  const vm = new Intcode(program)
  const outputs = vm.runWith()
  let blocks = 0
  for (let i = 0; i < outputs.length; i += 3) {
    if (outputs[i + 2] === 2) blocks++
  }
  return blocks
}

function resolvePart2(program: number[]) {
  const vm = new Intcode(program)
  vm.mem[0] = 2
  let score = 0
  let ballX = 0
  let paddleX = 0

  while (!vm.halted) {
    vm.run()
    const outputs = vm.drainOutputs()
    for (let i = 0; i < outputs.length; i += 3) {
      const [x, y, value] = [outputs[i], outputs[i + 1], outputs[i + 2]]
      if (x === -1 && y === 0) score = value
      else if (value === 3) paddleX = x
      else if (value === 4) ballX = x
    }
    vm.pushInput(Math.sign(ballX - paddleX))
  }
  return score
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
