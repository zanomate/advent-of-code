import { readFile } from '../../utils/io'
import { Dir, turnLeft, turnRight } from '../../utils/space/Dir'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function paint(program: number[], startColor: number): Map<string, number> {
  const vm = new Intcode(program)
  const panels = new Map<string, number>()
  let pos = p(0, 0)
  let dir: Dir = Dir.UP
  panels.set(pos.toString(), startColor)

  while (!vm.halted) {
    vm.pushInput(panels.get(pos.toString()) ?? 0)
    vm.run()
    const outputs = vm.drainOutputs()
    if (outputs.length < 2) break
    const [color, turn] = outputs
    panels.set(pos.toString(), color)
    dir = turn === 0 ? turnLeft(dir) : turnRight(dir)
    pos = pos.shift(dir)
  }
  return panels
}

function resolvePart1(program: number[]) {
  return paint(program, 0).size
}

function resolvePart2(program: number[]) {
  const panels = paint(program, 1)
  const white = [...panels.entries()]
    .filter(([, color]) => color === 1)
    .map(([key]) => Pos.fromString(key))
  const minX = Math.min(...white.map((q) => q.x))
  const maxX = Math.max(...white.map((q) => q.x))
  const minY = Math.min(...white.map((q) => q.y))
  const maxY = Math.max(...white.map((q) => q.y))
  const painted = new Set(white.map((q) => q.toString()))
  const rows: string[] = []
  for (let y = minY; y <= maxY; y++) {
    let row = ''
    for (let x = minX; x <= maxX; x++) row += painted.has(p(x, y).toString()) ? '#' : ' '
    rows.push(row)
  }
  const rendered = rows.join('\n')
  console.log(rendered)
  return rendered
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
