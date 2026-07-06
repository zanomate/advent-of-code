import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

/** Map from a body to the body it directly orbits. */
function parseOrbits(input: string): Map<string, string> {
  const parent = new Map<string, string>()
  for (const line of input.trim().split('\n')) {
    const [center, satellite] = line.trim().split(')')
    parent.set(satellite, center)
  }
  return parent
}

/** Chain of ancestors from a body up to (but excluding) the root. */
function ancestors(parent: Map<string, string>, body: string): string[] {
  const chain: string[] = []
  let current = parent.get(body)
  while (current !== undefined) {
    chain.push(current)
    current = parent.get(current)
  }
  return chain
}

function resolvePart1(parent: Map<string, string>) {
  let total = 0
  for (const body of parent.keys()) total += ancestors(parent, body).length
  return total
}

function resolvePart2(parent: Map<string, string>) {
  const you = ancestors(parent, 'YOU')
  const san = ancestors(parent, 'SAN')
  const sanIndex = new Map(san.map((body, i) => [body, i]))
  for (let i = 0; i < you.length; i++) {
    if (sanIndex.has(you[i])) return i + sanIndex.get(you[i])!
  }
  return null
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const parent = parseOrbits(input)

  const t0 = performance.now()

  let part1 = resolvePart1(parent)
  let part2 = resolvePart2(parent)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
