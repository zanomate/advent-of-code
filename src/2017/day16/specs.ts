import { InstructionSpec } from '../../utils/computer/instructions'

function rotateChars(str: string, n: number) {
  let len = str.length
  if (len === 0) return str
  n = ((n % len) + len) % len
  return str.slice(-n) + str.slice(0, len - n)
}

function swapChars(str: string, i: number, j: number) {
  if (i === j) return str
  let arr = str.split('')
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
  return arr.join('')
}

export const specs: InstructionSpec<string>[] = [
  {
    name: 'spin',
    match: /s(.+)/,
    fn: ([num], env) => {
      env.memory = rotateChars(env.memory, Number(num))
      env.moveCursor()
      return env
    },
  },
  {
    name: 'exchange',
    match: /x(.+)\/(.+)/,
    fn: ([num1, num2], env) => {
      const index1 = Number(num1)
      const index2 = Number(num2)
      env.memory = swapChars(env.memory, index1, index2)
      env.moveCursor()
      return env
    },
  },
  {
    name: 'partner',
    match: /p(.+)\/(.+)/,
    fn: ([name1, name2], env) => {
      const index1 = env.memory.indexOf(name1)
      const index2 = env.memory.indexOf(name2)
      env.memory = swapChars(env.memory, index1, index2)
      env.moveCursor()
      return env
    },
  },
]
