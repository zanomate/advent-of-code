import { readFile } from '../../utils/io'
import { Dir, turnLeft, turnRight } from '../../utils/space/Dir'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'
import { Intcode } from '../intcode/Intcode'

function renderScaffold(program: number[]): string[] {
  const vm = new Intcode(program)
  const output = vm
    .runWith()
    .map((c) => String.fromCharCode(c))
    .join('')
  return output.trim().split('\n')
}

function scaffoldSet(grid: string[]): Set<string> {
  const set = new Set<string>()
  grid.forEach((row, y) =>
    row.split('').forEach((cell, x) => {
      if (cell !== '.') set.add(p(x, y).toString())
    }),
  )
  return set
}

function resolvePart1(grid: string[]) {
  const scaffold = scaffoldSet(grid)
  let sum = 0
  for (const key of scaffold) {
    const pos = Pos.fromString(key)
    if (pos.neighbours().every((n) => scaffold.has(n.toString()))) sum += pos.x * pos.y
  }
  return sum
}

const DIR_CHARS: Record<string, Dir> = {
  '^': Dir.UP,
  '>': Dir.RIGHT,
  v: Dir.DOWN,
  '<': Dir.LEFT,
}

/** Walk the scaffold end to end, producing turn/move tokens. */
function buildPath(grid: string[]): string[] {
  const scaffold = scaffoldSet(grid)
  let pos = p(0, 0)
  let dir = Dir.UP
  grid.forEach((row, y) =>
    row.split('').forEach((cell, x) => {
      if (cell in DIR_CHARS) {
        pos = p(x, y)
        dir = DIR_CHARS[cell]
      }
    }),
  )

  const path: string[] = []
  while (true) {
    const left = turnLeft(dir)
    const right = turnRight(dir)
    let turn: string
    if (scaffold.has(pos.shift(left).toString())) {
      turn = 'L'
      dir = left
    } else if (scaffold.has(pos.shift(right).toString())) {
      turn = 'R'
      dir = right
    } else break

    let steps = 0
    while (scaffold.has(pos.shift(dir).toString())) {
      pos = pos.shift(dir)
      steps++
    }
    path.push(turn, String(steps))
  }
  return path
}

type Compression = { main: string[]; funcs: string[][] }

/** Split a movement sequence into a main routine plus up to three reusable functions. */
function compress(seq: string[]): Compression | null {
  const withinLimit = (tokens: string[]) => tokens.join(',').length <= 20

  const collect = (remaining: string[], funcs: string[][]): Compression | null => {
    if (remaining.length === 0) return withinLimit([]) ? { main: [], funcs } : null
    for (let i = 0; i < funcs.length; i++) {
      const func = funcs[i]
      if (func.length <= remaining.length && func.every((t, k) => t === remaining[k])) {
        const rest = collect(remaining.slice(func.length), funcs)
        if (rest) return { main: [String.fromCharCode(65 + i), ...rest.main], funcs: rest.funcs }
      }
    }
    if (funcs.length < 3) {
      for (let len = 1; len <= remaining.length; len++) {
        const candidate = remaining.slice(0, len)
        if (!withinLimit(candidate)) break
        const rest = collect(remaining.slice(len), [...funcs, candidate])
        if (rest) {
          return {
            main: [String.fromCharCode(65 + funcs.length), ...rest.main],
            funcs: rest.funcs,
          }
        }
      }
    }
    return null
  }

  const result = collect(seq, [])
  if (result && withinLimit(result.main)) return result
  return null
}

function resolvePart2(program: number[], grid: string[]) {
  const path = buildPath(grid)
  const compression = compress(path)!
  const vm = new Intcode(program)
  vm.mem[0] = 2
  vm.pushLine(compression.main.join(','))
  for (let i = 0; i < 3; i++) {
    vm.pushLine((compression.funcs[i] ?? []).join(','))
  }
  vm.pushLine('n')
  const outputs = vm.runWith()
  return outputs[outputs.length - 1]
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const program = Intcode.parse(input)
  const grid = renderScaffold(program)

  const t0 = performance.now()

  let part1 = resolvePart1(grid)
  let part2 = resolvePart2(program, grid)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
