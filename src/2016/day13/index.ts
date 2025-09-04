import { readFile } from '../../utils/io'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const [favoriteNumber, dest] = input.split('\n')
  const [x, y] = dest.split(',')
  const start = p(1, 1)
  const target = p(Number(x), Number(y))

  const isWall = (pos: Pos): boolean => {
    const x = pos.x
    const y = pos.y
    const dex: number = x * x + 3 * x + 2 * x * y + y + y * y + Number(favoriteNumber)
    const bin = dex.toString(2)
    const bits = bin.split('')
    const ones = bits.filter((bit) => bit === '1').length
    return ones % 2 !== 0
  }

  const resolvePt1 = (): number => {
    const shortestPath = new Map<string, number>()
    shortestPath.set(start.toString(), 0)

    const queue: Pos[] = [start]
    while (queue.length) {
      const current = queue.shift()! as Pos
      if (current.equals(target)) break

      current
        .neighbours()
        .filter((neighbour) => neighbour.isPositive && !isWall(neighbour))
        .forEach((neighbour) => {
          const currentValue = shortestPath.get(current.toString())!
          const neighbourPrevValue = shortestPath.get(neighbour.toString()) || Infinity
          if (neighbourPrevValue > currentValue + 1) {
            shortestPath.set(neighbour.toString(), currentValue + 1)
            queue.push(neighbour)
          }
        })
    }

    return shortestPath.get(target.toString())!
  }

  const resolvePt2 = (): number => {
    const shortestPath = new Map<string, number>()
    shortestPath.set(start.toString(), 0)
    const reachedPos = new Set<string>()
    const queue: Pos[] = [start]
    while (queue.length) {
      const current = queue.shift()! as Pos
      reachedPos.add(current.toString())

      current
        .neighbours()
        .filter((neighbour) => neighbour.isPositive && !isWall(neighbour))
        .forEach((neighbour) => {
          const currentValue = shortestPath.get(current.toString())!
          const neighbourPrevValue = shortestPath.get(neighbour.toString()) || Infinity
          if (neighbourPrevValue > currentValue + 1) {
            const neighbourNewValue = currentValue + 1
            shortestPath.set(neighbour.toString(), neighbourNewValue)
            if (neighbourNewValue <= 50) queue.push(neighbour)
          }
        })
    }

    return reachedPos.size
  }

  const t0 = performance.now()

  const part1: number = resolvePt1()

  const part2: number = resolvePt2()

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
