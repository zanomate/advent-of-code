import { clone } from 'lodash'
import isEqual from 'lodash/isEqual'
import { readFile } from '../../utils/io'
import { getCombinations } from '../../utils/math'
import { DaySolution } from '../../utils/type'

interface Item {
  type: 'generator' | 'microchip'
  element: string
}

interface Floor {
  num: number
  items: Item[]
}

type MoveDirection = 'up' | 'down'

interface Move {
  dir: MoveDirection
  items: Item[]
}

interface Config {
  elevator: number
  minFloor: number
  moves: number
  floors: Floor[]
}

const itemComparer = (a: Item, b: Item): number => {
  if (a.type === b.type) {
    return a.element.localeCompare(b.element)
  } else {
    return a.type.localeCompare(b.type)
  }
}

const isFloorContainingItem = (floor: Floor, item: Item): boolean => {
  return floor.items.some((i) => isEqual(i, item))
}

const areItemsOkTogether = (items: Item[]): boolean => {
  const generators = items.filter((item) => item.type === 'generator')
  const microchips = items.filter((item) => item.type === 'microchip')
  if (generators.length === 0 || microchips.length === 0) return true
  return microchips.every((chip) => generators.some((gen) => gen.element === chip.element))
}

const isMovePossible = (config: Config, move: Move): boolean => {
  if (move.items.length === 0 || move.items.length > 2) return false
  if (move.items.some((item) => !isFloorContainingItem(config.floors[config.elevator], item))) return false
  if (config.elevator === config.minFloor && move.dir === 'down') return false
  if (config.elevator === config.floors.length - 1 && move.dir === 'up') return false
  const startFloorPrevItems = config.floors[config.elevator].items
  const startFloorItems = startFloorPrevItems.filter((item) => !move.items.some((i) => isEqual(i, item)))
  const targetFloorPrevItems = config.floors[config.elevator + (move.dir === 'up' ? 1 : -1)].items
  const targetFloorItems = [...targetFloorPrevItems, ...move.items]
  return areItemsOkTogether(startFloorItems) && areItemsOkTogether(targetFloorItems)
}

const getNextConfig = (config: Config, move: Move): Config => {
  const nextFloors = config.floors.map((floor) => {
    if (floor.num === config.elevator) {
      return {
        ...floor,
        items: floor.items.filter((item) => !move.items.some((i) => isEqual(i, item))),
      }
    } else if (floor.num === config.elevator + (move.dir === 'up' ? 1 : -1)) {
      return { ...floor, items: [...floor.items, ...move.items] }
    } else {
      return floor
    }
  })

  return {
    elevator: config.elevator + (move.dir === 'up' ? 1 : -1),
    minFloor: nextFloors.findIndex((f) => f.items.length),
    moves: config.moves + 1,
    floors: nextFloors,
  }
}

const isSolved = (config: Config): boolean => {
  return config.floors.every((floor) => floor.num === config.floors.length - 1 || floor.items.length === 0)
}

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const lines = input.split('\n')
  const config1: Config = {
    elevator: 0,
    minFloor: 0,
    moves: 0,
    floors: [],
  }
  lines.forEach((line, i) => {
    const [, ...items] = line.split(/contains a|,? and a|, a/)
    config1.floors.push({
      num: i,
      items: items
        .map((item) => {
          const match = item.match(/([a-z]+)(?:-compatible)? (microchip|generator)/)
          if (!match) throw new Error('Invalid item')
          const [, element, type] = match
          return { type, element } as Item
        })
        .sort(itemComparer),
    })
  })

  const resolve = (config: Config): number => {
    const elements = Array.from(new Set(config.floors.flatMap((floor) => floor.items.flatMap((i) => i.element))))

    const getHash = (config: Config): string =>
      `${config.elevator}-${JSON.stringify(
        elements
          .map((e) =>
            JSON.stringify([
              config.floors.findIndex((f) => f.items.some((i) => i.type === 'generator' && i.element === e)),
              config.floors.findIndex((f) => f.items.some((i) => i.type === 'microchip' && i.element === e)),
            ]),
          )
          .sort(),
      )}`

    const visited: string[] = []
    const queue: Config[] = [config]

    while (queue.length > 0) {
      const current = queue.shift() as Config

      const currentHash = getHash(current)
      if (visited.some((visitedHash) => visitedHash === currentHash)) continue
      visited.push(currentHash)

      if (isSolved(current)) return current.moves

      const combinations2Items = getCombinations(current.floors[current.elevator].items, 2)
      const combinations1Item = getCombinations(current.floors[current.elevator].items, 1)

      const possibleMoves: Move[] = [
        ...combinations2Items.map<Move>((items) => ({ dir: 'up', items })),
        ...combinations1Item.map<Move>((items) => ({ dir: 'up', items })),
        ...combinations1Item.map<Move>((items) => ({ dir: 'down', items })),
        ...combinations2Items.map<Move>((items) => ({ dir: 'down', items })),
      ].filter((move) => isMovePossible(current, move))

      possibleMoves.forEach((move, i) => {
        queue.push(getNextConfig(current, move))
      })
    }

    return Infinity
  }

  const t0 = performance.now()

  const part1: number = resolve(config1)

  const config2 = clone(config1)
  config2.floors[0].items.push(
    { type: 'generator', element: 'elerium' },
    { type: 'microchip', element: 'elerium' },
    { type: 'generator', element: 'dilithium' },
    { type: 'microchip', element: 'dilithium' },
  )

  const part2: number = resolve(config2)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
