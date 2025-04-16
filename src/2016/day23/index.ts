import { Computer, isRegistry } from '../../utils/instructions'
import { readFile } from '../../utils/io'
import { factorial } from '../../utils/math'
import { DaySolution } from '../../utils/type'
import { assembunnySpecs } from '../day12/assembunny-specs'

const computer = new Computer([
  ...assembunnySpecs,
  {
    name: 'tgl',
    match: /tgl (.+)/,
    fn: ([reg], env) => {
      if (isRegistry(reg)) {
        const offset = Number(env.memory[reg])
        const instr = env.program[env.cursor + offset]
        if (instr) {
          switch (instr.name) {
            case 'inc':
              instr.name = 'dec'
              break
            case 'dec':
              instr.name = 'inc'
              break
            case 'jnz':
              instr.name = 'cpy'
              break
            case 'cpy':
              instr.name = 'jnz'
              break
            default:
              instr.name = 'inc'
          }
        }
      }
      env.cursor++
      return env
    },
  },
])

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const program = input.split('\n')

  const t0 = performance.now()

  const memory = computer.run(program, { a: 7, b: 0, c: 0, d: 0 }).memory

  const part1 = memory['a']

  const c = memory['a'] - factorial(7)

  const part2 = factorial(12) + c

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
