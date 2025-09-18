import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

function evolve(polymer: string): string {
  return polymer.replaceAll(
    /aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz/g,
    '',
  )
}

function resolve(initialPolymer: string): number {
  let polymer = initialPolymer
  let nextPolymer = initialPolymer
  while ((nextPolymer = evolve(polymer)).length < polymer.length) polymer = nextPolymer
  return polymer.length
}

function findBestResolutionRemovingOneUnit(initialPolymer: string): number {
  let best = Infinity
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach((letter) => {
    const polymer = initialPolymer.replaceAll(letter, '').replaceAll(letter.toUpperCase(), '')
    best = Math.min(best, resolve(polymer))
  })
  return best
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())

  const t0 = performance.now()
  const part1 = resolve(input)
  const part2 = findBestResolutionRemovingOneUnit(input)
  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
