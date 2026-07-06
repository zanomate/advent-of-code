import { InstructionSpec } from '../../utils/computer/instructions'

// Registers are the machine's memory: a 4-element array indexed by number.
export type Registers = number[]

// Each opcode is `name a b c`. a/b are register indices or immediate values
// depending on the opcode; c is always the destination register.
const opcode = (
  name: string,
  compute: (r: Registers, a: number, b: number, c: number) => number,
): InstructionSpec<Registers> => ({
  name,
  match: new RegExp(`${name} (\\d+) (\\d+) (\\d+)`),
  fn: ([a, b, c], env) => {
    const r = env.memory
    r[Number(c)] = compute(r, Number(a), Number(b), Number(c))
    env.moveCursor()
  },
})

export const opcodeSpecs: InstructionSpec<Registers>[] = [
  opcode('addr', (r, a, b) => r[a] + r[b]),
  opcode('addi', (r, a, b) => r[a] + b),
  opcode('mulr', (r, a, b) => r[a] * r[b]),
  opcode('muli', (r, a, b) => r[a] * b),
  opcode('banr', (r, a, b) => r[a] & r[b]),
  opcode('bani', (r, a, b) => r[a] & b),
  opcode('borr', (r, a, b) => r[a] | r[b]),
  opcode('bori', (r, a, b) => r[a] | b),
  opcode('setr', (r, a) => r[a]),
  opcode('seti', (_r, a) => a),
  opcode('gtir', (r, a, b) => (a > r[b] ? 1 : 0)),
  opcode('gtri', (r, a, b) => (r[a] > b ? 1 : 0)),
  opcode('gtrr', (r, a, b) => (r[a] > r[b] ? 1 : 0)),
  opcode('eqir', (r, a, b) => (a === r[b] ? 1 : 0)),
  opcode('eqri', (r, a, b) => (r[a] === b ? 1 : 0)),
  opcode('eqrr', (r, a, b) => (r[a] === r[b] ? 1 : 0)),
]

export const OP_NAMES = opcodeSpecs.map((spec) => spec.name)
