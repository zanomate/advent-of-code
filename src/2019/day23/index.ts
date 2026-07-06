import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function bootNetwork(program: number[]): Intcode[] {
  return Array.from({ length: 50 }, (_, address) => {
    const vm = new Intcode(program)
    vm.pushInput(address)
    return vm
  })
}

function resolvePart1(program: number[]) {
  const computers = bootNetwork(program)
  while (true) {
    for (const vm of computers) {
      if (vm.inputs.length === 0) vm.pushInput(-1)
      vm.run()
      const outputs = vm.drainOutputs()
      for (let i = 0; i < outputs.length; i += 3) {
        const [dest, x, y] = [outputs[i], outputs[i + 1], outputs[i + 2]]
        if (dest === 255) return y
        computers[dest].pushInput(x, y)
      }
    }
  }
}

function resolvePart2(program: number[]) {
  const computers = bootNetwork(program)
  let nat: [number, number] | null = null
  let lastDelivered: number | null = null

  while (true) {
    let idle = true
    for (const vm of computers) {
      if (vm.inputs.length === 0) vm.pushInput(-1)
      else idle = false
      vm.run()
      const outputs = vm.drainOutputs()
      if (outputs.length > 0) idle = false
      for (let i = 0; i < outputs.length; i += 3) {
        const [dest, x, y] = [outputs[i], outputs[i + 1], outputs[i + 2]]
        if (dest === 255) nat = [x, y]
        else computers[dest].pushInput(x, y)
      }
    }
    if (idle && nat) {
      const [x, y] = nat
      if (y === lastDelivered) return y
      lastDelivered = y
      computers[0].pushInput(x, y)
    }
  }
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
