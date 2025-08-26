import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')

  let validLines = lines

  const t0 = performance.now()

  const isPassphraseValid = (passphrase: string) => {
    const words = passphrase.split(' ')
    const set = new Set(words)
    return words.length === set.size
  }

  validLines = lines.filter((line) => isPassphraseValid(line))
  const part1 = validLines.length

  const isAnagram = (w1: string, w2: string) => {
    const w1Sorted = w1.split('').sort().join()
    const w2Sorted = w2.split('').sort().join()
    return w1Sorted === w2Sorted
  }

  validLines = validLines.filter((passphrase) => {
    const words = passphrase.split(' ')
    return words.every((w1, i) => {
      const otherWords = words.slice(i + 1)
      return otherWords.every((w2, i) => !isAnagram(w1, w2))
    })
  })

  const part2 = validLines.length

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
