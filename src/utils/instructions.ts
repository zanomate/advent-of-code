export type BasicMemory = Record<string, number>

export interface InstructionSpec<Memory = BasicMemory> {
  name: string
  match: RegExp
  fn: (args: string[], env: ExecutionEnv<Memory>) => ExecutionEnv<Memory>
}

export interface Instruction {
  name: string
  args: string[]
}

export type Program = Instruction[]

export interface ExecutionEnv<Memory = BasicMemory> {
  program: Program
  cursor: number
  memory: Memory
  out: string[]
}

export class Computer<Memory = BasicMemory> {
  protected specs: Record<string, InstructionSpec<Memory>> = {}

  constructor(specs: InstructionSpec<Memory>[]) {
    specs.forEach((spec) => {
      this.specs[spec.name] = spec
    })
  }

  parseInstruction(line: string): Instruction | null {
    for (const spec of Object.values(this.specs)) {
      const match = line.match(spec.match)
      if (match) {
        return {
          name: spec.name,
          args: match.slice(1),
        }
      }
    }
    return null
  }

  parseProgram(lines: string[]): Program {
    return lines.map((line) => this.parseInstruction(line)) as Program
  }

  run(program: string[], initialMemory: Memory): ExecutionEnv<Memory> {
    let env: ExecutionEnv<Memory> = {
      program: this.parseProgram(program),
      cursor: 0,
      memory: initialMemory,
      out: [],
    }
    while (env.cursor < env.program.length) {
      const instruction = env.program[env.cursor]
      debugger
      const spec = this.specs[instruction.name]
      env = spec.fn(instruction.args, env)
    }
    return env
  }
}

export const isRegistry = (value: string): boolean => /^[a-z]$/.test(value)

export const isValue = (value: string): boolean => /^[+-]?[0-9]+$/.test(value)
