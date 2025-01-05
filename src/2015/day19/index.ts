import { readFile } from '../../utils/io'

type Replacement = [string, string]

export default async function () {
  const input = await readFile('./src/2015/day19/input.txt').then((text) => text.trim())
  const [replacementsInput, molecule] = input.split('\n\n')

  const replacements: Replacement[] = replacementsInput
    .split('\n')
    .map((line) => line.split(' => ') as [string, string])
    .sort((r1, r2) => r2[1].length - r1[1].length)

  const evolve = (molecule: string): string[] => {
    const res = new Set<string>()
    replacements.forEach(([from, to]) => {
      for (let match of molecule.matchAll(new RegExp(from, 'g'))) {
        res.add(molecule.slice(0, match.index) + molecule.slice(match.index).replace(from, to))
      }
    })
    return Array.from(res)
  }

  const allSubs = evolve(molecule)

  console.log('Part 1:', allSubs.length)

  let iter = 0
  let current = molecule
  while (current !== 'e') {
    for (let [from, to] of replacements) {
      if (current.includes(to)) {
        current = current.replace(new RegExp(to), from)
        iter++
      }
    }
  }

  console.log('Part 2:', iter)
}
