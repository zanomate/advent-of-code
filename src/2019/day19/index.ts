import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function makeBeam(program: number[]): (x: number, y: number) => boolean {
  const cache = new Map<string, boolean>()
  return (x: number, y: number) => {
    const key = `${x},${y}`
    if (cache.has(key)) return cache.get(key)!
    const vm = new Intcode(program)
    const pulled = vm.runWith(x, y)[0] === 1
    cache.set(key, pulled)
    return pulled
  }
}

function resolvePart1(beam: (x: number, y: number) => boolean) {
  let count = 0
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      if (beam(x, y)) count++
    }
  }
  return count
}

function resolvePart2(beam: (x: number, y: number) => boolean) {
  const size = 100
  let x = 0
  for (let y = size - 1; ; y++) {
    while (!beam(x, y)) x++
    if (beam(x + size - 1, y - size + 1)) return x * 10000 + (y - size + 1)
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const program = Intcode.parse(input)
  const beam = makeBeam(program)

  const t0 = performance.now()

  let part1 = resolvePart1(beam)
  let part2 = resolvePart2(beam)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
