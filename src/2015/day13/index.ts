import { readFile } from '../../utils/io'

const permutations = <T>(list: T[]): T[][] => {
  if (list.length === 0) return [[]]
  if (list.length === 1) return [list]

  const res = []

  for (let i = 0; i < list.length; i++) {
    const current = list[i]
    const others = list.toSpliced(i, 1)
    const othersPermutations = permutations(others)

    for (const permutaion of othersPermutations) {
      res.push([current, ...permutaion])
    }
  }

  return res
}

export default async function () {
  const input = await readFile('./src/2015/day13/input.txt').then((text) => text.trim())

  const happy: Record<string, Record<string, number>> = {}

  input.split('\n').forEach((line) => {
    const match = line.match(/(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)./)
    if (match === null) throw new Error('invalid line')
    if (happy[match[1]] === undefined) happy[match[1]] = {}
    happy[match[1]][match[4]] = (match[2] === 'gain' ? 1 : -1) * parseInt(match[3])
  })

  const names = Object.keys(happy)
  let highScore1 = 0
  permutations(names).forEach((permutation) => {
    const score = permutation.reduce((tot, name, i) => {
      const prevName = permutation[(names.length + i + -1) % names.length]
      const nextName = permutation[(i + 1) % names.length]
      return tot + happy[name][nextName] + happy[name][prevName]
    }, 0)
    if (score > highScore1) highScore1 = score
  })

  console.log('Part 1:', highScore1)

  const namesWithMe = [...names, 'me']
  let highScore2 = 0
  permutations(namesWithMe).forEach((permutation) => {
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
  console.log('Part 2:', highScore2)
}
