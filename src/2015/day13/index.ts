import { readFile } from '../../utils/io'
import { getPermutations } from '../../utils/math'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()

  const happy: Record<string, Record<string, number>> = {}

  input.split('\n').forEach((line) => {
    const match = line.match(/(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)./)
    if (match === null) throw new Error('invalid line')
    if (happy[match[1]] === undefined) happy[match[1]] = {}
    happy[match[1]][match[4]] = (match[2] === 'gain' ? 1 : -1) * parseInt(match[3])
  })

  const names = Object.keys(happy)
  let highScore1 = 0
  getPermutations(names).forEach((permutation) => {
    const score = permutation.reduce((tot, name, i) => {
      const prevName = permutation[(names.length + i + -1) % names.length]
      const nextName = permutation[(i + 1) % names.length]
      return tot + happy[name][nextName] + happy[name][prevName]
    }, 0)
    if (score > highScore1) highScore1 = score
  })

  const namesWithMe = [...names, 'me']
  let highScore2 = 0
  getPermutations(namesWithMe).forEach((permutation) => {
    const score = permutation.reduce((tot, name, i) => {
      if (name === 'me') return tot
      const prevName = permutation[(namesWithMe.length + i + -1) % namesWithMe.length]
      const nextName = permutation[(i + 1) % namesWithMe.length]
      const happyWithPrev = prevName === 'me' ? 0 : happy[name][prevName]
      const happyWithNext = nextName === 'me' ? 0 : happy[name][nextName]
      return tot + happyWithPrev + happyWithNext
    }, 0)
    if (score > highScore2) highScore2 = score
  })

  const t1 = performance.now()

  return [highScore1, highScore2, t1 - t0]
}
