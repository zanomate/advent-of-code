import { cloneDeep } from 'lodash'
import { readFile } from '../../utils/io'
import { DaySolution } from '../../utils/type'

interface Stats {
  playerHp: number
  playerMana: number
  playerArmor: number
  playerEffects: LastingEffect[]
  bossHp: number
  bossDamage: number
}

interface Magic {
  cost: number
  instantEffects?: Effect[]
  lastingEffects?: LastingEffect[]
}

type EffectType = 'armor' | 'damage' | 'recharge' | 'heal'

interface Effect {
  type: EffectType
  value: number
}

interface LastingEffect extends Effect {
  duration: number
  type: EffectType
  value: number
}

const MAGICS: Magic[] = [
  { cost: 53, instantEffects: [{ type: 'damage', value: 4 }] },
  {
    cost: 73,
    instantEffects: [
      { type: 'damage', value: 2 },
      { type: 'heal', value: 2 },
    ],
  },
  { cost: 113, lastingEffects: [{ duration: 6, type: 'armor', value: 7 }] },
  { cost: 173, lastingEffects: [{ duration: 6, type: 'damage', value: 3 }] },
  { cost: 229, lastingEffects: [{ duration: 5, type: 'recharge', value: 101 }] },
]

function getAvailableMagics(stats: Stats): Magic[] {
  const effectsTypes = stats.playerEffects.map((e) => e.type)
  return MAGICS.filter((m) => {
    if (m.cost > stats.playerMana) return false
    if (m.lastingEffects?.length && m.lastingEffects.some((e) => effectsTypes.includes(e.type))) return false
    return true
  })
}

function applyInstantEffect(prevStats: Stats, effect: Effect): Stats {
  let stats = cloneDeep(prevStats)
  if (effect.type === 'damage') stats.bossHp -= effect.value
  if (effect.type === 'heal') stats.playerHp += effect.value
  return stats
}

function applyLastingEffects(prevStats: Stats): Stats {
  let stats = cloneDeep(prevStats)
  stats.playerEffects.forEach((effect) => {
    if (effect.type === 'armor') stats.playerArmor = effect.value
    if (effect.type === 'damage') stats.bossHp -= Math.max(1, effect.value)
    if (effect.type === 'recharge') stats.playerMana += effect.value
    effect.duration--
    if (effect.type === 'armor' && effect.duration === 0) stats.playerArmor = 0
  })
  stats.playerEffects = stats.playerEffects.filter((e) => e.duration > 0)
  return stats
}

const memo = new Map<string, number>()
const getMemoKey = (stats: Stats): string => JSON.stringify(stats)

function playerTurn(prevStats: Stats, hard: boolean): number {
  const memoKey = getMemoKey(prevStats)
  if (memo.has(memoKey)) return memo.get(memoKey)!

  let stats = cloneDeep(prevStats)
  if (hard) stats.playerHp -= 1
  if (stats.playerHp <= 0) {
    memo.set(memoKey, Infinity)
    return Infinity
  }
  stats = applyLastingEffects(stats)
  if (stats.bossHp <= 0) {
    memo.set(memoKey, 0)
    return 0
  }

  let minMana = Infinity
  const magics = getAvailableMagics(stats)
  magics.forEach((magic) => {
    let caseStats = cloneDeep(stats)
    let consumedMana = magic.cost
    caseStats.playerMana -= magic.cost

    if (magic.instantEffects?.length) {
      magic.instantEffects.forEach((e) => {
        caseStats = applyInstantEffect(caseStats, e)
      })
    }

    if (magic.lastingEffects?.length) {
      caseStats.playerEffects = [...caseStats.playerEffects, ...cloneDeep(magic.lastingEffects)]
    }

    if (caseStats.bossHp > 0) consumedMana += bossTurn(caseStats, hard)

    minMana = Math.min(minMana, consumedMana)
  })

  memo.set(memoKey, minMana)
  return minMana
}

function bossTurn(prevStats: Stats, hard: boolean = false): number {
  let stats = cloneDeep(prevStats)
  stats = applyLastingEffects(stats)

  if (stats.bossHp <= 0) return 0
  stats.playerHp -= Math.max(1, stats.bossDamage - stats.playerArmor)
  if (stats.playerHp <= 0) return Infinity

  return playerTurn(stats, hard)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [line1, line2] = input.split('\n')
  const match1 = line1.match(/Hit Points: (\d+)/)
  const match2 = line2.match(/Damage: (\d+)/)
  if (match1 === null || match2 === null) throw new Error('invalid input')
  const bossHp = parseInt(match1[1])
  const bossDamage = parseInt(match2[1])

  const t0 = performance.now()

  const initialStats: Stats = {
    playerHp: 50,
    playerMana: 500,
    playerArmor: 0,
    playerEffects: [],
    bossHp,
    bossDamage,
  }

  const minMana = playerTurn(initialStats, false)

  memo.clear()

  const minManaHard = playerTurn(initialStats, true)

  const t1 = performance.now()

  return [minMana, minManaHard, t1 - t0]
}
