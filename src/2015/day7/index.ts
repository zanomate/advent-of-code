import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const commands = input.split('\n')

  const t0 = performance.now()

  const execCommands = (commands: string[]): Map<string, number> => {
    const values = new Map<string, number>()
    const queue = [...commands]

    const getValue = (str: string): number | undefined => {
      if (/\d+/.test(str)) return parseInt(str)
      return values.get(str)
    }

    while (queue.length) {
      const command = queue.shift()!
      const [expr, dest] = command.split(' -> ')

      const assignMatch = expr.match(/^\w+$/)
      if (assignMatch) {
        const value = getValue(assignMatch[0])
        if (value === undefined) {
          queue.push(command)
          continue
        }
        values.set(dest, value)
        continue
      }

      const negateMatch = expr.match(/^NOT (\w+)$/)
      if (negateMatch) {
        const value = getValue(negateMatch[1])
        if (value === undefined) {
          queue.push(command)
          continue
        }
        values.set(dest, ~value & 0xffff)
        continue
      }

      const leftShiftMatch = expr.match(/^(\w+) LSHIFT (\w+)$/)
      if (leftShiftMatch) {
        const left = getValue(leftShiftMatch[1])
        const right = getValue(leftShiftMatch[2])
        if (left === undefined || right === undefined) {
          queue.push(command)
          continue
        }
        values.set(dest, left << right)
        continue
      }

      const rightShiftMatch = expr.match(/^(\w+) RSHIFT (\d+)$/)
      if (rightShiftMatch) {
        const left = getValue(rightShiftMatch[1])
        const right = getValue(rightShiftMatch[2])
        if (left === undefined || right === undefined) {
          queue.push(command)
          continue
        }
        values.set(dest, left >> right)
        continue
      }

      const [wireA, op, wireB] = expr.split(' ')
      const left = getValue(wireA)
      const right = getValue(wireB)
      if (left === undefined || right === undefined) {
        queue.push(command)
        continue
      }
      switch (op) {
        case 'AND':
          values.set(dest, left & right)
          break
        case 'OR':
          values.set(dest, left | right)
          break
        default:
          throw new Error('invalid operation')
      }
    }

    return values
  }

  const exec1 = execCommands(commands)
  const part1 = exec1.get('a')!

  const bAssignIndex = commands.findIndex((command) => command.endsWith('-> b'))
  commands[bAssignIndex] = `${part1} -> b`
  const exec2 = execCommands(commands)

  const part2 = exec2.get('a')!

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
