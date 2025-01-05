import { readFile } from '../../utils/io'

const a = 'a'.charCodeAt(0)
const totalChars = 'z'.charCodeAt(0) - a + 1

export default async function () {
  const input = await readFile('./src/2015/day11/input.txt').then((text) => text.trim())

  const nextLetter = (char: string): string => String.fromCharCode(((char.charCodeAt(0) - a + 1) % totalChars) + a)

  const nextPsw = (psw: string): string => {
    const chars = psw.split('')
    let i = chars.length - 1
    while (i >= 0) {
      chars[i] = nextLetter(chars[i])
      if (chars[i] !== 'a') break
      i--
    }
    return chars.join('')
  }

  const illegalChars = ['i', 'o', 'l']

  const sequences: string[] = Array.from({ length: totalChars - 2 }, (_, i) => {
    const l1 = String.fromCharCode(a + i)
    const l2 = nextLetter(l1)
    const l3 = nextLetter(l2)
    return [l1, l2, l3].join('')
  })

  const checkValidity = (psw: string): boolean => {
    if (illegalChars.some((illegalChar) => psw.includes(illegalChar))) return false
    if (sequences.every((sequence) => !psw.includes(sequence))) return false
    if (!psw.match(/(.)\1.*(.)\2/)) return false
    return true
  }

  let part1 = input
  let valid = false
  while (!valid) {
    part1 = nextPsw(part1)
    valid = checkValidity(part1)
  }

  let part2 = part1
  valid = false
  while (!valid) {
    part2 = nextPsw(part2)
    valid = checkValidity(part2)
  }

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
}