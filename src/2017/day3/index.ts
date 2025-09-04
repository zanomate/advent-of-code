import { readFile } from '../../utils/io'
import { Dir, turnLeft } from '../../utils/space/Dir'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const target = parseInt(input)

  const t0 = performance.now()

  let side = 1
  let perimeter = 1
  let prevTotal = 0
  let total = 1
  let level = 0
  while (total < target) {
    prevTotal = total
    side += 2
    perimeter = side * 4 - 4
    total += perimeter
    level++
  }

  const sidePos = level ? (target - prevTotal) % (side - 1) : 0
  const part1 = level + Math.abs(sidePos - level)

  let pos = p(0, 0)
  let dir = Dir.RIGHT

  const map = new Map<string, number | null>()

  const getPos = (pos: Pos): number | null => {
    const key = pos.toString()
    const value = map.get(key)
    if (value === undefined) return 0
    return value
  }

  const isPosFree = (pos: Pos) => {
    return getPos(pos) !== null
  }

  const getNextPos = (pos: Pos): Pos => {
    if (pos.x === 0 && pos.y === 0) return p(1, 0)
    const turnDir = turnLeft(dir)
    const turnPos = pos.shift(turnDir)
    if (isPosFree(turnPos)) {
      dir = turnDir
      return turnPos
    }
    return pos.shift(dir)
  }

  const addAtPos = (pos: Pos, value: number) => {
    const key = pos.toString()
    if (!map.has(key)) map.set(key, value)
    else {
      const prev = map.get(key)!
      if (prev !== null) {
        map.set(key, prev + value)
      }
    }
  }

  const confirmPos = (pos: Pos): number => {
    const key = pos.toString()
    const value = getPos(pos) as number
    map.set(key, null)
    return value
  }

  let current = 1
  confirmPos(pos)

  while (current <= target) {
    pos.neighbours('8').forEach((pos) => addAtPos(pos, current))
    pos = getNextPos(pos)
    current = confirmPos(pos)
  }

  const part2 = current

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
