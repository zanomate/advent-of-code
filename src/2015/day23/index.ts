import { readFile } from '../../utils/io'

function exec(lines: string[], a: number, b: number): number {
  let cursor = 0

  let reg
  let offset
  while (cursor < lines.length) {
    const line = lines[cursor]
    const command = line.slice(0, 3)
    switch (command) {
      case 'hlf':
        reg = line.slice(4)
        if (reg === 'a') a /= 2
        if (reg === 'b') b /= 2
        cursor++
        break
      case 'tpl':
        reg = line.slice(4)
        if (reg === 'a') a *= 3
        if (reg === 'b') b *= 3
        cursor++
        break
      case 'inc':
        reg = line.slice(4)
        if (reg === 'a') a++
        if (reg === 'b') b++
        cursor++
        break
      case 'jmp':
        offset = parseInt(line.slice(4))
        cursor += offset
        break
      case 'jie':
        reg = line.slice(4, 5)
        offset = parseInt(line.slice(7))
        if (reg === 'a' && a % 2 === 0) cursor += offset
        else if (reg === 'b' && b % 2 === 0) cursor += offset
        else cursor++
        break
      case 'jio':
        reg = line.slice(4, 5)
        offset = parseInt(line.slice(7))
        if (reg === 'a' && a === 1) cursor += offset
        else if (reg === 'b' && b === 1) cursor += offset
        else cursor++
        break
      default:
        throw new Error('invalid line')
    }
  }
  return b
}

export default async function () {
  const input = await readFile('./src/2015/day23/input.txt').then((text) => text.trim())
  const lines = input.split('\n')

  const part1 = exec(lines, 0, 0)
  console.log('Part 1:', part1)

  const part2 = exec(lines, 1, 0)
  console.log('Part 1:', part2)
}
