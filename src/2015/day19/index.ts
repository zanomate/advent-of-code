import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Replacement = [string, string]

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [replacementsInput, molecule] = input.split('\n\n')

  const t0 = performance.now()

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

  const part1 = allSubs.length

  let part2 = 0
  let current = molecule
  while (current !== 'e') {
    for (let [from, to] of replacements) {
      if (current.includes(to)) {
        current = current.replace(new RegExp(to), from)
        part2++
      }
    }
  }

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
