import { readFile, readNumericParameter } from '../../utils/io'
import { DaySolution } from '../../utils/type'
import { p, Pos } from '../../utils/space/Pos'

function findNearestIndexes(from: Pos, toList: Pos[]): number[] {
  let shortestDistance = Infinity
  let nearestIndexes: number[] = []
  toList.forEach((to, index) => {
    const distance = from.manhattanDistance(to)
    if (distance < shortestDistance) {
      shortestDistance = distance
      nearestIndexes = [index]
    } else if (distance === shortestDistance) {
      nearestIndexes.push(index)
    }
  })
  return nearestIndexes
}

function findTotalDistance(from: Pos, toList: Pos[]): number {
  return toList.reduce((tot, to) => tot + from.manhattanDistance(to), 0)
}

export default async function (inputFile: string, parameters: string[]): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const maxDistance = readNumericParameter('maxDistance', parameters[0])

  const points = input.split('\n').map((line) => {
    const [x, y] = line.split(', ')
    return p(Number(x), Number(y))
  })

  const t0 = performance.now()

  const maxX = Math.max(...points.map((p) => p.x))
  const maxY = Math.max(...points.map((p) => p.y))
  const excludedIndexes = new Set<number>()
  const areaSizeByIndex = new Map<number, number>()

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      const nearestIndexes = findNearestIndexes(p(x, y), points)
      if (nearestIndexes.length === 1) {
        const nearestIndex = nearestIndexes[0]
        areaSizeByIndex.set(nearestIndex, (areaSizeByIndex.get(nearestIndex) ?? 0) + 1)
        if (x === 0 || x === maxX || y === 0 || y === maxY) excludedIndexes.add(nearestIndex)
      }
    }
  }

  let biggestSize = 0
  points.forEach((_, index) => {
    if (!excludedIndexes.has(index)) {
      const size = areaSizeByIndex.get(index)!
      if (size > biggestSize) {
        biggestSize = size
      }
    }
  })

  const part1 = biggestSize

  let areaSize = 0
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (findTotalDistance(p(x, y), points) < maxDistance) areaSize++
    }
  }

  const part2 = areaSize
  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
