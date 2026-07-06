import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

type Registers = number[]
type Op = (r: Registers, a: number, b: number) => number

const OPS: Record<string, Op> = {
  addr: (r, a, b) => r[a] + r[b],
  addi: (r, a, b) => r[a] + b,
  mulr: (r, a, b) => r[a] * r[b],
  muli: (r, a, b) => r[a] * b,
  banr: (r, a, b) => r[a] & r[b],
  bani: (r, a, b) => r[a] & b,
  borr: (r, a, b) => r[a] | r[b],
  bori: (r, a, b) => r[a] | b,
  setr: (r, a) => r[a],
  seti: (_r, a) => a,
  gtir: (r, a, b) => (a > r[b] ? 1 : 0),
  gtri: (r, a, b) => (r[a] > b ? 1 : 0),
  gtrr: (r, a, b) => (r[a] > r[b] ? 1 : 0),
  eqir: (r, a, b) => (a === r[b] ? 1 : 0),
  eqri: (r, a, b) => (r[a] === b ? 1 : 0),
  eqrr: (r, a, b) => (r[a] === r[b] ? 1 : 0),
}

interface Instruction {
  name: string
  a: number
  b: number
  c: number
}

interface Program {
  ipReg: number
  instructions: Instruction[]
}

function parse(input: string): Program {
  const lines = input.split('\n')
  const ipReg = Number(lines[0].match(/\d+/)![0])
  const instructions = lines.slice(1).map((line) => {
    const [name, a, b, c] = line.split(' ')
    return { name, a: Number(a), b: Number(b), c: Number(c) }
  })
  return { ipReg, instructions }
}

// The program halts only when register 0 equals the value produced at the
// single `eqrr` instruction that references register 0. Setting register 0 to a
// value that never matches lets us observe every candidate the program checks:
// the first is the value that halts fastest, the last distinct one (before the
// sequence repeats) is the value that halts slowest.
function solve({ ipReg, instructions }: Program): [number, number] {
  const cmp = instructions.findIndex((i) => i.name === 'eqrr' && (i.a === 0 || i.b === 0))
  const watch = instructions[cmp].a === 0 ? instructions[cmp].b : instructions[cmp].a

  const regs: Registers = [0, 0, 0, 0, 0, 0]
  const seen = new Set<number>()
  let first = -1
  let last = -1
  let ip = 0

  while (ip >= 0 && ip < instructions.length) {
    if (ip === cmp) {
      const value = regs[watch]
      if (first === -1) first = value
      if (seen.has(value)) break
      seen.add(value)
      last = value
    }
    regs[ipReg] = ip
    const { name, a, b, c } = instructions[ip]
    regs[c] = OPS[name](regs, a, b)
    ip = regs[ipReg] + 1
  }

  return [first, last]
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())
  if (input.length === 0) return [null, null, 0]
  const program = parse(input)

  const t0 = performance.now()

  const [part1, part2] = solve(program) as [PartSolution, PartSolution]

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
