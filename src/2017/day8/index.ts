import { Computer, ExecutionEnv, InstructionSpec } from '../../utils/instructions'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

const RESERVED_REG = '__reserved__'

const verifyCondition = (condition: string, env: ExecutionEnv): boolean => {
  const match = condition.match(/(.+) (.+) (.+)/)
  if (!match) throw new Error(`Cannot parse condition ${condition}`)
  const [, reg, operator, value] = match
  const regValue = env.memory[reg] || 0
  const expectedValue = parseInt(value)
  switch (operator) {
    case '==':
      return regValue === expectedValue
    case '!=':
      return regValue != expectedValue
    case '<=':
      return regValue <= expectedValue
    case '>=':
      return regValue >= expectedValue
    case '<':
      return regValue < expectedValue
    case '>':
      return regValue > expectedValue
    default:
      return false
  }
}

const specs: InstructionSpec[] = [
  {
    name: 'inc',
    match: /(.+) inc (.+) if (.+)/,
    fn: ([reg, amount, condition], env) => {
      if (verifyCondition(condition, env)) {
        const prevValue = env.memory[reg] || 0
        const nextValue = prevValue + parseInt(amount)
        env.memory[reg] = nextValue
        env.memory[RESERVED_REG] = Math.max(env.memory[RESERVED_REG] || -Infinity, nextValue)
      }
      env.cursor++
      return env
    },
  },
  {
    name: 'dec',
    match: /(.+) dec (.+) if (.+)/,
    fn: ([reg, amount, condition], env) => {
      if (verifyCondition(condition, env)) {
        const prevValue = env.memory[reg] || 0
        const nextValue = prevValue - parseInt(amount)
        env.memory[reg] = nextValue
        env.memory[RESERVED_REG] = Math.max(env.memory[RESERVED_REG] || -Infinity, nextValue)
      }
      env.cursor++
      return env
    },
  },
]

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  const computer = new Computer(specs)
  const memory: Record<string, number> = {}

  const t0 = performance.now()

  const execution = computer.run(lines, memory)
  const regs = Object.keys(execution.memory).filter((k) => k !== RESERVED_REG)

  const part1 = Math.max(...regs.map((r) => execution.memory[r]))

  const part2 = execution.memory[RESERVED_REG]

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
