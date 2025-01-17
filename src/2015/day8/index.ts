import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const strings = input.split('\n')

  const t0 = performance.now()

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

  const part1 = codeChars - memoryChars
  const part2 = encodedChars - codeChars

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
