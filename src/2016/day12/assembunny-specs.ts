import { InstructionSpec, isRegistry, isValue } from '../../utils/instructions'

export const assembunnySpecs: InstructionSpec[] = [
  {
    name: 'cpy',
    match: /cpy (.+) (.+)/,
    fn: ([src, dest], env) => {
      if (isRegistry(dest)) {
        env.memory[dest] = isValue(src) ? Number(src) : env.memory[src]
      }
      env.cursor++
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
      env.cursor++
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
      env.cursor++
      return env
    },
  },
  {
    name: 'jnz',
    match: /jnz (.+) (.+)/,
    fn: ([cond, val], env) => {
      const condition = isValue(cond) ? Number(cond) : env.memory[cond]
      const offset = isValue(val) ? Number(val) : env.memory[val]
      env.cursor += condition !== 0 ? offset : 1
      return env
    },
  },
]
