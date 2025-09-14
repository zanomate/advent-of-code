import { getParameterValue, InstructionSpec } from '../../utils/computer/instructions'

export const duetSpecsV1: InstructionSpec[] = [
  {
    name: 'send',
    match: /snd (.+)/,
    fn: ([param], env) => {
      env.memory.sound = getParameterValue(param, env.memory) || 0!
      env.moveCursor()
      return env
    },
  },
  {
    name: 'recover',
    match: /rcv (.+)/,
    fn: ([param], env) => {
      if (env.memory[param]) {
        env.print(env.memory.sound)
        env.halt()
      }
      env.moveCursor()
      return env
    },
  },
  {
    name: 'set',
    match: /set (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] = getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
      return env
    },
  },
  {
    name: 'add',
    match: /add (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] += getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
      return env
    },
  },
  {
    name: 'mul',
    match: /mul (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] *= getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
      return env
    },
  },
  {
    name: 'mod',
    match: /mod (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] %= getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
      return env
    },
  },
  {
    name: 'jump',
    match: /jgz (.+) (.+)/,
    fn: ([param1, param2], env) => {
      if (env.memory[param1]) {
        env.moveCursor(getParameterValue(param2, env.memory) || 0)
      } else {
        env.moveCursor()
      }
      return env
    },
  },
]
