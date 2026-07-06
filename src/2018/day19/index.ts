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

// Run the program to completion, optionally stopping early after maxSteps.
// The instruction pointer lives in a local variable; the bound register is
// synced before each instruction. The final increment is not written back, so
// the bound register holds the last executed address at halt.
function run(program: Program, regs: Registers, maxSteps = Infinity): Registers {
  const { ipReg, instructions } = program
  let ip = regs[ipReg]
  let steps = 0
  while (ip >= 0 && ip < instructions.length && steps < maxSteps) {
    regs[ipReg] = ip
    const { name, a, b, c } = instructions[ip]
    regs[c] = OPS[name](regs, a, b)
    ip = regs[ipReg] + 1
    steps++
  }
  return regs
}

function sumOfDivisors(n: number): number {
  let total = 0
  for (let i = 1; i * i <= n; i++) {
    if (n % i !== 0) continue
    total += i
    if (i !== n / i) total += n / i
  }
  return total
}

function resolvePart1(program: Program): PartSolution {
  return run(program, [0, 0, 0, 0, 0, 0])[0]
}

// With register 0 = 1 the program computes the sum of divisors of a large
// number that it builds during setup. Running it directly is astronomically
// slow, so run only the setup phase and read the target number off the
// registers, then compute the sum of divisors directly.
function resolvePart2(program: Program): PartSolution {
  const regs = run(program, [1, 0, 0, 0, 0, 0], 1000)
  const target = Math.max(...regs)
  return sumOfDivisors(target)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())
  const program = parse(input)

  const t0 = performance.now()

  const part1 = resolvePart1(program)
  const part2 = program.instructions.length > 7 ? resolvePart2(program) : null

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
