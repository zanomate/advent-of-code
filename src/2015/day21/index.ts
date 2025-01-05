import { readFile } from '../../utils/io'

interface Entity {
  hp: number
  damage: number
  armor: number
}

interface Item {
  cost: number
  damageBonus: number
  armorBonus: number
}

const WEAPONS: Item[] = [
  { cost: 8, damageBonus: 4, armorBonus: 0 },
  { cost: 10, damageBonus: 5, armorBonus: 0 },
  { cost: 25, damageBonus: 6, armorBonus: 0 },
  { cost: 40, damageBonus: 7, armorBonus: 0 },
  { cost: 74, damageBonus: 8, armorBonus: 0 },
]

const ARMORS: Item[] = [
  { cost: 13, damageBonus: 0, armorBonus: 1 },
  { cost: 31, damageBonus: 0, armorBonus: 2 },
  { cost: 53, damageBonus: 0, armorBonus: 3 },
  { cost: 75, damageBonus: 0, armorBonus: 4 },
  { cost: 102, damageBonus: 0, armorBonus: 5 },
]

const RINGS: Item[] = [
  { cost: 25, damageBonus: 1, armorBonus: 0 },
  { cost: 50, damageBonus: 2, armorBonus: 0 },
  { cost: 100, damageBonus: 3, armorBonus: 0 },
  { cost: 20, damageBonus: 0, armorBonus: 1 },
  { cost: 40, damageBonus: 0, armorBonus: 2 },
  { cost: 80, damageBonus: 0, armorBonus: 3 },
]

type Gear = {
  weapon: number
  armor: number | null
  ring1: number | null
  ring2: number | null
}

function equipPlayer(gear: Gear): [Entity, number] {
  const items: Item[] = [WEAPONS[gear.weapon]]
  if (gear.armor !== null) items.push(ARMORS[gear.armor])
  if (gear.ring1 !== null) items.push(RINGS[gear.ring1])
  if (gear.ring2 !== null) items.push(RINGS[gear.ring2])

  const player = {
    hp: 100,
    armor: items.reduce((tot, item) => tot + item.armorBonus, 0),
    damage: items.reduce((tot, item) => tot + item.damageBonus, 0),
  }
  const golds = items.reduce((tot, item) => tot + item.cost, 0)

  return [player, golds]
}

function fight(player: Entity, boss: Entity): boolean {
  let playerHp = player.hp
  let bossHp = boss.hp
  let playerTurn: boolean = true
  while (playerHp > 0 && bossHp > 0) {
    if (playerTurn) bossHp -= Math.max(1, player.damage - boss.armor)
    else playerHp -= Math.max(1, boss.damage - player.armor)
    playerTurn = !playerTurn
  }
  return bossHp <= 0
}

export default async function () {
  const input = await readFile('./src/2015/day21/input.txt').then((text) => text.trim())
  const [line1, line2, line3] = input.split('\n')
  const match1 = line1.match(/Hit Points: (\d+)/)
  const match2 = line2.match(/Damage: (\d+)/)
  const match3 = line3.match(/Armor: (\d+)/)
  if (match1 === null || match2 === null || match3 === null) throw new Error('invalid input')
  const hp = parseInt(match1[1])
  const damage = parseInt(match2[1])
  const armor = parseInt(match3[1])
  const boss: Entity = { hp, damage, armor }

  const weaponIndexes = Object.keys(WEAPONS).map((k) => parseInt(k))
  const armorIndexes = Object.keys(ARMORS).map((k) => parseInt(k))
  const ringIndexes = Object.keys(RINGS).map((k) => parseInt(k))
  const possibleGears: Gear[] = weaponIndexes.flatMap((weaponIndex) => {
    return [...armorIndexes, null].flatMap((armorIndex) => {
      return [...ringIndexes, null].flatMap((ring1Index, i) => {
        return [...ringIndexes.toSpliced(i, 1), null].map((ring2Index) => {
          return {
            weapon: weaponIndex,
            armor: armorIndex,
            ring1: ring1Index,
            ring2: ring2Index,
          }
        })
      })
    })
  })

  let minGolds = Infinity
  let maxGolds = 0
  possibleGears.forEach((gear) => {
    const [player, golds] = equipPlayer(gear)
    const win = fight(player, boss)
    if (win) minGolds = Math.min(minGolds, golds)
    else maxGolds = Math.max(maxGolds, golds)
  })

  console.log('Part 1:', minGolds)
  console.log('Part 2:', maxGolds)
}
