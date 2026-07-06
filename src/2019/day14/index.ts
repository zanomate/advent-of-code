import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

type Ingredient = { name: string; amount: number }
type Reaction = { output: Ingredient; inputs: Ingredient[] }

function parseReactions(input: string): Map<string, Reaction> {
  const reactions = new Map<string, Reaction>()
  for (const line of input.trim().split('\n')) {
    const [lhs, rhs] = line.split('=>')
    const parseIngredient = (s: string): Ingredient => {
      const [amount, name] = s.trim().split(/\s+/)
      return { name, amount: Number(amount) }
    }
    const output = parseIngredient(rhs)
    const inputs = lhs.split(',').map(parseIngredient)
    reactions.set(output.name, { output, inputs })
  }
  return reactions
}

function oreFor(fuel: number, reactions: Map<string, Reaction>): number {
  const surplus = new Map<string, number>()
  let ore = 0

  const produce = (name: string, amount: number): void => {
    if (name === 'ORE') {
      ore += amount
      return
    }
    const have = surplus.get(name) ?? 0
    const used = Math.min(have, amount)
    surplus.set(name, have - used)
    let needed = amount - used
    if (needed === 0) return

    const reaction = reactions.get(name)!
    const batches = Math.ceil(needed / reaction.output.amount)
    for (const ingredient of reaction.inputs) {
      produce(ingredient.name, ingredient.amount * batches)
    }
    surplus.set(name, (surplus.get(name) ?? 0) + batches * reaction.output.amount - needed)
  }

  produce('FUEL', fuel)
  return ore
}

function resolvePart1(reactions: Map<string, Reaction>) {
  return oreFor(1, reactions)
}

function resolvePart2(reactions: Map<string, Reaction>) {
  const target = 1_000_000_000_000
  let low = 1
  let high = target // one fuel always costs >= 1 ore, so this bounds it
  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2)
    if (oreFor(mid, reactions) <= target) low = mid
    else high = mid - 1
  }
  return low
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile)
  const reactions = parseReactions(input)

  const t0 = performance.now()

  let part1 = resolvePart1(reactions)
  let part2 = resolvePart2(reactions)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
