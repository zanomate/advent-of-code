import { InstructionSpec, isRegistry, isValue } from '../../utils/instructions'

export const assembunnySpecs: InstructionSpec[] = [
  {
    name: 'cpy',
    match: /cpy (.+) (.+)/,
    fn: ([src, dest], env) => {
      if (isRegistry(dest)) {
        env.memory[dest] = isValue(src) ? Number(src) : env.memory[src]
      }
      env.moveCursor()
      return env
    },
  },
  {
    name: 'inc',
    match: /inc (.+)/,
    fn: ([reg], env) => {
      if (isRegistry(reg)) {
        env.memory[reg]++
      }
      env.moveCursor()
      return env
    },
  },
  {
    name: 'dec',
    match: /dec (.+)/,
    fn: ([reg], env) => {
      if (isRegistry(reg)) {
        env.memory[reg]--
      }
      env.moveCursor()
      return env
    },
  },
  {
    name: 'jnz',
    match: /jnz (.+) (.+)/,
    fn: ([cond, val], env) => {
      const condition = isValue(cond) ? Number(cond) : env.memory[cond]
      const offset = isValue(val) ? Number(val) : env.memory[val]
      env.moveCursor(condition !== 0 ? offset : 1)
      return env
    },
  },
]
