import { Computer } from '../../utils/computer/instructions'
import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'
import { OP_NAMES, opcodeSpecs, Registers } from './opcodes'

const computer = new Computer<Registers>(opcodeSpecs)

const equal = (a: Registers, b: Registers): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i])

// Run a single opcode (by name) against a register state via the computer.
function apply(name: string, before: Registers, a: number, b: number, c: number): Registers {
  return computer.load([`${name} ${a} ${b} ${c}`], [...before]).run().memory
}

interface Sample {
  before: Registers
  instruction: number[]
  after: Registers
}

interface Input {
  samples: Sample[]
  program: number[][]
}

const numbers = (line: string): number[] => (line.match(/-?\d+/g) ?? []).map(Number)

function parse(input: string): Input {
  const [sampleBlock, programBlock = ''] = input.split('\n\n\n')

  const samples: Sample[] = []
  for (const block of sampleBlock.split('\n\n')) {
    if (!block.includes('Before')) continue
    const [beforeLine, instructionLine, afterLine] = block.trim().split('\n')
    samples.push({
      before: numbers(beforeLine),
      instruction: numbers(instructionLine),
      after: numbers(afterLine),
    })
  }

  const program = programBlock
    .trim()
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map(numbers)

  return { samples, program }
}

// Op names whose result on the sample's before-state matches the after-state.
function matchingOps({ before, instruction, after }: Sample): string[] {
  const [, a, b, c] = instruction
  return OP_NAMES.filter((name) => equal(apply(name, before, a, b, c), after))
}

function resolvePart1({ samples }: Input): PartSolution {
  return samples.filter((sample) => matchingOps(sample).length >= 3).length
}

function resolvePart2({ samples, program }: Input): PartSolution {
  // For every opcode number, intersect the candidate op names across samples.
  const candidates = new Map<number, Set<string>>()
  for (const sample of samples) {
    const opcode = sample.instruction[0]
    const matches = new Set(matchingOps(sample))
    const current = candidates.get(opcode)
    if (!current) {
      candidates.set(opcode, matches)
    } else {
      for (const name of current) if (!matches.has(name)) current.delete(name)
    }
  }

  // Constraint propagation: assign opcodes that have a single candidate left.
  const mapping = new Map<number, string>()
  while (mapping.size < candidates.size) {
    for (const [opcode, names] of candidates) {
      if (mapping.has(opcode) || names.size !== 1) continue
      const name = [...names][0]
      mapping.set(opcode, name)
      for (const other of candidates.values()) other.delete(name)
    }
  }

  const lines = program.map(([op, a, b, c]) => `${mapping.get(op)} ${a} ${b} ${c}`)
  return computer.load(lines, [0, 0, 0, 0]).run().memory[0]
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) =>
    text.replace(/\r\n/g, '\n').replace(/\n+$/, ''),
  )
  const parsed = parse(input)

  const t0 = performance.now()

  const part1 = resolvePart1(parsed)
  const part2 = parsed.program.length > 0 ? resolvePart2(parsed) : null

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
