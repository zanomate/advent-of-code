import { BasicMemory, getParameterValue, InstructionSpec } from '../../utils/instructions'

export type DuetMemory = BasicMemory & {
  p: number
  queueIn: number[]
  queueOut: number[]
}

export const duetSpecsV2: InstructionSpec<DuetMemory>[] = [
  {
    name: 'send',
    match: /snd (.+)/,
    fn: ([param], env) => {
      env.memory.sendCount = (env.memory.sendCount || 0) + 1
      env.memory.queueOut.push(getParameterValue(param, env.memory) || 0)
      env.moveCursor()
    },
  },
  {
    name: 'recover',
    match: /rcv (.+)/,
    fn: ([param], env) => {
      if (env.memory.queueIn.length > 0) {
        env.memory[param] = env.memory.queueIn.shift()!
        env.moveCursor()
      } else {
        env.halt()
      }
    },
  },
  {
    name: 'set',
    match: /set (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] = getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
    },
  },
  {
    name: 'add',
    match: /add (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] += getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
    },
  },
  {
    name: 'mul',
    match: /mul (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] *= getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
    },
  },
  {
    name: 'mod',
    match: /mod (.+) (.+)/,
    fn: ([param1, param2], env) => {
      env.memory[param1] %= getParameterValue(param2, env.memory) || 0!
      env.moveCursor()
    },
  },
  {
    name: 'jump',
    match: /jgz (.+) (.+)/,
    fn: ([param1, param2], env) => {
      if (getParameterValue(param1, env.memory) > 0) {
        env.moveCursor(getParameterValue(param2, env.memory) || 0)
      } else {
        env.moveCursor()
      }
    },
  },
]
