import { getParameterValue, InstructionSpec } from '../../utils/computer/instructions'

export const specs: InstructionSpec[] = [
  {
    name: 'set',
    match: /set (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] = getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
    },
  },
  {
    name: 'sub',
    match: /sub (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] -= getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
    },
  },
  {
    name: 'mul',
    match: /mul (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory.mulCounts = (env.memory.mulCounts || 0) + 1
      env.memory[param1] *= getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
    },
  },
  {
    name: 'jnz',
    match: /jnz (.+) (.+)/,
    fn: ([param1, param2], env) => {
      if (getParameterValue(param1, env.memory) !== 0) {
        env.moveCursor(getParameterValue(param2, env.memory) || 0)
      } else {
        env.moveCursor()
      }
    },
  },
]
