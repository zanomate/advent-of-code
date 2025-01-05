import { readFile } from '../../utils/io'

export default async function () {
  const input = await readFile('./src/2015/day8/input.txt').then((text) => text.trim())
  const strings = input.split('\n')

  const countChars = (str: string): number => {
    if (str.length === 0) return 0
    if (str.startsWith('"')) return countChars(str.slice(1))
    if (str.startsWith('\\\\')) return 1 + countChars(str.slice(2))
    if (str.startsWith('\\"')) return 1 + countChars(str.slice(2))
    if (str.startsWith('\\x')) return 1 + countChars(str.slice(4))
    return 1 + countChars(str.slice(1))
  }

  const countEncodedChars = (str: string): number => {
    if (str.length === 0) return 2
    if (str.startsWith('"')) return 2 + countEncodedChars(str.slice(1))
    if (str.startsWith('\\\\')) return 4 + countEncodedChars(str.slice(2))
    if (str.startsWith('\\"')) return 4 + countEncodedChars(str.slice(2))
    if (str.startsWith('\\x')) return 5 + countEncodedChars(str.slice(4))
    return 1 + countEncodedChars(str.slice(1))
  }

  const codeChars = strings.reduce((tot, str) => tot + str.length, 0)
  const memoryChars = strings.reduce((tot, str) => tot + countChars(str), 0)
  const encodedChars = strings.reduce((tot, str) => tot + countEncodedChars(str), 0)

  console.log('Part 1:', codeChars - memoryChars)
  console.log('Part 2:', encodedChars - codeChars)
}
