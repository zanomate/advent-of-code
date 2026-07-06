import { readFile } from '../../utils/io'
import { DaySolution, PartSolution } from '../../utils/type'

type Side = 'immune' | 'infection'

interface Group {
  side: Side
  units: number
  hp: number
  damage: number
  attack: string
  initiative: number
  weak: Set<string>
  immune: Set<string>
}

const effectivePower = (g: Group): number => g.units * g.damage

// Damage `attacker` would deal to `target` this turn, before unit losses,
// accounting for the target's immunities (x0) and weaknesses (x2).
function damageTo(attacker: Group, target: Group): number {
  if (target.immune.has(attacker.attack)) return 0
  const power = effectivePower(attacker)
  return target.weak.has(attacker.attack) ? power * 2 : power
}

function parseGroup(line: string, side: Side): Group {
  const m = line.match(
    /(\d+) units each with (\d+) hit points (?:\((.*)\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/,
  )!
  const [, units, hp, modifiers, damage, attack, initiative] = m
  const weak = new Set<string>()
  const immune = new Set<string>()
  if (modifiers) {
    for (const part of modifiers.split('; ')) {
      const [kind, list] = part.split(' to ')
      const target = kind === 'weak' ? weak : immune
      for (const type of list.split(', ')) target.add(type)
    }
  }
  return {
    side,
    units: Number(units),
    hp: Number(hp),
    damage: Number(damage),
    attack,
    initiative: Number(initiative),
    weak,
    immune,
  }
}

function parse(input: string): Group[] {
  const [immuneBlock, infectionBlock] = input.split('\n\n')
  const groups: Group[] = []
  for (const line of immuneBlock.split('\n').slice(1)) groups.push(parseGroup(line, 'immune'))
  for (const line of infectionBlock.split('\n').slice(1)) groups.push(parseGroup(line, 'infection'))
  return groups
}

const clone = (groups: Group[]): Group[] =>
  groups.map((g) => ({ ...g, weak: new Set(g.weak), immune: new Set(g.immune) }))

// Run the battle to completion. Returns the winning side and its surviving unit
// count, or null on a stalemate (a full round with no unit killed).
function fight(groups: Group[]): { side: Side; units: number } | null {
  const alive = clone(groups)

  while (true) {
    const active = alive.filter((g) => g.units > 0)
    if (active.every((g) => g.side === 'immune') || active.every((g) => g.side === 'infection')) {
      return { side: active[0].side, units: active.reduce((s, g) => s + g.units, 0) }
    }

    // Target selection: strongest groups pick first; each takes the enemy it
    // damages most (ties broken by enemy power then initiative).
    const selectors = [...active].sort(
      (a, b) => effectivePower(b) - effectivePower(a) || b.initiative - a.initiative,
    )
    const chosen = new Map<Group, Group>()
    const taken = new Set<Group>()
    for (const attacker of selectors) {
      let best: Group | null = null
      let bestDamage = 0
      for (const target of active) {
        if (target.side === attacker.side || taken.has(target)) continue
        const dmg = damageTo(attacker, target)
        if (dmg === 0) continue
        if (
          dmg > bestDamage ||
          (dmg === bestDamage &&
            best !== null &&
            (effectivePower(target) > effectivePower(best) ||
              (effectivePower(target) === effectivePower(best) &&
                target.initiative > best.initiative)))
        ) {
          best = target
          bestDamage = dmg
        }
      }
      if (best) {
        chosen.set(attacker, best)
        taken.add(best)
      }
    }

    // Attack in decreasing initiative; count units killed across the round.
    let killed = 0
    const order = [...chosen.keys()].sort((a, b) => b.initiative - a.initiative)
    for (const attacker of order) {
      if (attacker.units <= 0) continue
      const target = chosen.get(attacker)!
      const dead = Math.min(target.units, Math.floor(damageTo(attacker, target) / target.hp))
      target.units -= dead
      killed += dead
    }

    if (killed === 0) return null
  }
}

function resolvePart1(groups: Group[]): number {
  return fight(groups)!.units
}

// Smallest attack boost for the immune system that makes it win. A boost that
// ends in a stalemate does not count as a win, so keep raising it.
function resolvePart2(groups: Group[]): number {
  for (let boost = 1; ; boost++) {
    const boosted = clone(groups)
    for (const g of boosted) if (g.side === 'immune') g.damage += boost
    const result = fight(boosted)
    if (result && result.side === 'immune') return result.units
  }
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.replace(/\r\n/g, '\n').trim())
  const groups = parse(input)

  const t0 = performance.now()

  const part1: PartSolution = resolvePart1(groups)
  const part2: PartSolution = resolvePart2(groups)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
