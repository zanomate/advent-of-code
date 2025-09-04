export type BasicMemory = Record<string, any>

export interface InstructionSpec<Memory = BasicMemory> {
  name: string
  match: RegExp
  fn: (args: string[], env: ExecutionEnv<Memory>) => void
}

export interface Instruction {
  name: string
  args: string[]
}

export type Program = Instruction[]

export class ExecutionEnv<Memory = BasicMemory> {
  readonly specs: Record<string, InstructionSpec<Memory>> = {}
  readonly program: Program

  memory: Memory
  out: string[] = []

  private _running: boolean = false
  private _cursor: number = 0

  constructor(specs: Record<string, InstructionSpec<Memory>>, program: Program, memory: Memory) {
    this.specs = specs
    this.program = program
    this.memory = memory
  }

  get running() {
    return this._running
  }

  run() {
    this._running = true
    while (this.running && this.cursor < this.program.length) {
      const instruction = this.program[this.cursor]
      const spec = this.specs[instruction.name]
      spec.fn(instruction.args, this)
    }
    return this
  }

  halt() {
    this._running = false
    return this
  }

  get cursor() {
    return this._cursor
  }

  moveCursor(lines: number = 1) {
    this._cursor += lines
    return this
  }

  print(output: any) {
    this.out.push(String(output))
    return this
  }
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

  load(program: string[], initialMemory: Memory): ExecutionEnv<Memory> {
    const parsedProgram = this.parseProgram(program)
    return new ExecutionEnv(this.specs, parsedProgram, initialMemory)
  }
}

export const isRegistry = (value: string): boolean => /^[a-z]$/.test(value)

export const isValue = (value: string): boolean => /^[+-]?[0-9]+$/.test(value)

export const getParameterValue = <Memory extends BasicMemory = BasicMemory>(
  parameter: string,
  memory: Memory,
) => {
  if (isValue(parameter)) return Number(parameter)
  if (isRegistry(parameter) && parameter in memory) return memory[parameter]
  return null
}
