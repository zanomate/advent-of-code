/**
 * Intcode virtual machine, shared across all 2019 Intcode-based days.
 *
 * Supports opcodes 1,2 (add/mul), 3 (input), 4 (output), 5,6 (jump-if-true/false),
 * 7,8 (less-than/equals), 9 (adjust relative base), 99 (halt).
 * Parameter modes: 0 position, 1 immediate, 2 relative.
 */
export type RunStatus = 'halted' | 'awaiting-input'

export class Intcode {
  mem: number[]
  ip = 0
  relativeBase = 0
  inputs: number[] = []
  outputs: number[] = []
  halted = false

  constructor(program: number[]) {
    this.mem = [...program]
  }

  static parse(input: string): number[] {
    return input
      .trim()
      .split(',')
      .map((n) => Number(n))
  }

  clone(): Intcode {
    const c = new Intcode(this.mem)
    c.ip = this.ip
    c.relativeBase = this.relativeBase
    c.inputs = [...this.inputs]
    c.outputs = [...this.outputs]
    c.halted = this.halted
    return c
  }

  pushInput(...values: number[]): void {
    this.inputs.push(...values)
  }

  /** Push each character code, used for ASCII Intcode programs. */
  pushLine(line: string): void {
    for (const ch of line) this.inputs.push(ch.charCodeAt(0))
    this.inputs.push(10)
  }

  /** Consume and return all pending outputs. */
  drainOutputs(): number[] {
    const out = this.outputs
    this.outputs = []
    return out
  }

  private read(addr: number): number {
    return this.mem[addr] ?? 0
  }

  private write(addr: number, value: number): void {
    this.mem[addr] = value
  }

  private paramAddr(offset: number, mode: number): number {
    switch (mode) {
      case 0:
        return this.read(this.ip + offset)
      case 2:
        return this.relativeBase + this.read(this.ip + offset)
      default:
        throw new Error(`Invalid address mode ${mode}`)
    }
  }

  private paramValue(offset: number, mode: number): number {
    if (mode === 1) return this.read(this.ip + offset)
    return this.read(this.paramAddr(offset, mode))
  }

  /** Run until halt or until an input is needed with an empty input queue. */
  run(): RunStatus {
    while (true) {
      const instruction = this.read(this.ip)
      const opcode = instruction % 100
      const m1 = Math.floor(instruction / 100) % 10
      const m2 = Math.floor(instruction / 1000) % 10
      const m3 = Math.floor(instruction / 10000) % 10

      switch (opcode) {
        case 1:
          this.write(this.paramAddr(3, m3), this.paramValue(1, m1) + this.paramValue(2, m2))
          this.ip += 4
          break
        case 2:
          this.write(this.paramAddr(3, m3), this.paramValue(1, m1) * this.paramValue(2, m2))
          this.ip += 4
          break
        case 3:
          if (this.inputs.length === 0) return 'awaiting-input'
          this.write(this.paramAddr(1, m1), this.inputs.shift()!)
          this.ip += 2
          break
        case 4:
          this.outputs.push(this.paramValue(1, m1))
          this.ip += 2
          break
        case 5:
          this.ip = this.paramValue(1, m1) !== 0 ? this.paramValue(2, m2) : this.ip + 3
          break
        case 6:
          this.ip = this.paramValue(1, m1) === 0 ? this.paramValue(2, m2) : this.ip + 3
          break
        case 7:
          this.write(this.paramAddr(3, m3), this.paramValue(1, m1) < this.paramValue(2, m2) ? 1 : 0)
          this.ip += 4
          break
        case 8:
          this.write(
            this.paramAddr(3, m3),
            this.paramValue(1, m1) === this.paramValue(2, m2) ? 1 : 0,
          )
          this.ip += 4
          break
        case 9:
          this.relativeBase += this.paramValue(1, m1)
          this.ip += 2
          break
        case 99:
          this.halted = true
          return 'halted'
        default:
          throw new Error(`Unknown opcode ${opcode} at ip ${this.ip}`)
      }
    }
  }

  /** Run feeding the given inputs, returning all outputs produced until halt. */
  runWith(...inputs: number[]): number[] {
    this.pushInput(...inputs)
    this.run()
    return this.drainOutputs()
  }
}
