import { last } from 'lodash'
import { Computer, isRegistry } from '../../utils/computer/instructions'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { assembunnySpecs } from '../day12/assembunny-specs'

const THRESHOLD = 10000

const computer = new Computer([
  ...assembunnySpecs,
  {
    name: 'out',
    match: /out (.+)/,
    fn: ([src], env) => {
      const value = isRegistry(src) ? env.memory[src].toString() : src
      const lastOut = last(env.out)
      if (lastOut !== undefined && lastOut === value) throw new Error()
      env.print(value)
      env.moveCursor()
      if (env.out.length > THRESHOLD) env.halt()
      return env
    },
  },
])

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const program = input.split('\n')

  const t0 = performance.now()

  let a = 0
  let found = false
  while (!found) {
    try {
      const exec = computer.load(program, { a, b: 0, c: 0, d: 0 })
      exec.run()
      found = true
    } catch (error) {
      a++
    }
  }

  const part1 = a

  const part2 = null

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
