import { readFile } from '../../utils/io'
import { Dir, turnLeft, turnRight } from '../../utils/space/Dir'
import { p, Pos } from '../../utils/space/Pos'
import { DaySolution } from '../../utils/type'

export default async function (inputFile: string): Promise<DaySolution> {
  const input = await readFile(inputFile).then((text) => text.trim())
  const instructions = input.split(', ')

  const t0 = performance.now()

  const origin = p(0, 0)
  const path: Pos[] = [origin]

  let dir = Dir.UP
  let lastPos = origin
  let visitedTwicePos: Pos | null = null

  instructions.forEach((instruction) => {
    const match = instruction.match(/([LR])(\d+)/)
    if (match === null) throw new Error('invalid instruction')
    const turn = match[1]
    dir = turn === 'L' ? turnLeft(dir) : turnRight(dir)
    const steps = parseInt(match[2])

    const newPosList = lastPos.stepsToShift(dir, steps)
    newPosList.forEach((newPos) => {
      if (visitedTwicePos === null && path.some((p) => p.equals(newPos))) {
        visitedTwicePos = newPos
      }
      path.push(newPos)
      lastPos = newPos
    })
  })

  const part1 = lastPos.manhattanDistance(origin)
  const part2 = visitedTwicePos!.manhattanDistance(origin)

  const t1 = performance.now()

  return [part1, part2, t1 - t0]
}
